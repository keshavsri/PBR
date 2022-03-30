from flask import request, Blueprint, jsonify
from http import HTTPStatus
import re

from api.APIUserController import token_required, allowed_roles

sampleBlueprint = Blueprint('sample', __name__)
batchBluePrint = Blueprint('batch', __name__)

## Sample API ##

# A set of all allowed file extensions for parsing files
ALLOWED_EXTENSIONS = set(['txt'])

# Inspiration from https://roytuts.com/python-flask-rest-api-file-upload/
@sampleBlueprint.route('/parse', methods=['POST'])
def parse_file():
    # check if the post request has the file part
    if 'file' not in request.files:
        resp = jsonify({'message' : 'No file part in the request'})
        resp.status_code = HTTPStatus.UNSUPPORTED_MEDIA_TYPE
        return resp
    file = request.files['file']

    # Check the filename
    if file.filename == '':
        resp = jsonify({'message' : 'No file selected for uploading'})
        resp.status_code = HTTPStatus.UNSUPPORTED_MEDIA_TYPE
        return resp

    # Check if the filetype is allowed
    if file and check_allowed_filetype(file.filename):
        data = parse(file)
        resp = jsonify({'message' : 'File successfully read', 'data': data})
        resp.status_code = HTTPStatus.OK
        return resp
    else:
        resp = jsonify({'message' : 'Invalid file type'})
        resp.status_code = HTTPStatus.UNSUPPORTED_MEDIA_TYPE
        return resp

