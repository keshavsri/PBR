from flask import request, Blueprint, jsonify
import json
from http import HTTPStatus
from src.enums import LogActions, ValidationTypes, Roles
from src.api.user import token_required, allowed_roles
from src import models, schemas
from src.helpers import sample as sample_helper
from src.models import Sample as SampleORM
from src.models import Measurement as MeasurementORM
from src.models import Flock as FlockORM
from src.schemas import Sample, Flock
from sqlalchemy import text
from src.helpers.log import create_log


sampleBlueprint = Blueprint('sample', __name__)


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
@token_required
@allowed_roles([0, 1, 2, 3])
def create_sample(access_allowed, current_user):
    """
    Creates a new sample, from a given sample json and returns the newly created sample.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param request.json: The sample json to create the sample from.
    :return: The newly created sample.


    """

    if access_allowed:

        sample: SampleORM = SampleORM()
        for name, value in request.json.items():
            if name != 'measurements' and name != "is_deleted":
                setattr(sample, name, value)

        setattr(sample, "user_id", current_user.id)
        setattr(sample, "validation_status", ValidationTypes.Saved)

        models.db.session.add(sample)
        models.db.session.commit()
        models.db.session.refresh(sample)

        # Update the list of measurements.

        measurements = []
        for measurement in request.json["measurements"]:
            measurement_model: MeasurementORM = MeasurementORM()
            for name, value in measurement.items():
                setattr(measurement_model, name, value)
                setattr(measurement_model, "sample_id", sample.id)
            measurements.append(measurement_model)

        setattr(sample, "measurements", measurements)

        models.db.session.commit()
        models.db.session.refresh(sample)

        create_log(current_user, LogActions.ADD_SAMPLE,
                   'Added sample: ' + str(sample.id))

        return Sample.from_orm(sample).dict(), 201
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@sampleBlueprint.route('/org_cartridge_type', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_samples(access_allowed, current_user):
    """
    This function gets all samples for a specified cartridge type and organization.
    Allowed Roles check not needed for this since all users should be able to get samples
    :param current_user: the user object of the user making the request
    :return: a json response containing all samples for the org and cartridge type
    """

    if access_allowed:

        # If user isn't superadmin, they should only be allowed to access samples in their org
        if current_user.role != Roles.Super_Admin and str(current_user.organization_id) != request.args.get('organization_id'):
            return jsonify({'message': 'Role not allowed'}), 403

        else:
            samples = []
            with models.engine.connect() as connection:

                sql_select_query = "sample_table sample, flock_table f, source_table source"
                sql_where_query = """
                WHERE sample.flock_id = f.id
                AND f.source_id = source.id
                AND sample.is_deleted = 0
                AND source.organization_id = :organization_id
                AND sample.cartridge_type_id = :cartridge_type_id
                AND CASE
                        WHEN sample.validation_status = "Saved"
                            THEN sample.user_id = :current_user_id
                        ELSE TRUE
                    END
                """

                # If user is a data collector, they should only see their samples
                if current_user.role == Roles.Data_Collector:
                    sql_where_query += "AND sample.user_id = :current_user_id"

                sql_query = "SELECT sample.* FROM " + sql_select_query + sql_where_query
                result = connection.execute(text(sql_query + ";"), {"organization_id": request.args.get(
                    'organization_id'), "cartridge_type_id": request.args.get('cartridge_type_id'), "current_user_id": current_user.id})

                for row in result:
                    sample = SampleORM(
                            id=row[0],
                            timestamp_added=row[1],
                            comments=row[2],
                            flock_age=row[3],
                            flock_age_unit=row[4],
                            is_deleted=row[5],
                            validation_status=row[6],
                            sample_type=row[7],
                            rotor_lot_number=row[8],
                            user_id=row[9],
                            batch_id=row[10],
                            flock_id=row[11],
                            cartridge_type_id=row[12],
                            machine_id=row[13],
                            flock=Flock.from_orm(FlockORM.query.get(row[11]))
                        )
                    samples.append(sample)

            results = []
            for sample in samples:
                measurements = MeasurementORM.query.filter_by(
                    sample_id=sample.id).all()
                setattr(sample, "measurements", measurements)
                results.append(Sample.from_orm(sample).dict())

            return jsonify(results), 200

    else:
        return jsonify({'message': 'Role not allowed'}), 403


# delete sample permanently
@sampleBlueprint.route('/permanent/<int:sample_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1, 2, 3])
def delete_sample_permanently(access_allowed, current_user, sample_id):
    """
    This function deletes a sample permanently.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param sample_id: The id of the sample to delete
    :return: A json response containing a message


    """

    if access_allowed:

        sample = SampleORM.query.get(sample_id)

        if sample is None:
            return jsonify({'message': 'Sample not found'}), 404

        # Delete the sample
        MeasurementORM.query.filter_by(sample_id=sample_id).delete()
        SampleORM.query.filter_by(id=sample_id).delete()
        models.db.session.commit()

        create_log(current_user, LogActions.DELETE_SAMPLE,
                   'Deleted sample: ' + str(sample.id))

        return jsonify({'message': 'Sample deleted'}), 200

    else:
        return jsonify({'message': 'Role not allowed'}), 403


@sampleBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2, 3])
def edit_sample(access_allowed, current_user, item_id):

    if access_allowed:

        old_sample = SampleORM.query.get(item_id)
        if old_sample is None:
            return jsonify({'message': 'Sample cannot be found.'}), 404
        else:
            for name, value in request.json.items():
                if name != 'measurements':
                    setattr(old_sample, name, value)

            if (request.json.__contains__("measurements")):
                new_measurements = request.json.pop('measurements')
                # Update the list of measurements.

                measurements = []
                for measurement in new_measurements:
                    measurement_model: MeasurementORM = MeasurementORM()
                    for name, value in measurement.items():
                        setattr(measurement_model, name, value)
                    measurements.append(measurement_model)
                setattr(old_sample, "measurements", measurements)

            models.db.session.commit()

            edited_sample = SampleORM.query.get(item_id)
            create_log(current_user, LogActions.EDIT_SAMPLE,
                       'Edited sample: ' + str(edited_sample.id))
            return Sample.from_orm(edited_sample).dict(), 200
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
            return jsonify({'message': 'Sample cannot be found.'}), 407
        else:
            deleted_sample = models.Sample.query.get(item_id)
            models.Sample.query.filter_by(
                id=item_id).update({'is_deleted': True})
            models.db.session.commit()
            create_log(current_user, LogActions.DELETE_SAMPLE,
                       'Deleted sample: ' + str(deleted_sample.id))
            return Sample.from_orm(deleted_sample).dict(), 200
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
            create_log(current_user, LogActions.EDIT_SAMPLE,
                       'Submitted sample: ' + str(edited_sample.id))
            return Sample.from_orm(edited_sample).dict(), 200
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
            create_log(current_user, LogActions.PENDING_TO_VALID,
                       'Accepted sample: ' + str(edited_sample.id))
            return Sample.from_orm(edited_sample).dict(), 200
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
            create_log(current_user, LogActions.PENDING_TO_REJECT,
                       'Rejected sample: ' + str(edited_sample.id))
            return Sample.from_orm(edited_sample).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
