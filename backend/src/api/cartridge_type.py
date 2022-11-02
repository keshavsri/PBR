from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify
from src.models import CartridgeType as CartridgeTypeORM, db, engine
from src.schemas import CartridgeType

cartridgeTypeBlueprint = Blueprint('cartridge-type', __name__)

@cartridgeTypeBlueprint.route('/', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_cartridge_types(access_allowed, current_user):
    if access_allowed:
        cartridge_types_models = CartridgeTypeORM.query.all()
        cartridge_types = [CartridgeType.from_orm(cartridge_type).dict() for cartridge_type in cartridge_types_models]
        return jsonify(cartridge_types), 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403
