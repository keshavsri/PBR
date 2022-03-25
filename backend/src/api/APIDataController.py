from flask import request, Blueprint, jsonify, Response, make_response
from http import HTTPStatus
from api.APIUserController import token_required
import re

sampleBlueprint = Blueprint('sample', __name__)
batchBlueprint = Blueprint('batch', __name__)

# A set of all allowed file extensions for parsing files
ALLOWED_EXTENSIONS = set(['txt'])

@sampleBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@sampleBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_sample(item_id=None):
    from models.sample import sample
    return Sample.fs_get_delete_put_post(item_id)

@batchBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@batchBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_batch(item_id=None):
    from models.batch import Batch
    return Batch.fs_get_delete_put_post(item_id)

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
   
