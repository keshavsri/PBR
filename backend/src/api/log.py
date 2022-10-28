from flask import Blueprint, jsonify, request
from src.api.user import token_required, allowed_roles
from src.models import Log as LogORM, User as UserORM
from src.enums import Roles, LogActions
from src.schemas import Log

logBlueprint = Blueprint('log', __name__)

@logBlueprint.route('/organization/<int:org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1])
def get_logs_for_organization(access_allowed, current_user, org_id):
    """
    This function handles the GET request for all Logs belonging to a specific organization.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param org_id: The organization id of the organization that the user wants to get the logs of.
    :return: A list of all Logs belonging to a specific organization depending on the request.
    """

    if access_allowed:
        if current_user.role == Roles.Super_Admin or current_user.organization_id == org_id:
            log_models = LogORM.query.filter_by(organization_id=org_id)
            logs = [Log.from_orm(log).dict() for log in log_models]
            return jsonify(logs), 200
        else:
            return jsonify({'message': 'Insufficient Permissions'}), 401
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@logBlueprint.route('/user/<int:user_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1])
def get_logs_for_user(access_allowed, current_user, user_id):
    """
    This function handles the GET request for all Logs belonging to a specific user.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param org_id: The user id of the user that the user wants to get the logs of.
    :return: A list of all Logs belonging to a specific user depending on the request.
    """

    if access_allowed:
        user = UserORM.query.get(user_id)
        if current_user.role == Roles.Super_Admin or current_user.organization_id == user.organization_id:
            log_models = LogORM.query.filter_by(user_id=user_id)
            logs = [Log.from_orm(log).dict() for log in log_models]
            return jsonify(logs), 200
        else:
            return jsonify({'message': 'Insufficient Permissions'}), 401
    else:
        return jsonify({'message': 'Role not allowed'}), 403

