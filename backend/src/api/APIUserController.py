from flask import request, Blueprint, jsonify, Response, make_response
import bcrypt
from datetime import datetime, timedelta, timezone
import os
import uuid
import jwt
import json
from src.auth_token import Auth_Token
from functools import wraps
from src import Models
from src.enums import Roles, LogActions

userBlueprint = Blueprint('user', __name__)

def allowed_roles(roles):
  def wrapper(f):
    @wraps(f)
    def decorated(*args, **kwargs):

      token = None
      allowed = False
      # jwt is passed in the request header
      if 'pbr_token' in request.cookies:
        token = request.cookies["pbr_token"]
      # return 401 if token is not passed
      if not token:
        return jsonify({'message': 'Token is missing!'}), 401
      try:
        # PULL OUT DATA FROM TOKEN
        data = Auth_Token.decode_token(token)
        # GET AND RETURN CURRENT USER

        current_user = Models.User.query.filter_by(id=data["id"]).first()
        
        for role in roles:
          if current_user.role == 0 or int(current_user.role) is role:
            allowed = True
      except jwt.ExpiredSignatureError as error:
        return jsonify({
            'message': 'Token is expired!'
        }), 401
      # returns the current logged in users contex to the routes
      return f(allowed, *args, **kwargs)
    return decorated
  return wrapper

# decorator for verifying the JWT
# Template from GeeksForGeeks: https://www.geeksforgeeks.org/using-jwt-for-user-authentication-in-flask/
def token_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
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
      current_user = Models.User.query.filter_by(id=data["id"]).first()
    except jwt.ExpiredSignatureError as error:
      data = Auth_Token.decode_token(token, verify_expiration=False)
      current_user = Models.User.query.filter_by(email=data["email"]).first()
      ret_user = {
        "email": current_user.email,
        "firstname": current_user.first_name,
        "lastname": current_user.last_name,
        "role": current_user.role,
      }
      return jsonify(ret_user), 419
    except Exception as error:
      return jsonify({
        'message' : 'Token is invalid!'
      }), 401
    # returns the current logged in users contex to the routes
    return  f(current_user, *args, **kwargs)
  return decorated

@userBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@userBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_all(item_id=None):
  return Models.User.fs_get_delete_put_post(item_id)

@userBlueprint.route('/me', methods=['GET'])
@token_required
def me(current_user):
  if current_user:
    ret_user = {
      "email": current_user.email,
      "firstname": current_user.first_name,
      "lastname": current_user.last_name,
      "role": current_user.role,
    }
    return jsonify(ret_user), 200
  else:
    return jsonify({"message":"Unauthorized"}), 401
    

@userBlueprint.route('/login', methods=['POST'])
def login():
  """
  Logs the current user in, getting email and password from payload
  If user doesn't exist, if fields are missing/invalid, incorrect password, return 401 
  """

  content_type = request.headers.get('Content-Type')
  if (content_type == 'application/json'):
      data = request.json

  print(data)

  if data["email"] and data["password"]:
    data["email"] = data["email"].lower()
    print(data["email"])
    dbUser = Models.User.query.filter_by(email=data["email"]).first()
    print(dbUser)
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
      response.set_cookie(key="pbr_token", value=Auth_Token.create_token(dbUser), expires=datetime.now(tz=timezone.utc) + timedelta(days=1), secure=True, httponly = True, samesite="Strict")
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
  if 'pbr_token' in request.cookies:
    token = request.cookies['pbr_token']
    Auth_Token.invalidate_token(token)
  response = make_response("Logged out.", 200)
  response.set_cookie(key="pbr_token", value="", expires=datetime.now(tz=timezone.utc), secure=True, httponly = True, samesite="Strict")
  return response

@userBlueprint.route('/register', methods=['POST'])
def register():
  content_type = request.headers.get('Content-Type')

  if (content_type == 'application/json'):
      data = request.json

  if not data["email"] or not data["firstname"] or not data["lastname"] or not data["password"] or not data["orgCode"]:
    print("MISSING FIELDS.")
    Models.db.session.rollback()
    return "Invalid Request!", 400
  
  if Models.User.query.filter_by(email=data["email"]).first():
    print("USER ALREADY EXISTS.")
    Models.db.session.rollback()
    return "User Already Exists", 422

  salt = bcrypt.gensalt()
  hashedPW = bcrypt.hashpw(data["password"].encode('utf8'), salt)
  user = Models.User(email=data["email"], first_name=data["firstname"], last_name=data["lastname"], password=hashedPW.decode(), role=Roles.Admin )
  Models.db.session.add(user)
  Models.db.session.commit()
  print("User was successfully added.")
  return 'Success', 200