# Method to check the filetype of a given filename
def check_allowed_filetype(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def parse(file):
    if not check_allowed_filetype(file.filename):
        raise Exception("Invalid file type")

    # Read the file line-by-line, storing each line in the array below/
    content_lines = []
    for line in file:
        lineContent = line.decode('utf-8').strip()
        content_lines.append(lineContent)
    if "vetscan vs2" in content_lines[0].lower():
        print("This is VetScan VS2!")
        machine_data = _parse_vetscan_vs2(content_lines)
        return machine_data
    else:
        raise Exception("Invalid Machine")
    # remove end line characters
    
def _parse_vetscan_vs2(content_lines):
    retDict = {
        "name": content_lines[0],
        "info":[
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
        if (info_flag):
            if re.search(r"^[.]+", row):
                info_flag = False
                measurement_flag = True
            else:
                key = row.split(":")[0].strip()
                value = row.split(":")[1].strip()
                print("NEW:", {"key": key, "value" : value})
                retDict["info"].append({"key": key, "value" : value})

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
                    rowContents = re.sub(" +", " ", row).split()
                    print(rowContents)
                    # For non-error files with issue measurements
                    if len(rowContents) != 3 and not is_error_file:
                        data = ""
                        for j in range(1, len(rowContents) - 1):
                            data = data + rowContents[j] + " "
                        newMeas = {"key":rowContents[0].strip(), "value": data.strip(), "units": rowContents[len(rowContents)-1].strip() }
                    else: # For all other measurements
                        newMeas = {"key":rowContents[0].strip(), "value": rowContents[1].strip(), "units": rowContents[len(rowContents)-1].strip() }
                    print("NEW:", newMeas)
                    retDict["measurements"].append(newMeas)
        else: # You are finished with basic measurements. Switch to extra info.
            if re.search(r"^QC +[A-Za-z0-9]+ *", row):
                rowContents = re.sub(" +", " ", row).strip().split()
                print("QC: ", rowContents)
                newMeas = {"key":rowContents[0].strip(), "value": rowContents[1].strip() }
                print("NEW:", newMeas)
                retDict["measurements"].append(newMeas)
            # If row is RQC Row
            if re.search(r"^RQC: [0-9]+ *", row):
                rowContents = re.sub(" +", " ", row).strip().split(":")
                print("RQC: ", rowContents)
                newMeas = {"key":rowContents[0].strip(), "value": rowContents[1].strip() }
                print("NEW:", newMeas)
                retDict["measurements"].append(newMeas)
            if re.search(r"^HEM *[0-9+-]+ +LIP *[0-9+-]+ +ICT *[0-9+-]+ *", row):
                rowContents = re.sub(" +", " ", row).strip().split()
                print("Extra: ", rowContents)
                newMeas = [
                    {"key":rowContents[0].strip(), "value": rowContents[1].strip() },
                    {"key":rowContents[2].strip(), "value": rowContents[3].strip() },
                    {"key":rowContents[4].strip(), "value": rowContents[5].strip() }
                ]
                print("NEW:", newMeas)
                retDict["measurements"].extend(newMeas)

    print(retDict)
    return retDict

def _is_error_file(content_lines):
    is_error_file = False

    temp = re.search(r"^[0-9]{2} ([0-9A-F]{1,4}[  ]*){1,4}", content_lines[8])
    if temp:
        is_error_file = True
    return is_error_file

# Inspiration from https://roytuts.com/python-flask-rest-api-file-upload/
@sampleBlueprint.route('/strains/<string:species>', methods=['GET'])
def get_strains(species=None):
    print(species.lower())
    # Move this to a database soon
    strains = {
        "chicken": [
            "Ross 308",
            "Ross 708",
            "Ross 308 AP",
            "Ranger Premium",
            "Ranger Classic",
            "Ranger Gold",
            "Cobb500",
            "Cobb700",
            "Arbor Acres Plus",
            "Hubbard",
            "Brown",
            "LSL",
            "Sandy",
            "Silver",
            "Tradition",
            "White",
        ],
        "turkey": [
            "Nicholas Select",
            "BUT 6",
            "Converter",
            "Grade Maker",
            "Optima",
            "ConverterNOVO",
        ],
    }

    if species and species.lower() in strains.keys():
        resp = jsonify(strains[species.lower()])
        resp.status_code = HTTPStatus.OK
        return resp
    elif species:
        resp = jsonify({
            'message' : 'Unsupported Species!'
        })
        resp.status_code = HTTPStatus.BAD_REQUEST
        return resp
    else:
        resp = jsonify({
            'message' : 'Must include a species!'
        })
        resp.status_code = HTTPStatus.BAD_REQUEST
        return resp
# Creates a new sample #
@sampleBlueprint.route('/datapoint', methods=['POST'])
@token_required
@allowed_roles([0,1,2,3])
def create_sample(access_allowed, current_user):
    if access_allowed:
        from models.sample import Sample
        from models.log import createLog
        from models.enums import LogActions
        newSample = Sample(request.json)
        newSample.entered_by_user_id = current_user.id
        from server import db
        db.session.add(newSample)
        db.session.commit()
        createLog(current_user, LogActions.ADD_SAMPLE, 'Created new sample: ' + str(newSample.id))
        return jsonify(Sample.query.get(request.json.get('id'))), 201
    else:
        return jsonify({'message': 'Role not allowed'}), 403

# Retrives specified sample #
@sampleBlueprint.route('/datapoint/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0,1,2,3])
def get_sample(access_allowed, current_user,item_id):
    if access_allowed:
        from models.sample import Sample
        responseJSON = jsonify(Sample.query.get(item_id))
        if responseJSON.json is None:
            responseJSON = jsonify({'message': 'Sample cannot be found.'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

# Retrieves all samples #
@sampleBlueprint.route('/datapoint', methods=['GET'])
@token_required
@allowed_roles([0,1,2,3])
def get_samples(access_allowed, current_user):
    if access_allowed:
        from models.sample import Sample
        responseJSON = jsonify(Sample.query.all())
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
@allowed_roles([0,1,2,3])
def delete_sample(access_allowed, current_user, item_id):
    if access_allowed:
        from models.sample import Sample
        from models.log import createLog
        from models.enums import LogActions
        if Sample.query.get(item_id) is None:
            return jsonify({'message': 'Sample cannot be found.'}), 404
        else:
            from server import db
            deletedSample = Sample.query.get(item_id)
            db.session.delete(Sample.query.get(item_id))
            db.session.commit()
            createLog(current_user, LogActions.DELETE_SAMPLE, 'Deleted sample: ' + deletedSample.id)
            return jsonify({'message': 'Sample has been deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

# Edits existing sample #
@sampleBlueprint.route('/datapoint/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0,1,2,3])
def edit_datapoint(access_allowed, current_user, item_id):
    if access_allowed:
        from models.sample import Sample
        from models.log import createLog
        from models.enums import LogActions
        if Sample.query.get(item_id) is None:
            return jsonify({'message': 'Sample cannot be found.'}), 404
        else:
            from server import db
            Sample.query.filter_by(id=item_id).update(request.json)
            db.session.commit()
            editedSample = Sample.query.get(item_id)
            createLog(current_user, LogActions.EDIT_SAMPLE, 'Edited sample: ' + str(editedSample.id))
            return jsonify(editedSample), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


## Batch Data API ##
# Create batch data #
@batchBluePrint.route('/datapoint/batch', methods=['POST'])
@token_required
@allowed_roles([0,1,2,3])
# batch_data is a BatchData.JSON
def create_batchdata(access_allowed, current_user, batch_data):
    if access_allowed:
        from models.batch import Batch
        from models.log import createLog
        from models.enums import LogActions
        from server import db
        db.session.add(batch_data)
        db.session.commit()
        createLog(current_user, LogActions.ADD_BATCH, 'Created batch data: ' + batch_data.id)
        return jsonify(Batch.query.get(request.json.get('id'))),
    else:
        return jsonify({'message': 'Role not allowed'}), 403

# Retrieves all batches #
@batchBluePrint.route('/datapoint/batch', methods=['GET'])
@token_required
@allowed_roles([0,1,2,3])
def get_batches(access_allowed, current_user):
    if access_allowed:
        from models.batch import Batch
        responseJSON = jsonify(Batch.query.all())
        if responseJSON.json is None:
            responseJSON = jsonify({'message': 'Batches cannot be returned.'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

# Retrieves specifed batch #
@batchBluePrint.route('/datapoint/batch/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0,1,2,3])
def get_batch(access_allowed, current_user, item_id):
    if access_allowed:
        from models.batch import Batch
        responseJSON = jsonify(Batch.query.get(item_id))
        if responseJSON.json is None:
            responseJSON = jsonify({'message': 'Batch cannot be found.'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

# Edits specified batch #
@batchBluePrint.route('/datapoint/batch/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0,1,2,3])
def edit_batch(access_allowed, current_user, item_id):
    if access_allowed:
        from models.batch import Batch
        from models.log import createLog
        from models.enums import LogActions
        if Batch.query.get(item_id) is None:
            return jsonify({'message': 'Batch cannot be found.'}), 404
        else:
            from server import db
            Batch.query.filter_by(id=item_id).update(request.json)
            db.session.commit()
            editedBatch = Batch.query.get(item_id)
            createLog(current_user, LogActions.EDIT_BATCH, 'Edited batch: ' + editedBatch.id)
            return jsonify(editedBatch), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

# Edits specified batch #
@batchBluePrint.route('/datapoint/batch/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0,1,2,3])
def delete_batch(access_allowed, current_user, item_id):
    if access_allowed:
        from models.batch import Batch
        from models.log import createLog
        from models.enums import LogActions
        if Batch.query.get(item_id) is None:
            return jsonify({'message': 'Batch cannot be found.'}), 404
        else:
            from server import db
            deletedBatch = Batch.query.get(item_id)
            db.session.delete(Batch.query.get(item_id))
            db.session.commit()
            createLog(current_user, LogActions.DELETE_SAMPLE, 'Deleted batch: ' + deletedBatch.id)
            return jsonify({'message': 'Batch has been deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
