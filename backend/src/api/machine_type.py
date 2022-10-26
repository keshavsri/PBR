import src.helpers
from src.api.APIUserController import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src import models, schemas
from src.enums import Roles, LogActions


machineTypeBlueprint = Blueprint('machine-type', __name__)

@machineTypeBlueprint.route('/peepee', methods=['GET'])
def test_poopoo():
    machine_types = models.MachineType.query.all()
    responseJSON = jsonify([models.MachineType.from_orm(mt).dict() for mt in machine_types])
    return responseJSON, 200


@machineTypeBlueprint.route('/', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_machine_types(access_allowed, current_user):

    """
    This function handles GET requests for getting all machine types.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.

    :return: A list of all machine types.
    """

    if access_allowed:
        machine_types = models.MachineType.query.all()
        responseJSON = jsonify([models.MachineType.from_orm(mt).dict() for mt in machine_types])
        return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@machineTypeBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_machine_type(access_allowed, current_user, item_id):

    """
    This function handles GET requests for getting a machine type.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the machine type to get.

    :return: The machine type that was requested.
    """

    if access_allowed:
        machine_type = models.MachineType.query.filter_by(id=id).first()
        if machine_type is None:
            return jsonify({'message': 'Machine type not found'}), 404
        else:
            responseJSON = models.MachineType.from_orm(machine_type).dict()
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403
