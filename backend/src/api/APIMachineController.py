import src.helpers
from src.api.APIUserController import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src import Models, Schemas
from src.enums import Roles, LogActions

machineBlueprint = Blueprint('machine', __name__)

@machineBlueprint.route('/', methods=['GET'])
@machineBlueprint.route('/organization/<int:given_org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_machines(access_allowed, current_user, given_org_id=None):

    """
    This function handles GET requests for all machines or all machines in a given organization.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param given_org_id: The organization id of the organization to get all machines from if given.

    :return: A list of all machines in the database if no organization id is given.
    """

    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        current_Organization = current_user.organization_id

        if given_org_id:
            if current_user.role == Roles.Super_Admin:
                responseJSON = src.helpers.get_machines_by_org(current_Organization)
            elif current_user.organization_id == given_org_id:
                responseJSON = src.helpers.get_machines_by_org(current_Organization)
            else:
                responseJSON = jsonify({'message': 'Insufficient Permissions'})
                return responseJSON, 401
        else:
            if current_user.role == Roles.Super_Admin:
                responseJSON = src.helpers.get_machines()
            else:
                responseJSON = src.helpers.get_sample_by_org(current_Organization)

        # if the response json is empty then return a 404 not found
        if responseJSON is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200

    else:
        return jsonify({'message': 'Role not allowed'}), 403

@machineBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_machine(access_allowed, current_user, item_id):

    """
    This function handles GET requests for a single machine.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the machine to get.

    :return: A single machine if it exists in the database.
    """

    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        current_Organization = current_user.organization_id
        machine = Models.Machine.query.get(item_id)
        if machine is None:
            return jsonify({'message': 'No record found'}), 404
        if current_user.role == Roles.Super_Admin or machine.organization == current_Organization:
            responseJSON = src.helpers.get_machine_by_id(item_id)
        else:
            return jsonify({'message': 'You cannot access this flock'}), 403
        return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403

@machineBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0, 1])
def create_machine(access_allowed, current_user):

    """
    This function handles POST requests for creating a machine.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param request.json: The json data from which to create the machine.

    :return: The machine that was created.
    """
    if access_allowed:
        # checks if the Machine already exists in the database
        if Models.Machine.query.filter_by(serial_number=request.json.get('serial_number')).first() is None:
            # builds the Machine from the request json
            new_machine = src.helpers.create_machine(request.json)
            # stages and then commits the new Machine to the database
            Models.db.session.add(new_machine)
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.ADD_MACHINE, 'Created new Machine: ' + new_machine.serial_number)
            return Schemas.Machine.from_orm(new_machine).dict(), 201
        # if the Machine already exists then return a 409 conflict
        else:
            return jsonify({'message': 'Machine already exists', "existing organization": Schemas.Machine.from_orm(Models.Machine.query.filter_by(serial_number=request.json.get('serial_number')).first()).dict()}), 409
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@machineBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1])
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
        #check if the Machine exists in the database if it does then update the Flock
        if Models.Machine.query.filter_by(organization_id=current_user.organization_id, id=item_id).first() is None:
            return jsonify({'message': 'Machine does not exist'}), 404
        else:

            Models.Machine.query.filter_by(id=item_id).update(request.json)
            Models.db.session.commit()
            edited_machine = Models.Machine.query.get(item_id)
            Models.createLog(current_user, LogActions.EDIT_MACHINE, 'Edited Machine: ' + edited_machine.serial_number)
            return Schemas.Machine.from_orm(edited_machine).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@machineBlueprint.route('/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1])
def delete_machine(access_allowed, current_user, item_id):

    """
    This function handles DELETE requests for deleting a machine.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the machine to delete.

    :return: The machine that was deleted.
    """

    if access_allowed:
        #check if the Machine exists in the database if it does then delete the Flock
        if Models.Machine.query.filter_by(organization_id=current_user.organization_id, id=item_id).first() is None:
            return jsonify({'message': 'Machine does not exist'}), 404
        else:
            machine = Models.Machine.query.get(item_id)
            Models.db.session.delete(machine)
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.DELETE_MACHINE, 'Deleted Machine: ' + machine.serial_number)
            return jsonify({'message': 'Machine deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

# MachineType routes

@machineBlueprint.route('/type/', methods=['GET'])
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
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = src.helpers.get_machine_types()
        # if the response json is empty then return a 404 not found
        if responseJSON is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@machineBlueprint.route('/type/<int:item_id>', methods=['GET'])
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
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        machinetype = Models.MachineType.query.get(item_id)
        if machinetype is None:
            return jsonify({'message': 'No record found'}), 404
        responseJSON = src.helpers.get_machine_type_by_id(item_id)
        return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403

@machineBlueprint.route('/type/', methods=['POST'])
@token_required
@allowed_roles([0, 1])
def create_machine_type(access_allowed, current_user):

    """
    This function handles POST requests for creating a machine type.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param request.json: The json that will be used to create the machine type.

    :return: The machine type that was created.
    """

    if access_allowed:
        # checks if the Machine already exists in the database
        if Models.MachineType.query.filter_by(name=request.json.get('name')).first() is None:
            # builds the Machine from the request json
            new_machine_type = src.helpers.create_machine_type(request.json)
            # stages and then commits the new Machine to the database
            Models.db.session.add(new_machine_type)
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.ADD_MACHINETYPE, 'Created new Machine: ' + new_machine_type.name)
            return Schemas.Machinetype.from_orm(new_machine_type).dict(), 201
        # if the Machine already exists then return a 409 conflict
        else:
            return jsonify({'message': 'Machine already exists', "existing organization": Schemas.Machinetype.from_orm(Models.Machinetype.query.filter_by(name=request.json.get('name')).first()).dict()}), 409
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@machineBlueprint.route('/type/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1])
def edit_machine_type(access_allowed, current_user, item_id):

    """
    This function handles PUT requests for editing a machine type.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the machine type to edit.
    :param request.json: The json that will be used to edit the machine type.

    :return: The machine type that was edited.
    """

    if access_allowed:
        #check if the Machine exists in the database if it does then update the Machine
        if Models.MachineType.query.filter_by(id=item_id).first() is None:
            return jsonify({'message': 'Machine does not exist'}), 404
        else:
            Models.MachineType.query.filter_by(id=item_id).update(request.json)
            Models.db.session.commit()
            edited_machine = Models.MachineType.query.get(item_id)
            Models.createLog(current_user, LogActions.EDIT_MACHINETYPE, 'Edited Machine: ' + edited_machine.name)
            return Schemas.Machinetype.from_orm(edited_machine).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@machineBlueprint.route('/type/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1])
def delete_machine_type(access_allowed, current_user, item_id):

    """
    This function handles DELETE requests for deleting a machine type.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the machine type to delete.

    :return: The machine type that was deleted.
    """

    if access_allowed:
        #check if the Machine exists in the database if it does then delete the Machine
        if Models.MachineType.query.filter_by(id=item_id).first() is None:
            return jsonify({'message': 'Machine does not exist'}), 404
        else:
            machine = Models.MachineType.query.get(item_id)
            Models.db.session.delete(machine)
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.DELETE_MACHINETYPE, 'Deleted Machine: ' + machine.name)
            return jsonify({'message': 'Machine deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
