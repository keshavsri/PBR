from flask import request, Blueprint, jsonify
from http import HTTPStatus
import re
import src.helpers
from src.enums import LogActions, ValidationTypes, Roles
from src.api.APIUserController import token_required, allowed_roles
from src import Models, helpers

sampleBlueprint = Blueprint('sample', __name__)
batchBluePrint = Blueprint('batch', __name__)

# Sample API #

# A set of all allowed file extensions for parsing files
ALLOWED_EXTENSIONS = {'txt'}


# Inspiration from https://roytuts.com/python-flask-rest-api-file-upload/
@sampleBlueprint.route('/parse', methods=['POST'])
def parse_machine_data():
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
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def parse_data_from_file(file):
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
                    {"key": row_contents[0].strip(), "value": row_contents[1].strip()},
                    {"key": row_contents[2].strip(), "value": row_contents[3].strip()},
                    {"key": row_contents[4].strip(), "value": row_contents[5].strip()}
                ]
                print("NEW:", new_meas)
                ret_dict["measurements"].extend(new_meas)

    print(ret_dict)
    return ret_dict


def _is_error_file(content_lines):
    is_error_file = False

    temp = re.search(r"^[0-9]{2} ([0-9A-F]{1,4}[ ]*){1,4}", content_lines[8])
    if temp:
        is_error_file = True
    return is_error_file


# Creates a new sample #
@sampleBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0, 1, 2, 3])
def create_sample(access_allowed, current_user):
    if access_allowed:
        payload = request.json
        print(payload)
        # Validate Payload

        # Check if flock exists.
        current_flock = src.helpers.get_flock_by_name(payload['flockDetails']['name'])
        # If flock doesn't exist, make it.
        if current_flock:
            print("Flock already exists")
            # If so, see if things were edited.
            print(current_flock)
            print(payload['flockDetails'])
        else:
            print("Brand new flock. Add it.")
            # If flock doesn't exist, make it.
            
            new_flock = src.helpers.create_flock(payload['flockDetails'])
            
            print(new_flock)
            # stages and then commits the new Flock to the database
            Models.createLog(current_user, LogActions.ADD_FLOCK, 'Created new Flock: ' + new_flock.name)

        payload["validation_status"] = ValidationTypes.Pending
        new_sample = src.helpers.create_sample(payload, current_user)
        if not new_sample:
            return jsonify({'message': 'Invalid Request'}), 400

        Models.createLog(current_user, LogActions.ADD_SAMPLE, 'Created new sample: ' + str(new_sample.id))
        return jsonify(Models.Sample.query.get(request.json.get('id'))), 201
    else:
        return jsonify({'message': 'Role not allowed'}), 403


