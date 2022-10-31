from flask import request, Blueprint, jsonify
from http import HTTPStatus
from src.enums import LogActions, ValidationTypes, Roles
from src.api.user import token_required, allowed_roles
from src import models, schemas
from src.helpers import sample as sample_helper
from src.models import Sample as SampleORM
from src.models import Measurement as MeasurementORM
from sqlalchemy import text

sampleBlueprint = Blueprint('sample', __name__)

# A set of all allowed file extensions for parsing files
ALLOWED_EXTENSIONS = {'txt'}


# Inspiration from https://roytuts.com/python-flask-rest-api-file-upload/
@sampleBlueprint.route('/parse', methods=['POST'])
def parse_machine_data():
    """
    Parses the data from a given machine output file and returns the data in a JSON format
    :param file: The file to parse from the POST request
    :return: JSON data of the parsed machine output file
    """
    # check if the post request has the file part
    if 'file' not in request.files:
        resp = jsonify({'message': 'No file part in the request'})
        resp.status_code = HTTPStatus.UNSUPPORTED_MEDIA_TYPE
        return resp
    file = request.files['file']

    # Check the filename
    if file.filename == '':
        resp = jsonify({'message': 'No file selected for uploading'})
        resp.status_code = HTTPStatus.UNSUPPORTED_MEDIA_TYPE
        return resp

    # Check if the filetype is allowed
    if file and sample_helper.check_allowed_filetype(file.filename):
        data = sample_helper.parse_data_from_file(file)
        resp = jsonify({'message': 'File successfully read', 'data': data})
        resp.status_code = HTTPStatus.OK
        return resp
    else:
        resp = jsonify({'message': 'Invalid file type'})
        resp.status_code = HTTPStatus.UNSUPPORTED_MEDIA_TYPE
        return resp


@sampleBlueprint.route('/', methods=['POST'])
def create_sample():
    """
    Creates a new sample, from a given sample json and returns the newly created sample.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param request.json: The sample json to create the sample from.
    :return: The newly created sample.
    """
    payload = request.json

    new_sample = sample_helper.create_sample(payload)

    return schemas.Sample.from_orm(new_sample).dict(), 201


@sampleBlueprint.route('/org_cartrige_type', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_samples_by_cartridge_type_id_and_org(access_allowed):

    """
    This function gets all samples for a specified cartridge type.
    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request
    :param cartridge_type_id: the id of the cartridge type to retrieve samples of
    :return: a json response containing all samples for the cartridge type
    """

    if access_allowed:
        samples = []

        with models.engine.connect() as connection:
            result = connection.execute(text(
            """
            SELECT sample.id FROM sample_table sample, flock_table f, source_table source, organization_table o
            WHERE sample.flock_id = f.id 
            AND f.source_id = source.id 
            AND source.organization_id = :org_id 
            AND sample.cartridge_type_id = :cartridge_type_id;
            """), {"org_id": request.json["org_id"], "cartridge_type_id": request.json["cartridge_type_id"]})

            samples = [SampleORM.query.get(row.id) for row in result]
                
        results = []
        for sample in samples:
            measurements = MeasurementORM.query.filter_by(sample_id=sample.id).all()
            setattr(sample, "measurements", measurements)
            results.append(schemas.Sample.from_orm(sample).dict())


        if not results:
            return jsonify(results), 404
        else:
            return jsonify(results), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@sampleBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2, 3])
def edit_sample(access_allowed, current_user, item_id):
    if access_allowed:
        old_sample = SampleORM.query.get(item_id)
        if  SampleORM.query.get(item_id) is None:
            return jsonify({'message': 'Sample cannot be found.'}), 404
        else:
            
            for name, value in request.json.items():
                if name != 'measurements':
                    setattr(old_sample, name, value)
            
            measurement_dict = request.json.pop('measurements')

            # Update the list of measurements.

            measurements = []
            for measurement in measurement_dict:
                measurement_model:MeasurementORM = MeasurementORM()
                for name, value in measurement.items():
                    setattr(measurement_model, name, value)
                measurements.append(measurement_model)

            setattr(old_sample, "measurements", measurements)

            models.db.session.commit()

            edited_sample = SampleORM.query.get(item_id)
            models.createLog(current_user, LogActions.EDIT_SAMPLE, 'Edited sample: ' + str(edited_sample.id))
            return schemas.Sample.from_orm(edited_sample).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@sampleBlueprint.route('/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1, 2, 3])
def delete_sample(access_allowed, current_user, item_id):
    """
    Deletes specified sample.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the sample to delete.
    :return: The deleted sample.
    """
    if access_allowed:
        if models.Sample.query.get(item_id) is None:
            return jsonify({'message': 'Sample cannot be found.'}), 404
        else:
            deleted_sample = models.Sample.query.get(item_id)
            models.Sample.query.filter_by(id=item_id).update({'is_deleted': True})
            models.db.session.commit()
            models.create_log(current_user, LogActions.DELETE_SAMPLE,
                             'Deleted sample: ' + str(deleted_sample.id))
            return schemas.Sample.from_orm(deleted_sample).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@sampleBlueprint.route('/submit/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2, 3])
def submit_sample(access_allowed, current_user, item_id):
    """
    Edits existing sample.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the sample to edit.
    :return: The edited sample.
    """
    if access_allowed:
        if models.Sample.query.get(item_id) is None:
            return jsonify({'message': 'Sample cannot be found.'}), 404
        else:
            models.Sample.query.filter_by(id=item_id).update(
                {'validation_status': ValidationTypes.Pending})
            models.db.session.commit()
            edited_sample = models.Sample.query.get(item_id)
            models.create_log(current_user, LogActions.EDIT_SAMPLE,
                             'Edited sample: ' + str(edited_sample.id))
            return schemas.Sample.from_orm(edited_sample).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@sampleBlueprint.route('/accept/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2])
def accept_sample(access_allowed, current_user, item_id):
    """
    Accepts existing sample.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the sample to edit.
    :return: The accepted sample.
    """
    if access_allowed:
        if models.Sample.query.get(item_id) is None:
            return jsonify({'message': 'Sample cannot be found.'}), 404
        else:
            models.Sample.query.filter_by(id=item_id).update(
                {'validation_status': ValidationTypes.Accepted})
            models.db.session.commit()
            edited_sample = models.Sample.query.get(item_id)
            models.create_log(current_user, LogActions.PENDING_TO_VALID,
                             'Accepted sample: ' + str(edited_sample.id))
            return schemas.Sample.from_orm(edited_sample).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@sampleBlueprint.route('/reject/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2])
def reject_sample(access_allowed, current_user, item_id):
    """
    Rejects existing sample.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the sample to edit.
    :return: The rejected sample.
    """
    if access_allowed:
        if models.Sample.query.get(item_id) is None:
            return jsonify({'message': 'Sample cannot be found.'}), 404
        else:
            models.Sample.query.filter_by(id=item_id).update(
                {'validation_status': ValidationTypes.Rejected})
            models.db.session.commit()
            edited_sample = models.Sample.query.get(item_id)
            models.create_log(current_user, LogActions.PENDING_TO_REJECT,
                             'Reject sample: ' + str(edited_sample.id))
            return schemas.Sample.from_orm(edited_sample).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
