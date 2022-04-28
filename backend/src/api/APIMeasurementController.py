import src.helpers
from src.api.APIUserController import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src import Models, Schemas
from src.enums import LogActions

measurementBlueprint = Blueprint('measurement', __name__)


@measurementBlueprint.route('/type/', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_measurement_types(access_allowed, current_user):

    """
    This function returns all Measurement Types in the database.

    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request

    :return: a json response containing all Measurement Types in the database
    """

    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        response_json = src.helpers.get_measurement_types()
        # if the response json is empty then return a 404 not found
        if response_json is None:
            response_json = jsonify({'message': 'No records found'})
            return response_json, 404
        else:
            return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@measurementBlueprint.route('/type/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_measurement_type(access_allowed, current_user, item_id):

    """
    This function returns a Measurement Type in the database.

    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request

    :return: a json response containing a Measurement Type in the database
    """

    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        response_json = src.helpers.get_measurement_type_by_id(item_id)
        # if the response json is empty then return a 404 not found
        if response_json is None:
            response_json = jsonify({'message': 'No records found'})
            return response_json, 404
        else:
            return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@measurementBlueprint.route('/type/', methods=['POST'])
@token_required
@allowed_roles([0, 1])
def create_measurement_type(access_allowed, current_user):

    """
    This function creates a Measurement Type in the database.

    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request
    :param request.json: the json object used to create the Measurement Type

    :return: a json response containing the created Measurement Type
    """

    if access_allowed:
        # checks if the Measurement Type already exists in the database
        if Models.MeasurementType.query.filter_by(name=request.json.get('name')).first() is None:
            # builds the Measurement Type from the request json
            new_measurement_type = src.helpers.create_measurement_type(request.json)
            # stages and then commits the new Measurement Type to the database
            Models.db.session.add(new_measurement_type)
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.ADD_MEASUREMENTTYPE, 'Created new Measurement Type: ' + new_measurement_type.name)
            return Schemas.MeasurementType.from_orm(new_measurement_type).dict(), 201
        # if the Measurement Type already exists then return a 409 conflict
        else:
            return jsonify({'message': 'Measurement Type already exists', "existing Measurement Type": Schemas.MeasurementType.from_orm(Models.MeasurementType.query.filter_by(name=request.json.get('name')).first()).dict()}), 409
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@measurementBlueprint.route('/type/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1])
def update_measurement_type(access_allowed, current_user, item_id):

    """
    This function updates a Measurement Type in the database.

    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request
    :param item_id: the id of the Measurement Type to be updated
    :param request.json: the json object used to update the Measurement Type

    :return: a json response containing the updated Measurement Type
    """

    if access_allowed:
        # check if the Measurement Type exists in the database if it does then update the Measurement Type
        if Models.MeasurementType.query.filter_by(id=item_id).first() is None:
            return jsonify({'message': 'Measurement Type does not exist'}), 404
        else:
            for name, value in request.json.items():
                if name == 'required':
                    if value == 'True':
                        request.json[name] = 1
                    else:
                        request.json[name] = 0
                elif name == 'general':
                    if value == 'True':
                        request.json[name] = 1
                    else:
                        request.json[name] = 0
            Models.MeasurementType.query.filter_by(id=item_id).update(request.json)
            Models.db.session.commit()
            edited_measurement_type = Models.MeasurementType.query.get(item_id)
            Models.createLog(current_user, LogActions.EDIT_MEASUREMENTTYPE, 'Edited Measurement Type: ' + edited_measurement_type.name)
            return Schemas.MeasurementType.from_orm(edited_measurement_type).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@measurementBlueprint.route('/type/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1])
def delete_measurement_type(access_allowed, current_user, item_id):

    """
    This function deletes a Measurement Type from the database.

    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request
    :param item_id: the id of the Measurement Type to be deleted

    :return: a json response containing the deleted Measurement Type
    """

    if access_allowed:
        # check if the Measurement Type exists in the database if it does then delete the Measurement Type
        if Models.MeasurementType.query.filter_by(id=item_id).first() is None:
            return jsonify({'message': 'Measurement Type does not exist'}), 404
        else:
            deleted = Models.MeasurementType.query.filter_by(id=item_id).first()
            Models.db.session.delete(deleted)
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.DELETE_MEASUREMENTTYPE, 'Deleted Measurement Type: ' + deleted.name)
            return jsonify({'message': 'Measurement Type deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@measurementBlueprint.route('/', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_measurements(access_allowed, current_user):

    """
    This function gets all Measurements from the database.

    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request

    :return: a json response containing all Measurements
    """

    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        response_json = src.helpers.get_measurements()
        # if the response json is empty then return a 404 not found
        if response_json is None:
            response_json = jsonify({'message': 'No records found'})
            return response_json, 404
        else:
            return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@measurementBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_measurement(access_allowed, current_user, item_id):

    """
    This function gets a Measurement from the database.

    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request
    :param item_id: the id of the Measurement to be retrieved

    :return: a json response containing the retrieved Measurement
    """

    if access_allowed:
        # check if the Measurement exists in the database if it does then return the Measurement
        if Models.Measurement.query.filter_by(id=item_id).first() is None:
            return jsonify({'message': 'Measurement does not exist'}), 404
        else:
            return jsonify(src.helpers.get_measurement_by_id(item_id)), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@measurementBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0, 1])
def create_measurement(access_allowed, current_user):

    """
    This function creates a Measurement in the database.

    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request

    :return: a json response containing the created Measurement
    """

    if access_allowed:
        # checks if the Measurement already exists in the database
        if Models.Measurement.query.filter_by(machine_id=request.json.get('machine_id'), measurementtype_id=request.json.get('measurementtype_id')).first() is None:
            # builds the Measurement from the request json
            new_measurement = src.helpers.create_measurement(request.json)
            # stages and then commits the new Measurement to the database
            Models.db.session.add(new_measurement)
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.ADD_MEASUREMENT, 'Created new Measurement')
            return Schemas.Measurement.from_orm(new_measurement).dict(), 201
        # if the Measurement already exists then return a 409 conflict
        else:
            return jsonify({'message': 'Measurement already exists', "existing Measurement": Schemas.Measurement.from_orm(Models.Measurement.query.filter_by(machine_id=request.json.get('machine_id'), measurementtype_id=request.json.get('measurementtype_id')).first()).dict()}), 409
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@measurementBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1])
def update_measurement(access_allowed, current_user, item_id):

    """
    This function updates a Measurement in the database.

    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request
    :param item_id: the id of the Measurement to be updated

    :return: a json response containing the updated Measurement
    """

    if access_allowed:
        # check if the Measurement exists in the database if it does then update the Measurement Type
        if Models.Measurement.query.filter_by(id=item_id).first() is None:
            return jsonify({'message': 'Measurement does not exist'}), 404
        else:
            Models.Measurement.query.filter_by(id=item_id).update(request.json)
            Models.db.session.commit()
            edited_measurement = Models.Measurement.query.get(item_id)
            Models.createLog(current_user, LogActions.EDIT_MEASUREMENT, 'Edited Measurement: ' + str(edited_measurement.id))
            return Schemas.Measurement.from_orm(edited_measurement).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@measurementBlueprint.route('/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1])
def delete_measurement(access_allowed, current_user, item_id):

    """
    This function deletes a Measurement from the database.

    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request
    :param item_id: the id of the Measurement to be deleted

    :return: a json response containing the deleted Measurement
    """

    if access_allowed:
        # check if the Measurement Type exists in the database if it does then delete the Measurement Type
        if Models.Measurement.query.filter_by(id=item_id).first() is None:
            return jsonify({'message': 'Measurement does not exist'}), 404
        else:
            deleted = Models.Measurement.query.filter_by(id=item_id).first()
            Models.db.session.delete(deleted)
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.DELETE_MEASUREMENT, 'Deleted Measurement: ' + str(deleted.id))
            return jsonify({'message': 'Measurement deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
