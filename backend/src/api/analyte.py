from flask import request, Blueprint, jsonify
from src.models import Analyte as AnalyteORM
from src.api.user import token_required, allowed_roles

analyteBlueprint = Blueprint('analyte', __name__)

@analyteBlueprint.route('/<int:cartridge_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_analytes_by_cartridge_type(access_allowed, cartridge_type_id):

    """
    This function gets all analytes for a specified cartridge type.
    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request
    :param cartridge_id: the id of the cartridge to retrieve analytes of
    :return: a json response containing all analytes for the cartridge type
    """

    if access_allowed:
        responseJSON = jsonify(AnalyteORM.query.filter_by(cartridge_type_id=cartridge_type_id).all())

        if responseJSON is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200

    else:
        return jsonify({'message': 'Role not allowed'}), 403