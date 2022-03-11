from flask import Blueprint, jsonify, request
from api.APIUserController import token_required

logBlueprint = Blueprint('log', __name__)

@logBlueprint.route('/', methods=['GET'])
@logBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
def handleLog(current_user, item_id = None):
    from models.log import Log
    from models.enums import Roles
    if request.method == 'GET':
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        current_Organization = current_user.organization_id
        # if item id exists then it will return the organization with the id
        if item_id:
            log = Log.query.get(item_id)
            if current_user.role == Roles.Super_Admin:
                responseJSON = jsonify(log)
            elif log.organization == current_Organization:
                responseJSON = jsonify(log)
            else:
                return jsonify({'message': 'You cannot access this log'}), 403
            
        # otherwise it will return all the organizations in the database
        elif current_user.role == Roles.Super_Admin:
            responseJSON = jsonify(Log.query.all())
        else:
            responseJSON = jsonify(Log.query.filter_by(organization_id=current_Organization).all())
        # if the response json is empty then return a 404 not found
        if responseJSON.json is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'error': 'Method not allowed'}), 405