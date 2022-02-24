from flask import request, Blueprint, jsonify, Response, make_response
import bcrypt
from datetime import datetime, timedelta, timezone
import os
import uuid
import json
from auth_token import Auth_Token
from functools import wraps
from models.enums import Roles


userBlueprint = Blueprint('user', __name__)

# decorator for verifying the JWT
# Template from GeeksForGeeks: https://www.geeksforgeeks.org/using-jwt-for-user-authentication-in-flask/
def token_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    from models.user import User
    token = None
    # jwt is passed in the request header
    if 'pbr_token' in request.cookies:
      token = request.cookies["pbr_token"]
    # return 401 if token is not passed
    if not token:
      return jsonify({'message' : 'Token is missing!'}), 401
    try:
      # PULL OUT DATA FROM TOKEN
      data = Auth_Token.decode_token(token)
      # GET AND RETURN CURRENT USER
      dbUser = User.query.filter_by(email=data["email"]).first()
    except jwt.ExpiredSignatureError as error:
      return jsonify({
        'message' : 'Token is expired!'
      }), 401
    else:
      return jsonify({
        'message' : 'Token is invalid!'
      }), 401
    # returns the current logged in users contex to the routes
    return  f(current_user, *args, **kwargs)
  return decorated

@userBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@userBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_all(item_id=None):
  from models.user import User
  return User.fs_get_delete_put_post(item_id)

@userBlueprint.route('/me', methods=['GET'])
def me():
  from models.user import User
  if 'pbr_token' in request.cookies:
    token = request.cookies['pbr_token']
    try:
      data = Auth_Token.decode_token(token)
      dbUser = User.query.filter_by(email=data["email"]).first()
      if dbUser:
        ret_user = {
          "email": dbUser.email,
          "firstname": dbUser.first_name,
          "lastname": dbUser.last_name,
        }
        return jsonify(ret_user), 200
      else:
        return jsonify({"message":"Unauthorized"}), 401
    except Exception as error:
      print(f'Token invalid. {error}')

  print(f'UNAUTHORIZED. {error}')
  return jsonify({"message":"Unauthorized"}), 401

@userBlueprint.route('/login', methods=['POST'])
def login():
  """
  Logs the current user in, getting email and password from payload
  If user doesn't exist, if fields are missing/invalid, incorrect password, return 401 
  """
  from models.user import User
  loggedIn = False

  content_type = request.headers.get('Content-Type')
  if (content_type == 'application/json'):
      data = request.json

  if data["email"] and data["password"]:
    dbUser = User.query.filter_by(email=data["email"]).first()
    if not dbUser:
      print("USER DOES NOT EXIST.")
      return "Not Logged in", 401
    
    if bcrypt.checkpw(data["password"].encode('utf8'), dbUser.password.encode('utf8')):

      ret_user = {
        "email": dbUser.email,
        "firstname": dbUser.first_name,
        "lastname": dbUser.last_name,
      }
      response = make_response(jsonify(ret_user), 200)
      response.set_cookie(key="pbr_token", value=Auth_Token.create_token(dbUser), expires=datetime.now(tz=timezone.utc) + timedelta(minutes=int(os.environ.get("JWT_TTL"))), secure=True, httponly = True, samesite="Strict")
      print("SUCCESS")
      return response
    else:
      print("FAIL")
      return "Not Logged in", 401

  return "Not Logged in!", 401
  

@userBlueprint.route('/logout', methods=['POST'])
# @token_required
def logout():
  print("Logging out.")
  from models.user import User
  if 'pbr_token' in request.cookies:
    token = request.cookies['pbr_token']
    Auth_Token.invalidate_token(token)
  response = make_response("Logged out.", 200)
  response.set_cookie(key="pbr_token", value="", expires=datetime.now(tz=timezone.utc), secure=True, httponly = True, samesite="Strict")
  return response

@userBlueprint.route('/register', methods=['POST'])
def register():
  from models.user import User
  from server import db
  content_type = request.headers.get('Content-Type')

  if (content_type == 'application/json'):
      data = request.json

  if not data["email"] or not data["firstname"] or not data["lastname"] or not data["password"] or not data["orgCode"]:
    print("MISSING FIELDS.")
    db.session.rollback()
    return "Invalid Request!", 400
  
  if User.query.filter_by(email=data["email"]).first():
    print("USER ALREADY EXISTS.")
    db.session.rollback()
    return "User Already Exists", 422

  salt = bcrypt.gensalt()
  hashedPW = bcrypt.hashpw(data["password"].encode('utf8'), salt)

  user = User(email=data["email"], first_name=data["firstname"], last_name=data["lastname"], password=hashedPW.decode(), role=None )
  db.session.add(user)
  db.session.commit()
  print("User was successfully added.")
  return 'Success', 200