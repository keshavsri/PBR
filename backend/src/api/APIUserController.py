import code
from src.Models import Organization
from flask import request, Blueprint, jsonify, Response, make_response
import bcrypt
from datetime import datetime, timedelta, timezone
import os
import uuid
import jwt
import json
from src.auth_token import Auth_Token
from functools import wraps
from src import Models, helpers, Schemas
import src.helpers
from src.enums import Roles, LogActions
from src.Models import User as UserORM
from src.Schemas import User

userBlueprint = Blueprint('user', __name__)

def allowed_roles(roles):
  """ Accepts a list of roles and returns true to the decorated function if the user has one of those roles, false otherwise
  
      :param roles:List[int]: the list of roles that are allowed to access the route
      :return: bool: true if the user has one of the roles, false otherwise      
  """
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
  """ Decorator for authenticating the user via the JWT in the request header and returning the current user to the decorated function

      :return: User: the current user as a SQLAlchemy model
  """
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
        "organization_id": current_user.organization_id
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
      "organization_id": current_user.organization_id,
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
      return jsonify({"message": "Not Logged in"}), 401
    
    if bcrypt.checkpw(data["password"].encode('utf8'), dbUser.password.encode('utf8')):

      ret_user = {
        "email": dbUser.email,
        "firstname": dbUser.first_name,
        "lastname": dbUser.last_name,
        "role": dbUser.role,
        "organization_id": dbUser.organization_id,
      }
      response = make_response(jsonify(ret_user), 200)
      response.set_cookie(key="pbr_token", value=Auth_Token.create_token(dbUser), expires=datetime.now(tz=timezone.utc) + timedelta(days=1), secure=True, httponly = True, samesite="Strict")
      print("SUCCESS")
      return response
    else:
      print("FAIL")
      return jsonify({"message": "Not Logged in"}), 401

  return jsonify({"message": "Not Logged in!"}), 401
  

@userBlueprint.route('/logout', methods=['POST'])
# @token_required
def logout():
  print("Logging out.")
  if 'pbr_token' in request.cookies:
    token = request.cookies['pbr_token']
    Auth_Token.invalidate_token(token)
  response = jsonify({"message": "Logged out."}), 200
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
    return jsonify({"message": "Invalid Request!"}), 400
  
  if Models.User.query.filter_by(email=data["email"]).first():
    print("USER ALREADY EXISTS.")
    Models.db.session.rollback()
    return jsonify({"message":"User Already Exists with this Email"}), 422

  
  user_org = Models.Organization.query.filter_by(organization_code=data["orgCode"]).first()

  if not user_org:
    print("INVALID ORGANIZATION ID.")
    Models.db.session.rollback()
    return jsonify({"message": "Invalid Organization ID"}), 422
    
  salt = bcrypt.gensalt()
  hashedPW = bcrypt.hashpw(data["password"].encode('utf8'), salt)
  user = Models.User(email=data["email"], first_name=data["firstname"], last_name=data["lastname"], password=hashedPW.decode(), role=Roles.Guest, organization_id=user_org.id )
  Models.db.session.add(user)
  Models.db.session.commit()
  print("User was successfully added.")
  return jsonify({"message": 'Success'}), 200


@userBlueprint.route('/users/<int:org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_users(access_allowed, current_user, org_id):

    """
    This function will return the users that are associated with the organization that the user is in.

    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.
    :param item_id: This is the id of the user that is passed in.

    :return: This function will return the users with the org id either attached to the user or one that is passed in.
    """

    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        # if item id exists then it will return the users in the organization
        if org_id and current_user.role == Roles.Super_Admin:
          responseJSON = src.helpers.get_users(org_id, current_user)
        elif current_user.organization_id == org_id:
          responseJSON = src.helpers.get_users(current_user.organization_id, current_user)
        # otherwise it will return a 404
        if responseJSON is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403


@userBlueprint.route('/<int:user_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1])
def deleteUser(access_allowed, current_user, user_id):

    """
    Deletes a user from the organization

    :param access_allowed: boolean, whether the user has access to the route
    :param current_user: the user object of the user making the request
    :param user_id: the id of the user to delete

    :return: a json response with the user deleted
    """

    if access_allowed:
        user = Models.User.query.get(user_id)
        if user is None:
            return jsonify({'message': 'User does not exist'}), 404
        elif user.organization_id != current_user.organization_id and user.role != Roles.Super_Admin:
            return jsonify({'message': 'Cannot delete in another organization'}), 403
        elif user.id == current_user.id:
            return jsonify({'message': 'Cannot delete the current user'}), 403
        else:
            Models.db.session.delete(user)
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.DELETE_SOURCE, f'Deleted user: ${user.first_name} ${user.last_name} in organization: ${Models.Organization.query.get(user.organization_id).name}')
            return jsonify({'message': 'User deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@userBlueprint.route('/admin/<int:org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_admin_organization(access_allowed, current_user, org_id):
    """
    This function will return the admin user that is associated with the organization id that is passed in.

    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.
    :param item_id: This is the id of the organization that is passed in.

    :return: This function will return the admin with the org id either attached to the user or one that is passed in.
    """
    print(org_id, flush=True)
    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        # if organization id exists then it will return the admin in the organization
        if org_id and current_user.role == Roles.Super_Admin:
            admin = UserORM.query.filter_by(organization_id=org_id, role=Roles.Admin).first()
        elif current_user.organization_id == org_id:
            admin = UserORM.query.filter_by(organization_id=org_id, role=Roles.Admin).first()
            print(admin, flush=True)
        else:
            return jsonify({'message': 'Cannot get admin for organization user is not a part of'}), 403
        # otherwise it will return a 404
        if admin is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            responseJSON = User.from_orm(admin).dict()
            print(responseJSON, flush=True)
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403


@userBlueprint.route('/users/<int:user_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2, 3])
def update_user(access_allowed, current_user, user_id):

    """
    This function will edit a users information.

    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.
    :param item_id: This is the id of the user to be edited.

    :return: This function will return the edited user object as a dictionary.
    """
    if access_allowed:

        updated_user = request.json
        print("hi..................................", flush=True)
        print(updated_user, flush=True)
        user = Models.User.query.filter_by(id=updated_user.get("id")).first()

        if user is None:
            return jsonify({'message': 'User does not exist'}), 404
        else:

            if current_user.role == Roles.Supervisor:
                if user.role == Roles.Admin: ## Cannot change an admins info
                    updated_user = user ## Override new user info with prexisting info
                    updated_user = updated_user.dict()

            if current_user.role == Roles.Data_Collector:
                if user.id != current_user.id: ## Cannot change anyone else's info
                    updated_user = user ## Override new user info with prexisting info
                    updated_user = updated_user.dict()

            if user.id == current_user.id: ## Cannot change your own role
                updated_user["role"] = user.role ## Override new role with prexisting role

            updated_user['id'] = user.id
            updated_user['password'] = user.password
            updated_user.pop("deletable")

            Models.User.query.filter_by(id=updated_user.get("id")).update(updated_user)
            Models.db.session.commit()
            edited_user = Models.User.query.get(updated_user.get("id"))
            Models.createLog(current_user, LogActions.EDIT_USER, 'Edited user: ' + str(updated_user.get("id")))

            return Schemas.User.from_orm(Models.User.query.filter_by(id=updated_user.get("id")).first()).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
