from flask import request, Blueprint, jsonify, Response, make_response
import bcrypt
import uuid
import json
import auth_token
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
    if 'x-access-token' in request.headers:
      token = request.headers['x-access-token']
    # return 401 if token is not passed
    if not token:
      return jsonify({'message' : 'Token is missing!'}), 401
    try:
      # PULL OUT DATA FROM TOKEN
      data = auth_token.decode_token(token)
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

@userBlueprint.route('/login', methods=['POST'])
def login():
  from models.user import User
  loggedIn = False

  content_type = request.headers.get('Content-Type')
  if (content_type == 'application/json'):
      data = request.json

  # Temp Bypass
  if data['bypass'] is True:
    demoUserObj = {
      "email": "test@email.com",
      "firstname": "Test",
      "lastname": "User",
    }
    return jsonify(demoUserObj), 200

  for user in users:
    if user["email"] == data["email"]:
      if bcrypt.checkpw(data["password"].encode('utf8'), user["hashedPW"].encode('utf8')):
        print("MATCH")
        print(user)
        print(data)
        retUser = {
          "email": user["email"],
          "firstname": user["firstname"],
          "lastname": user["lastname"],
        }
        token = auth_token.create_token(user)
        retObj = {
          "user": retUser,
          "token": token
        }
        response = make_response(jsonify(retObj), 200)
        response.headers["Content-Type"] = "application/json"
        response.set_cookie(key='pbr_token', value=token, max_age=auth_token.decode_token(token)["exp"], secure=True, httponly=True, samesite="Strict")

        return response
      else:
        print("FAIL")
        return "Not Logged in", 401

  return "Not Logged in", 401
  

@userBlueprint.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
  from models.user import User
  console.log(current_user)
  console.log(current_user["email"])
  console.log()
  content_type = request.headers.get('Content-Type')
  auth_token.destroy_token(token)
  # TODO: Add logout logic
  return 'Logout', 200

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
  # newUser = User(email=data["email"], first_name = data["firstname"], last_name = data["lastname"], password = hashedPW)
  
  # db.session.add(newUser)
  # db.session.commit()
  print("------")
  return 'Success', 200