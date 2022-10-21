from flask import Blueprint, jsonify, request
from src.api.APIUserController import token_required
from src import models
from src.enums import Roles, LogActions
from src import helpers
from src.schemas import Log

logBlueprint = Blueprint('log', __name__)

@logBlueprint.route('/', methods=['GET'])
@logBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
def handleLog(current_user, item_id = None):

    """
    This function handles the GET request for the logs.

    :param current_user: The user who made the request.
    :param item_id: The id of the log to get.

    :return: A JSON object containing the logs.
    """

    if request.method == 'GET':
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        current_Organization = current_user.organization_id
        # if item id exists then it will return the organization with the id
        if item_id:
            log =  models.Log.query.get(item_id)
            if current_user.role == Roles.Super_Admin:
                responseJSON = Log.from_orm(log).dict()
            elif log.organization == current_Organization:
                responseJSON = Log.from_orm(log).dict()
            else:
                return jsonify({'message': 'You cannot access this log'}), 403
            
        # otherwise it will return all the organizations in the database
        elif current_user.role == Roles.Super_Admin:
            responseJSON = jsonify(helpers.get_logs())
        else:
            responseJSON = helpers.get_logs_by_org(current_Organization)
        # if the response json is empty then return a 404 not found
        if responseJSON is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'error': 'Method not allowed'}), 405
