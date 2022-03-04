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
    elif request.method == 'POST':
        if Log.query.filter_by(id=item_id).first() is None:
            from server import db
            log = Log(request.json)
            db.session.add(log)
            db.session.commit()
            return jsonify(log), 201
        else:
            return jsonify({'message': 'Log already exists'}), 409
    elif request.method == 'PUT':
        if Log.query.filter_by(id=item_id).first() is None:
            return jsonify({'message': 'Log does not exist'}), 404
        Log.query.filter_by(id=item_id).update(request.json)
        return jsonify(Log.query.get(item_id)), 200
    elif request.method == 'DELETE':
        if Log.query.filter_by(id=item_id).first() is None:
            return jsonify({'message': 'Log does not exist'}), 404      
        db.session.delete(Log.query.get(item_id))
        db.session.commit()
        return jsonify({'message': 'Log deleted'}), 200