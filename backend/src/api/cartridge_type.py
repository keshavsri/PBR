from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify
from src.models import CartridgeType as CartridgeTypeORM
from src.schemas import CartridgeType

cartridge_type_blueprint = Blueprint('cartridge-type', __name__)

@cartridge_type_blueprint.route('/', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_cartridge_types(access_allowed, current_user):
    if access_allowed:
        cartridge_types_models = CartridgeTypeORM.query.all()
        if cartridge_types_models is None:
            return jsonfiy({'message: No records found'}), 404
        else:
            cartridge_types = [CartridgeType.from_orm(cartridge_type).dict() for cartridge_type in cartridge_type_models]
            return jsonify(cartridge_types), 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403
