from flask import Blueprint
from http import HTTPStatus
from APIUserController import token_required

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

		resp = jsonify({'message' : 'File successfully read', 'data': {test:5, data:10}})
		resp.status_code = HTTPStatus.OK
		return resp
	else:
		resp = jsonify({'message' : 'Invalid file type'})
		resp.status_code = HTTPStatus.UNSUPPORTED_MEDIA_TYPE
		return resp

# Method to check the filetype of a given filename
check_allowed_filetype(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

parse_file(file):
    if not check_allowed_filetype(file.filename):
        raise Exception("Invalid file type")
    print(file)
