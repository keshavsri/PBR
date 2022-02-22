from flask import request, Blueprint, jsonify, Response, make_response
import bcrypt
from datetime import datetime, timedelta, timezone
import os
import uuid
import json
from auth_token import Auth_Token
from functools import wraps

userBlueprint = Blueprint('user', __name__)

users = []
userCount = 0

# decorator for verifying the JWT
# Template from GeeksForGeeks: https://www.geeksforgeeks.org/using-jwt-for-user-authentication-in-flask/
def token_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    token = None
    # jwt is passed in the request header
    if 'Authorization' in request.headers:
      token = request.headers['Authorization'].replace("Bearer ", "")
    # return 401 if token is not passed
    if not token:
      return jsonify({'message' : 'Token is missing!'}), 401
    try:
      # PULL OUT DATA FROM TOKEN
      data = Auth_Token.decode_token(token)
      # GET AND RETURN CURRENT USER
      for user in users:
        if user["email"] == data["email"]:
          current_user = user
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
  if 'pbr_token' in request.cookies:
    token = request.cookies['pbr_token']
    try:
      data = Auth_Token.decode_token(token)
      print(data)
      ret_user = None
      print(f"Users: {users}")
      for user in users:
        print(user["email"])
        print(data["email"])
        if user["email"] == data["email"]:
          print("HIT")
          ret_user = {
            "email": user["email"],
            "firstname": user["firstname"],
            "lastname": user["lastname"],
          }
      if ret_user is None:
        return jsonify({"message":"Unauthorized"}), 401
      else:
        print("User:", ret_user)
        return jsonify(ret_user), 200
    except Exception as error:
      print(f'Token invalid. {error}')
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
    for user in users:
      if user["email"] == data["email"]:
        if bcrypt.checkpw(data["password"].encode('utf8'), user["hashedPW"].encode('utf8')):
          print("MATCH")
          print(user)
          print(data)
          ret_user = {
            "email": user["email"],
            "firstname": user["firstname"],
            "lastname": user["lastname"],
          }
          response = make_response(jsonify(ret_user), 200)
          response.set_cookie(key="pbr_token", value=Auth_Token.create_token(user), expires=datetime.now(tz=timezone.utc) + timedelta(minutes=int(os.environ.get("JWT_TTL"))), secure=True, httponly = True, samesite="Strict")
          return response
        else:
          print("FAIL")
          return "Not Logged in", 401

  return "Not Logged in", 401
  

@userBlueprint.route('/logout', methods=['POST'])
# @token_required
def logout():
  print("Logging out.")
  from models.user import User
  if 'Authorization' in request.headers:
    token = request.headers['Authorization'].replace("Bearer ", "")
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
  print(users)

  if not data["email"] or not data["firstname"] or not data["lastname"] or not data["password"] or not data["orgCode"]:
    print("MISSING FIELDS.")
    return "Invalid Request!", 400
  
  for user in users:
    print("USER EMAIL: ", user["email"])
    print("data EMAIL: ", data["email"])
    if user["email"] == data["email"]:
      print("USER ALREADY EXISTS.")
      return "User Already Exists", 422

  salt = bcrypt.gensalt()
  hashedPW = bcrypt.hashpw(data["password"].encode('utf8'), salt)
  # data["id"] = uuid.uuid4()
  print("------")
  print(data)
  print(data["email"])

  userObj = {
    "email": data["email"],
    "firstname": data["firstname"],
    "lastname": data["lastname"],
    "hashedPW": hashedPW.decode(),
    "id": 1,
    "role": "none",
    "orgCode": data["orgCode"]
  }

  users.append(userObj)

  return 'Success', 200