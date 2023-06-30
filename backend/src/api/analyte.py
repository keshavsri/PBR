from flask import request, Blueprint, jsonify
from src.models import Analyte as AnalyteORM
from src.api.user import token_required, allowed_roles
from src.models import db, engine
from src import schemas

analyteBlueprint = Blueprint('analyte', __name__)

@analyteBlueprint.route('/<int:cartridge_type_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_analytes_by_cartridge_type(access_allowed, cartridge_type_id):

    """
    This function gets all analytes for a specified cartridge type.
    :param access_allowed: boolean, whether the user has access to the endpoint
    :param current_user: the user object of the user making the request
    :param cartridge_type_id: the id of the cartridge type to retrieve analytes of
    :return: a json response containing all analytes for the cartridge type
    """
    if access_allowed:

        analytes = []

        sql_text = db.text(""" 
        SELECT a.id
        FROM analyte_table a, cartridge_types_analytes_table cta 
        WHERE a.id = cta.analyte_id 
        AND cta.cartridge_type_id = :cartridge_type_id;
        """)
        with engine.connect() as connection:
            result = connection.execute(sql_text, {"cartridge_type_id": cartridge_type_id})
            analytes = [schemas.Analyte.from_orm(AnalyteORM.query.get(row.id)).dict() for row in result]

        if not analytes:
            return jsonify(analytes), 404
        else:
            return jsonify(analytes), 200

    else:
        return jsonify({'message': 'Role not allowed'}), 403