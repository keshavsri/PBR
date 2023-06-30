import src.helpers
from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src import models, schemas
from src.enums import Roles, LogActions
from src.helpers import log

machineBlueprint = Blueprint('machine', __name__)


@machineBlueprint.route('/organization/<int:given_org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_machines(access_allowed, current_user, given_org_id=None):

    """
    This function handles GET requests for all machines or all machines in a given organization.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param given_org_id: The organization id of the organization to get all machines from if given.
    :return: A list of all machines in the database if no organization id is given.
    """

    if access_allowed:
        if given_org_id is None:
            return jsonify({'message': 'Organization ID must be specified'}), 400
        elif current_user.organization_id == given_org_id or current_user.role == Roles.Super_Admin:
            machines = models.Machine.query.filter_by(organization_id=given_org_id, is_deleted=False).all()

            response = []
            for machine in machines:
                schema_machine = schemas.Machine.from_orm(machine).dict()
                schema_machine.update({"machine_type_name": machine.machine_type.name})
                response.append(schema_machine)

            #response = [schemas.Machine.from_orm(m).dict() for m in machines]
            return jsonify(response), 200
        else:
            return jsonify({'message': 'Insufficient permissions'}), 401
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@machineBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_machine(access_allowed, current_user, item_id=None):
    """
    This function handles GET requests for a single machine.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the machine to get.
    :return: A single machine if it exists in the database.
    """

    if access_allowed:
        if item_id is None:
            return jsonify({'message': 'Machine ID must be specified'}), 400
        else:
            machine = models.Machine.query.filter_by(id=item_id, is_deleted=False).first()
            if machine is None:
                return jsonify({'message': 'Machine not found'}), 404
            else:
                response = schemas.Machine.from_orm(machine).dict()
                return jsonify(response), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@machineBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0, 1, 2, 3])
def create_machine(access_allowed, current_user):
    """
    This function handles POST requests for creating a machine.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param request.json: The json data from which to create the machine.
    :return: The machine that was created.
    """

    if access_allowed:
        if models.Machine.query.filter_by(serial_number=request.json.get('serial_number'), organization_id=request.json.get('organization_id'), is_deleted = False).first() is None:
            new_machine: models.Machine = models.Machine()
            for name, value in request.json.items():
                setattr(new_machine, name, value)
            models.db.session.add(new_machine)
            models.db.session.commit()
            models.db.session.refresh(new_machine)
            log.create_log(current_user, LogActions.ADD_MACHINE,
                           'Created new Machine: ' + str(new_machine.serial_number))
            added_machine = models.Machine.query.filter_by(
                serial_number=new_machine.serial_number).first()
            return jsonify(schemas.Machine.from_orm(added_machine).dict()), 201
        else:
            return jsonify(
                {
                    'message': 'Machine with same name already exists within this org',
                    "existing machine serial number": schemas.Machine.from_orm(
                        models.Machine.query.filter_by(
                            serial_number=request.json.get(
                                'serial_number')
                        ).first()
                    ).dict()
                }
            ), 409
    return jsonify({'message': 'Role not allowed'}), 403


@machineBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2])
def edit_machine(access_allowed, current_user, item_id):
    """
    This function handles PUT requests for editing a machine.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the machine to edit.
    :param request.json: The json data from which to edit the machine.
    :return: The machine that was edited.
    """

    if access_allowed:
        existing_machine_by_id = models.Machine.query.filter_by(
            id=item_id).first()
        existing_machine_by_serial_number = models.Machine.query.filter_by(
            serial_number=request.json.get('serial_number')
        ).first()

        if existing_machine_by_id is None:
            return jsonify({'message': 'Machine does not exist'}), 404
        elif (
            existing_machine_by_serial_number is not None and
            existing_machine_by_serial_number.is_deleted == False and
            existing_machine_by_serial_number.organization_id == request.json.get('organization_id') and
            existing_machine_by_serial_number.id is not item_id
        ):
            return jsonify({'message': 'Serial number must be unique within an organization'}), 409
        else:
            models.Machine.query.filter_by(id=item_id).update(request.json)
            models.db.session.commit()
            edited_machine = models.Machine.query.get(item_id)
            log.create_log(current_user, LogActions.EDIT_MACHINE,
                           'Edited Machine: ' + edited_machine.serial_number)
            return jsonify(schemas.Machine.from_orm(edited_machine).dict()), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@machineBlueprint.route('/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1, 2])
def delete_machine(access_allowed, current_user, item_id):
    """
    This function handles DELETE requests for deleting a machine.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the machine to delete.
    :return: The machine that was deleted.
    """

    if access_allowed:
        if models.Machine.query.filter_by(id=item_id).first() is None:
            return jsonify({'message': 'Machine does not exist'}), 404
        else:
            deleted_machine = models.Machine.query.get(item_id)
            models.Machine.query.filter_by(
                id=item_id).update({'is_deleted': True})
            models.db.session.commit()
            log.create_log(current_user, LogActions.DELETE_MACHINE,
                           'Deleted Machine: ' + deleted_machine.serial_number)
            return jsonify({'message': 'Machine deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
