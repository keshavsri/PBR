from flask import Blueprint, jsonify, request

logBlueprint = Blueprint('log', __name__)

@logBlueprint.route('/', methods=['GET'])
@logBlueprint.route('/<int:item_id>', methods=['GET'])
def handleLog(item_id = None):
    from models.log import Log
    if request.method == 'GET':
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        # if item id exists then it will return the organization with the id
        if item_id:
            responseJSON = jsonify(Log.query.get(item_id))
        # otherwise it will return all the organizations in the database
        else:
            responseJSON = jsonify(Log.query.all())
        # if the response json is empty then return a 404 not found
        if responseJSON.json is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'error': 'Method not allowed'}), 405