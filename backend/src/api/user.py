from flask import request, Blueprint, jsonify, make_response
import bcrypt
from datetime import datetime, timedelta, timezone
import jwt
from src.auth_token import Auth_Token
from functools import wraps
from src import models, schemas
from src.enums import Roles, LogActions
from src.helpers import log


userBlueprint = Blueprint('user', __name__)


def allowed_roles(roles):
    """
    Accepts a list of roles and returns true to the decorated function if the user has one of those roles, false otherwise
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
                current_user = models.User.query.filter_by(
                    id=data["id"]).first()
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
    """
    Decorator for authenticating the user via the JWT in the request header and returning the current user to the decorated function
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
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            # PULL OUT DATA FROM TOKEN
            data = Auth_Token.decode_token(token)
            # GET AND RETURN CURRENT USER
            current_user = models.User.query.filter_by(id=data["id"]).first()
        except jwt.ExpiredSignatureError as error:
            data = Auth_Token.decode_token(token, verify_expiration=False)
            current_user = models.User.query.filter_by(
                email=data["email"]).first()
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
                'message': 'Token is invalid!'
            }), 401
        # returns the current logged in users contex to the routes
        return f(current_user, *args, **kwargs)
    return decorated


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
            "id": current_user.id
        }
        return jsonify(ret_user), 200
    else:
        return jsonify({"message": "Unauthorized"}), 401


@userBlueprint.route('/login', methods=['POST'])
def login():
    """
    Logs the current user in, getting email and password from payload
    If user doesn't exist, if fields are missing/invalid, incorrect password, return 401 
    """

    content_type = request.headers.get('Content-Type')
    data = {}
    if (content_type == 'application/json'):
        data = request.json
    if data["email"] and data["password"]:
        data["email"] = data["email"].lower()
        print(data["email"])
        dbUser = models.User.query.filter_by(email=data["email"]).first()
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
                "id": dbUser.id
            }
            response = make_response(jsonify(ret_user), 200)
            response.set_cookie(key="pbr_token", value=Auth_Token.create_token(dbUser), expires=datetime.now(
                tz=timezone.utc) + timedelta(days=1), secure=True, httponly=True, samesite="Strict")
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
    response = make_response(jsonify({"message": "Logged out."}), 200)
    response.set_cookie(key="pbr_token", value="", expires=datetime.now(
        tz=timezone.utc), secure=True, httponly=True, samesite="Strict")
    return response


@userBlueprint.route('/register', methods=['POST'])
def register():
    content_type = request.headers.get('Content-Type')

    if (content_type == 'application/json'):
        data = request.json

    if not data["email"] or not data["firstname"] or not data["lastname"] or not data["password"] or not data["orgCode"]:
        print("MISSING FIELDS.")
        models.db.session.rollback()
        return jsonify({"message": "Invalid Request!"}), 400

    if models.User.query.filter_by(email=data["email"]).first():
        print("USER ALREADY EXISTS.")
        models.db.session.rollback()
        return jsonify({"message": "User Already Exists with this Email"}), 422

    user_org = models.Organization.query.filter_by(
        organization_code=data["orgCode"]).first()

    if not user_org:
        print("INVALID ORGANIZATION ID.")
        models.db.session.rollback()
        return jsonify({"message": "Invalid Organization ID"}), 422

    salt = bcrypt.gensalt()
    hashedPW = bcrypt.hashpw(data["password"].encode('utf8'), salt)
    user = models.User(email=data["email"], first_name=data["firstname"], last_name=data["lastname"],
                       password=hashedPW.decode(), role=Roles.Guest, organization_id=user_org.id)
    models.db.session.add(user)
    models.db.session.commit()
    print("User was successfully added.")
    response = schemas.User.from_orm(user).dict()
    return jsonify(response), 200


