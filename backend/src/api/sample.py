from flask import request, Blueprint, jsonify
from http import HTTPStatus
import re
from src.enums import LogActions, ValidationTypes, Roles
from src.api.user import token_required, allowed_roles
from src import models, schemas
from src.helpers import sample as sample_helper
from src.models import Sample as SampleORM
from src.models import Measurement as MeasurementORM
from sqlalchemy import text

sampleBlueprint = Blueprint('sample', __name__)

# Sample API #

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
    if file and check_allowed_filetype(file.filename):
        data = parse_data_from_file(file)
        resp = jsonify({'message': 'File successfully read', 'data': data})
        resp.status_code = HTTPStatus.OK
        return resp
    else:
        resp = jsonify({'message': 'Invalid file type'})
        resp.status_code = HTTPStatus.UNSUPPORTED_MEDIA_TYPE
        return resp


# Method to check the filetype of a given filename
def check_allowed_filetype(filename):
    """
    Checks if the filetype is allowed
    :param filename: The filename to check
    :return: True if the filetype is allowed, False otherwise
    """
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def parse_data_from_file(file):
    """
    Parses the data from a given machine output file and returns the data in a JSON format
    :param file: The file to parse from the POST request
    :return: JSON data of the parsed machine output file
    """
    if not check_allowed_filetype(file.filename):
        raise Exception("Invalid file type")

    # Read the file line-by-line, storing each line in the array below/
    content_lines = []
    for line in file:
        line_content = line.decode('utf-8').strip()
        content_lines.append(line_content)
    if "vetscan vs2" in content_lines[0].lower():
        print("This is VetScan VS2!")
        machine_data = _parse_vetscan_vs2(content_lines)
        return machine_data
    else:
        raise Exception("Invalid Machine")
    # remove end line characters


def _parse_vetscan_vs2(content_lines):
    """
    Parses the data from a given VetScan VS2 output file and returns the data in a JSON format
    :param content_lines: The lines of the file to parse
    :return: JSON data of the parsed machine output file
    """
    ret_dict = {
        "name": content_lines[0],
        "info": [
            {"key": "Timestamp of Test", "value": re.sub(" +", " ", content_lines[2])},
        ],
        "measurements": []
    }
    is_error_file = False

    if is_error_file:
        print("Error file")

    info_flag = True
    measurement_flag = False
    print("MEASUREMENTS-----------------------")
    for row_idx in range(3, len(content_lines)):
        row = content_lines[row_idx]
        print("CHECKING:" + row)
        # While pulling basic measurements,
        if info_flag:
            if re.search(r"^[.]+", row):
                info_flag = False
                measurement_flag = True
            else:
                key = row.split(":")[0].strip()
                value = row.split(":")[1].strip()
                print("NEW:", {"key": key, "value": value})
                ret_dict["info"].append({"key": key, "value": value})

        # While pulling basic measurements,
        elif measurement_flag:
            # Are we at the end of the basic measurements?
            if row.strip() == "":
                print("EXTRA-----------------------")
                measurement_flag = False
            else:
                if re.search(r"^[0-9]{2} ([0-9ABCDEF]{4}  ){1,4} *", row):
                    is_error_file = True
                else:
                    row_contents = re.sub(" +", " ", row).split()
                    print(row_contents)
                    # For non-error files with issue measurements
                    if len(row_contents) != 3 and not is_error_file:
                        data = ""
                        for j in range(1, len(row_contents) - 1):
                            data = data + row_contents[j] + " "
                            new_meas = {"key": row_contents[0].strip(), "value": data.strip(), "units": row_contents[len(row_contents)-1].strip()}
                    else:
                        # For all other measurements
                        new_meas = {"key": row_contents[0].strip(), "value": row_contents[1].strip(), "units": row_contents[len(row_contents)-1].strip()}
                    print("NEW:", new_meas)
                    ret_dict["measurements"].append(new_meas)
        else:
            # You are finished with basic measurements. Switch to extra info.
            if re.search(r"^QC +[A-Za-z0-9]+ *", row):
                row_contents = re.sub(" +", " ", row).strip().split()
                print("QC: ", row_contents)
                new_meas = {"key": row_contents[0].strip(), "value": row_contents[1].strip()}
                print("NEW:", new_meas)
                ret_dict["measurements"].append(new_meas)
            # If row is RQC Row
            if re.search(r"^RQC: [0-9]+ *", row):
                row_contents = re.sub(" +", " ", row).strip().split(":")
                print("RQC: ", row_contents)
                new_meas = {"key": row_contents[0].strip(), "value": row_contents[1].strip()}
                print("NEW:", new_meas)
                ret_dict["measurements"].append(new_meas)
            if re.search(r"^HEM *[0-9+-]+ +LIP *[0-9+-]+ +ICT *[0-9+-]+ *", row):
                row_contents = re.sub(" +", " ", row).strip().split()
                print("Extra: ", row_contents)
                new_meas = [
                    {"key": row_contents[0].strip(
                    ), "value": row_contents[1].strip()},
                    {"key": row_contents[2].strip(
                    ), "value": row_contents[3].strip()},
                    {"key": row_contents[4].strip(
                    ), "value": row_contents[5].strip()}
                ]
                print("NEW:", new_meas)
                ret_dict["measurements"].extend(new_meas)

    print(ret_dict)
    return ret_dict


