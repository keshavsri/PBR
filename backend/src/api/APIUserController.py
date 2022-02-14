from flask import request, Blueprint, jsonify, Response, make_response
import bcrypt
import uuid
import json

userBlueprint = Blueprint('user', __name__)

users = []

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
    print(user)
    if user["email"] == data["email"]:
      if bcrypt.checkpw(data["password"].encode('utf8'), user["hashedPW"].encode('utf8')):
        print("MATCH")
        retUserObj = {
          "email": data["email"],
          "firstname": data["firstname"],
          "lastname": data["lastname"],
          "token": 'fake-jwt-token'
        }
        return jsonify(retUserObj), 200
      else:
        print("FAIL")
        return "Not Logged in", 401

  return "Not Logged in", 401
  

@userBlueprint.route('/logout', methods=['POST'])
def logout():
  from models.user import User
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
    "orgCode": data["orgCode"]
  }

  users.append(userObj)
  # newUser = User(email=data["email"], first_name = data["firstname"], last_name = data["lastname"], password = hashedPW)
  
  # db.session.add(newUser)
  # db.session.commit()
  print("------")
  return 'Success', 200