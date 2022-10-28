import src.helpers
from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src import models, schemas
from src.enums import Roles, LogActions


machineTypeBlueprint = Blueprint('machine-type', __name__)


@machineTypeBlueprint.route('/', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_machine_types(access_allowed, current_user):

    """
    This function handles GET requests for getting all machine types.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.

    :return: A list of all machine types.
    """

    if access_allowed:
        machine_types = models.MachineType.query.all()
        response = [schemas.MachineType.from_orm(mt).dict() for mt in machine_types]
        return jsonify(response), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@machineTypeBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_machine_type(access_allowed, current_user, item_id):

    """
    This function handles GET requests for getting a machine type.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the machine type to get.

    :return: The machine type that was requested.
    """

    if access_allowed:
        machine_type = models.MachineType.query.get(item_id)
        if machine_type is None:
            return jsonify({'message': 'Machine type not found'}), 404
        else:
            response = schemas.MachineType.from_orm(machine_type).dict()
            return jsonify(response), 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403