def _is_error_file(content_lines):
    """
    Checks if the file is an error file.
    :param content_lines:
    :return: True if error file, False otherwise
    """
    is_error_file = False

    temp = re.search(r"^[0-9]{2} ([0-9A-F]{1,4}[ ]*){1,4}", content_lines[8])
    if temp:
        is_error_file = True
    return is_error_file


# Creates a new sample #
@sampleBlueprint.route('/', methods=['POST'])
def create_sample(current_user):
    """
    Creates a new sample, from a given sample json and returns the newly created sample.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param request.json: The sample json to create the sample from.
    :return: The newly created sample.
    """
    payload = request.json

    new_sample = sample_helper.create_sample(payload, current_user)
    if not new_sample:
        return jsonify({'message': 'Invalid Request'}), 400


    return schemas.Sample.from_orm(new_sample).dict(), 201

# Creates a new sample #
@sampleBlueprint.route('/sample/<int:given_org_id>/<int:cartridge_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])


def get_samples_by_cartridge_id_and_org(access_allowed, cartridge_type_id, given_org_id):

    """
    This function gets all samples for a specified cartridge type.
    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request
    :param cartridge_id: the id of the cartridge to retrieve samples of
    :return: a json response containing all samples for the cartridge type
    """

    if access_allowed:

        samples = []

        with models.engine.connect() as connection:
            result = connection.execute(text(
            """
            SELECT sample_table.id FROM sample_table sample, flock_table f, source_table source, organization_table o
            WHERE sample.flock_id = f.id 
            AND f.source_id = source.id 
            AND source.organization_id = :given_org_id 
            AND sample.cartridge_type_id = :cartridge_type_id;
            """))
            for row in result:
                sample = SampleORM.query.get(row.id)
                samples.append(sample)

        # Loop through results, use SampleORM to get sample by id of sample in results to get dictionary version of sample
                
        results = []
        for sample in samples:
            measurements = MeasurementORM.query.filter_by(sample_id=sample.id).all()
            sample.update({'measurements': measurements})
            results.append(SampleORM.from_orm(sample).dict())


        if not results:
            return results, 404
        else:
            return results, 200

    else:
        return jsonify({'message': 'Role not allowed'}), 403

@sampleBlueprint.route('/sample/<int:item_id>', methods=['PUT'])
def edit_sample(item_id):
    """
    Edits existing sample.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the sample to edit.
    :param request.json: The updated sample as a json object.
    :return: The edited sample.
    """
    if SampleORM.query.get(item_id) is None:
        return jsonify({'message': 'Sample cannot be found.'}), 404
    else:
        sample_model:SampleORM = SampleORM()
        for name, value in request.json:
            #if name != 'measurements':
            setattr(sample_model, name, value)

        models.db.session.add(sample_model)
        models.db.session.commit()
        models.db.session.refresh(sample_model)

        """
        # Update the list of measurements. Iterate through measurements of sample, find corresponding measurement (by id) in frontend objects, and update the objects
        measurements = []
        for measurement in request.json["measurements"]:
            measurements.append(measurement)

        setattr(sample, "measurements", measurements)
        """
        edited_sample = SampleORM.query.get(item_id)
        models.createLog(current_user, LogActions.EDIT_SAMPLE, 'Edited sample: ' + str(edited_sample.id))
        return schemas.Sample.from_orm(edited_sample).dict(), 200


@sampleBlueprint.route('/sample/<int:item_id>', methods=['DELETE'])
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


# Submit Pending Samples #
@sampleBlueprint.route('/sample/submit/<int:item_id>', methods=['PUT'])
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

# Accept Sample
@sampleBlueprint.route('/sample/accept/<int:item_id>', methods=['PUT'])
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

# Reject Sample
@sampleBlueprint.route('/sample/reject/<int:item_id>', methods=['PUT'])
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


"""

# Retrieves all available samples for a given user, or organization if provided
@sampleBlueprint.route('/', methods=['GET'])
@sampleBlueprint.route('/organization/<int:given_org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_samples(access_allowed, current_user, given_org_id=None):
    
    Retrieves all available samples for a given organization if provided.
    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param given_org_id: The organization id to get samples for, if provided, else all samples for the current user.
    :return: The list of samples.
    
    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        response_json = None
        current_user_organization = current_user.organization_id

        if given_org_id:
            if current_user_organization == given_org_id:
                if current_user.role >= Roles.Supervisor:
                    # If Supervisor or Greater, return all samples of that org
                    response_json = sample.get_samples_by_org(given_org_id)
                else:
                    # Otherwise, they can only see samples that are assigned to them.
                    response_json = sample.get_samples_by_user(given_org_id)
            elif current_user.role == Roles.Super_Admin:
                # However, a Super Admin can return all samples from any org that they want
                response_json = sample.get_samples_by_org(given_org_id)
            else:
                return jsonify({'message': 'You can only access samples within your organization'}), 403
        else:
            if current_user.role == Roles.Super_Admin:
                # Super Admins can see all samples from all orgs
                response_json = sample.get_all_samples(current_user.id)
            elif current_user.role == Roles.Supervisor or current_user.role == Roles.Admin:
                # If Supervisor or Greater, return all samples of that org
                response_json = sample.get_samples_by_org(
                    current_user_organization, current_user.id)
            else:
                # Otherwise, they can only see samples that are assigned to them.
                response_json = sample.get_samples_by_user(current_user.id)

        # if the response json is empty then return a 404 not found
        if response_json is None:
            response_json = jsonify({'message': 'No records found'})
            return response_json, 404
        else:
            return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

"""