@userBlueprint.route('/organization/<int:org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_users(access_allowed, current_user, org_id):
    """
    This function will return the users that are associated with the organization that the user is in.
    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.
    :param item_id: This is the id of the user that is passed in.
    :return: This function will return the users with the org id either attached to the user or one that is passed in.
    """

    if access_allowed:
        if current_user.organization_id == org_id or current_user.role == Roles.Super_Admin:
            users = models.User.query.filter_by(
                organization_id=org_id, is_deleted=False)
            ret = {
                "rows": [],
                "types": []
            }
            for user in users:
                ret["rows"].append(schemas.User.from_orm(user).dict())
            responseJSON = jsonify(ret)
            return responseJSON, 200
        else:
            return jsonify({'message': 'Invalid user permissions'}), 403
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403


@userBlueprint.route('/<int:user_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_user(access_allowed, current_user, user_id):
    """
    This function will return the user with a matching id.
    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.
    :param user_id: This is the id of the user that is passed in.
    :return: This function will return the user with the specified id.
    """

    if access_allowed:
        if user_id is None:
            return jsonify({'message': 'User ID must be specified'}), 400
        else:
            user = models.User.query.filter_by(
                id=user_id, is_deleted=False).first()
            if user is None:
                return jsonify({'message': 'User not found'}), 404
            else:
                response = schemas.User.from_orm(user).dict()
                return jsonify(response), 200
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

    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        # if organization id exists then it will return the admin in the organization
        if org_id and current_user.role == Roles.Super_Admin or current_user.organization_id == org_id:
            admin = models.User.query.filter_by(
                organization_id=org_id, role=Roles.Admin, is_deleted=False).first()
        else:
            return jsonify({'message': 'Cannot get admin for another organization'}), 403
        # otherwise it will return a 404
        if admin is None:
            responseJSON = jsonify({'message': 'No admin found'})
            return responseJSON, 404
        else:
            responseJSON = jsonify(schemas.User.from_orm(admin).dict())
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403


@userBlueprint.route('/<int:user_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def update_user(access_allowed, current_user, user_id):
    """
    This function will edit a users information.
    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.
    :param item_id: This is the id of the user to be edited.
    :return: This function will return the edited user object as a dictionary.
    """

    if access_allowed:
        # Get json dict representing new user object
        edited_user = request.json
        # Get existing user object with the same id as edited_user
        existing_user = models.User.query.get(user_id)

        if existing_user is None:
            return jsonify({'message': 'User does not exist'}), 404
        elif existing_user.is_deleted is True:
            return jsonify({'message': 'Cannot edit a deleted user'}), 400
        else:
            # If editing self, prevent editing of role
            # If editing others, prevent editing of higher privileged users
            # Special case is data collectors, who cannot edit less privileged users
            if current_user.id == existing_user.id:
                edited_user["role"] = existing_user.role
            else:
              if current_user.role >= existing_user.role or current_user.role == Roles.Data_Collector:
                return jsonify({'message': 'Role not allowed'}), 403

            # These fields cannot be edited
            # Should maybe allow password change on self edit
            edited_user.update(
                {
                    'id': existing_user.id,
                    'password': existing_user.password,
                    'organization_id': existing_user.organization_id,
                    'is_deleted': existing_user.is_deleted
                }
            )

            # SQLAlchemy update and log action
            models.User.query.filter_by(
                id=edited_user.get("id")).update(edited_user)
            models.db.session.commit()
            log.create_log(current_user, LogActions.EDIT_USER,'Edited user: ' + str(edited_user.get("id")))

            # Return updated user object, retreived via db query (confirmation)
            updated_user = schemas.User.from_orm(
                models.User.query.filter_by(id=edited_user.get("id")).first()
            ).dict()
            return jsonify(updated_user), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@userBlueprint.route('/<int:user_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1])
def delete_user(access_allowed, current_user, user_id):
    """
    Deletes a user from the organization
    :param access_allowed: boolean, whether the user has access to the route
    :param current_user: the user object of the user making the request
    :param user_id: the id of the user to delete
    :return: a json response with the user deleted
    """

    if access_allowed:
        user = models.User.query.get(user_id)
        if user is None:
            return jsonify({'message': 'User does not exist'}), 404
        elif user.is_deleted:
            return jsonify({'message': 'User is already deleted'}), 400
        elif user.organization_id != current_user.organization_id and user.role != Roles.Super_Admin:
            return jsonify({'message': 'Cannot delete user in another organization'}), 403
        elif user.id == current_user.id:
            return jsonify({'message': 'Cannot delete the current user'}), 403
        else:
            user.is_deleted = True
            models.db.session.commit()
            log.create_log(current_user, LogActions.DELETE_SOURCE,
                           f'Deleted user: ${user.first_name} ${user.last_name} in organization: ${models.Organization.query.get(user.organization_id).name}')
            return jsonify({'message': 'User deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