# Retrieves all available samples for a given user, or organization if provided#
@sampleBlueprint.route('/', methods=['GET'])
@sampleBlueprint.route('/organization/<int:given_org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_samples(access_allowed, current_user, given_org_id=None):
    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        response_json = None
        current_organization = current_user.organization_id

        print(f"currID: {current_organization}, givenID: {given_org_id}")
        
        if given_org_id:
            if current_organization == given_org_id:
                if current_user.role == Roles.Super_Admin:
                    response_json = helpers.get_samples_by_org(given_org_id)
                else:
                    # Otherwise, they can only see samples that are assigned to them.
                    response_json = helpers.get_samples_by_user(current_user.id)
            elif current_user.role == 0:
                if given_org_id is None:
                    response_json = helpers.get_samples_by_org(current_organization)
                else:
                    response_json = helpers.get_all_samples()
            else:
                return jsonify({'message': 'You can only access samples within your organization'}), 403
        else:
            if current_user.role == Roles.Super_Admin:
                    response_json = helpers.get_samples_by_org(current_organization)
            else:
                # Otherwise, they can only see samples that are assigned to them.
                response_json = helpers.get_samples_by_user(current_user.id)

        # if the response json is empty then return a 404 not found
        if response_json is None:
            response_json = jsonify({'message': 'No records found'})
            return response_json, 404
        else:
            return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


# Returns list of filtered samples based on a set of strings #
@sampleBlueprint.route('/datapoint/filter', methods=['POST'])
@token_required
@allowed_roles([0,1,2,3])
def filter_samples(access_allowed, current_user):
    if access_allowed:
        responseJSON = jsonify(Models.Sample.query.filter_by(
            id=request.json.get('id'), 
            flock_id=request.json.get('flockID'),
            species=request.json.get('species'),
            strain=request.json.get('strain'),
            gender=request.json.get('gender'),
            age_range=request.json.get('ageRange'),
            validation_status=request.json.get('validationStatus'),
            sample_type=request.json.get('sampleType'),
            batch=request.json.get('batch'),
            data_collector=request.json.get('dataCollector'),
            organization=request.json.get('organization') ))
        if responseJSON.json is None:
            responseJSON = jsonify({'message': 'Samples cannot be returned.'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

# Deletes specified sample #
@sampleBlueprint.route('/datapoint/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1, 2, 3])
def delete_sample(access_allowed, current_user, item_id):
    if access_allowed:
        if Models.Sample.query.get(item_id) is None:
            return jsonify({'message': 'Sample cannot be found.'}), 404
        else:
            deleted_sample = Models.Sample.query.get(item_id)
            Models.db.session.delete(Models.Sample.query.get(item_id))
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.DELETE_SAMPLE, 'Deleted sample: ' + deleted_sample.id)
            return jsonify(deleted_sample), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


# Edits existing sample #
@sampleBlueprint.route('/datapoint/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2, 3])
def edit_datapoint(access_allowed, current_user, item_id):
    if access_allowed:
        if Models.Sample.query.get(item_id) is None:
            return jsonify({'message': 'Sample cannot be found.'}), 404
        else:
            Models.Sample.query.filter_by(id=item_id).update(request.json)
            Models.db.session.commit()
            edited_sample = Models.Sample.query.get(item_id)
            Models.createLog(current_user, LogActions.EDIT_SAMPLE, 'Edited sample: ' + str(edited_sample.id))
            return jsonify(edited_sample), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


# Batch Data API #
# Create batch data #
@batchBluePrint.route('/datapoint/batch', methods=['POST'])
@token_required
@allowed_roles([0, 1, 2, 3])
# batch_data is a BatchData.JSON
def create_batch_data(access_allowed, current_user, batch_data):
    if access_allowed:
        Models.db.session.add(batch_data)
        Models.db.session.commit()
        Models.createLog(current_user, LogActions.ADD_BATCH, 'Created batch data: ' + batch_data.id)
        return jsonify(Models.Batch.query.get(request.json.get('id'))),
    else:
        return jsonify({'message': 'Role not allowed'}), 403


# Retrieves all batches #
@batchBluePrint.route('/datapoint/batch', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_batches(access_allowed, current_user):
    if access_allowed:
        response_json = jsonify(Models.Batch.query.all())
        if response_json.json is None:
            response_json = jsonify({'message': 'Batches cannot be returned.'})
            return response_json, 404
        else:
            return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


# Retrieves specified batch #
@batchBluePrint.route('/datapoint/batch/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_batch(access_allowed, current_user, item_id):
    if access_allowed:
        response_json = jsonify(Models.Batch.query.get(item_id))
        if response_json.json is None:
            response_json = jsonify({'message': 'Batch cannot be found.'})
            return response_json, 404
        else:
            return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


# Edits specified batch #
@batchBluePrint.route('/datapoint/batch/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2, 3])
def edit_batch(access_allowed, current_user, item_id):
    if access_allowed:
        if Models.Batch.query.get(item_id) is None:
            return jsonify({'message': 'Batch cannot be found.'}), 404
        else:
            Models.Batch.query.filter_by(id=item_id).update(request.json)
            Models.db.session.commit()
            edited_batch = Models.Batch.query.get(item_id)
            Models.createLog(current_user, LogActions.EDIT_BATCH, 'Edited batch: ' + edited_batch.id)
            return jsonify(edited_batch), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


# Edits specified batch #
@batchBluePrint.route('/datapoint/batch/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1, 2, 3])
def delete_batch(access_allowed, current_user, item_id):
    if access_allowed:
        if Models.Batch.query.get(item_id) is None:
            return jsonify({'message': 'Batch cannot be found.'}), 404
        else:
            deleted_batch = Models.Batch.query.get(item_id)
            Models.db.session.delete(Models.Batch.query.get(item_id))
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.DELETE_SAMPLE, 'Deleted batch: ' + deleted_batch.id)
            return jsonify({'message': 'Batch has been deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
