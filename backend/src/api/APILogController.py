from flask import Blueprint, jsonify, request

logBlueprint = Blueprint('log', __name__)

@logBlueprint.route('/', methods=['GET', 'POST'])
@logBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE'])
def handleLog(item_id = None):
    from models.log import Log
    if request.method == 'GET':
        if item_id is None:
            return jsonify(Log.query.all())
        else:
            return jsonify(Log.query.get(item_id))