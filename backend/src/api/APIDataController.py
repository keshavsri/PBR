from api.APIUserController import token_required
from flask import Blueprint, jsonify, request
from models.sample import Sample
from models.log import createLog
from models.enums import LogActions

sampleBlueprint = Blueprint('sample', __name__)

# Creates a new sample #
@sampleBlueprint.route('/datapoint', methods=['POST'])
@token_required
def create_sample(current_user):
    newSample = Sample(request.json)
    from server import db
    db.session.add(newSample)
    db.session.commit()
    createLog(current_user, LogActions.ADD_SAMPLE, 'Created new sample: ' + newSample.id)
    return jsonify(Sample.query.get(request.json.get('id'))), 

# Retrives specified sample #
@sampleBlueprint.route('/datapoint/<int:item_id>', methods=['GET'])
@token_required
def get_sample(item_id):
    responseJSON = jsonify(Sample.query.get(item_id))
    if responseJSON.json is None:
        responseJSON = jsonify({'message': 'Sample cannot be found.'})
        return responseJSON, 404
    else:
        return responseJSON, 200

# Retrieves all samples #
@sampleBlueprint.route('/datapoint', methods=['GET'])
@token_required
def get_samples():
    responseJSON = jsonify(Sample.query.all())
    if responseJSON.json is None:
        responseJSON = jsonify({'message': 'Samples cannot be returned.'})
        return responseJSON, 404
    else:
        return responseJSON, 200

# Deletes specified sample #
@sampleBlueprint.route('/datapoint/<int:item_id>', methods=['DELETE'])
@token_required
def delete_sample(current_user, item_id):
    if Sample.query.get(item_id) is None:
        return jsonify({'message': 'Sample cannot be found.'}), 404
    else:
        from server import db
        deletedFlock = Sample.query.get(item_id)
        db.session.delete(Sample.query.get(item_id))
        db.session.commit()
        createLog(current_user, LogActions.DELETE_SAMPLE, 'Deleted sample: ' + deletedFlock.id)
        return jsonify({'message': 'Sample has been deleted'}), 200

# Edits existing sample #
@sampleBlueprint.route('/datapoint/<int:item_id>', methods=['PUT'])
@token_required
def edit_datapoint(current_user, item_id):
    if Sample.query.get(item_id) is None:
        return jsonify({'message': 'Sample cannot be found.'}), 404
    else:
        from server import db
        Sample.query.filter_by(id=item_id).update(request.json)
        db.session.commit()
        editedSample = Sample.query.get(item_id)
        createLog(current_user, LogActions.EDIT_SAMPLE, 'Edited sample: ' + editedSample.id)
        return jsonify(editedSample), 200