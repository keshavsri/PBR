from api.APIUserController import token_required
from flask import Blueprint, jsonify, request

sampleBlueprint = Blueprint('sample', __name__)
batchBluePrint = Blueprint('batch', __name__)

## Sample API ##
# Creates a new sample #
@sampleBlueprint.route('/datapoint', methods=['POST'])
@token_required
def create_sample(current_user):
    from models.sample import Sample
    from models.log import createLog
    from models.enums import LogActions
    newSample = Sample(request.json)
    from server import db
    db.session.add(newSample)
    db.session.commit()
    createLog(current_user, LogActions.ADD_SAMPLE, 'Created new sample: ' + str(newSample.id))
    return jsonify(Sample.query.get(request.json.get('id'))), 201

# Retrives specified sample #
@sampleBlueprint.route('/datapoint/<int:item_id>', methods=['GET'])
@token_required
def get_sample(current_user,item_id):
    from models.sample import Sample
    responseJSON = jsonify(Sample.query.get(item_id))
    if responseJSON.json is None:
        responseJSON = jsonify({'message': 'Sample cannot be found.'})
        return responseJSON, 404
    else:
        return responseJSON, 200

# Retrieves all samples #
@sampleBlueprint.route('/datapoint', methods=['GET'])
@token_required
def get_samples(current_user):
    from models.sample import Sample
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
    from models.sample import Sample
    from models.log import createLog
    from models.enums import LogActions
    if Sample.query.get(item_id) is None:
        return jsonify({'message': 'Sample cannot be found.'}), 404
    else:
        from server import db
        deletedSample = Sample.query.get(item_id)
        db.session.delete(Sample.query.get(item_id))
        db.session.commit()
        createLog(current_user, LogActions.DELETE_SAMPLE, 'Deleted sample: ' + deletedSample.id)
        return jsonify({'message': 'Sample has been deleted'}), 200

# Edits existing sample #
@sampleBlueprint.route('/datapoint/<int:item_id>', methods=['PUT'])
@token_required
def edit_datapoint(current_user, item_id):
    from models.sample import Sample
    from models.log import createLog
    from models.enums import LogActions
    if Sample.query.get(item_id) is None:
        return jsonify({'message': 'Sample cannot be found.'}), 404
    else:
        from server import db
        Sample.query.filter_by(id=item_id).update(request.json)
        db.session.commit()
        editedSample = Sample.query.get(item_id)
        createLog(current_user, LogActions.EDIT_SAMPLE, 'Edited sample: ' + str(editedSample.id))
        return jsonify(editedSample), 200


## Batch Data API ##
# Create batch data #
@batchBluePrint.route('/datapoint/batch', methods=['POST'])
@token_required
# batch_data is a BatchData.JSON
def create_batchdata(current_user, batch_data):
    from models.batch import Batch
    from models.log import createLog
    from models.enums import LogActions
    from server import db
    db.session.add(batch_data)
    db.session.commit()
    createLog(current_user, LogActions.ADD_BATCH, 'Created batch data: ' + batch_data.id)
    return jsonify(Batch.query.get(request.json.get('id'))),

# Retrieves all batches #
@batchBluePrint.route('/datapoint/batch', methods=['GET'])
@token_required
def get_batches(current_user):
    from models.batch import Batch
    responseJSON = jsonify(Batch.query.all())
    if responseJSON.json is None:
        responseJSON = jsonify({'message': 'Batches cannot be returned.'})
        return responseJSON, 404
    else:
        return responseJSON, 200

# Retrieves specifed batch #
@batchBluePrint.route('/datapoint/batch/<int:item_id>', methods=['GET'])
@token_required
def get_batch(current_user, item_id):
    from models.batch import Batch
    responseJSON = jsonify(Batch.query.get(item_id))
    if responseJSON.json is None:
        responseJSON = jsonify({'message': 'Batch cannot be found.'})
        return responseJSON, 404
    else:
        return responseJSON, 200

# Edits specified batch #
@batchBluePrint.route('/datapoint/batch/<int:item_id>', methods=['PUT'])
@token_required
def edit_batch(current_user, item_id):
    from models.batch import Batch
    from models.log import createLog
    from models.enums import LogActions
    if Batch.query.get(item_id) is None:
        return jsonify({'message': 'Batch cannot be found.'}), 404
    else:
        from server import db
        Batch.query.filter_by(id=item_id).update(request.json)
        db.session.commit()
        editedBatch = Batch.query.get(item_id)
        createLog(current_user, LogActions.EDIT_BATCH, 'Edited batch: ' + editedBatch.id)
        return jsonify(editedBatch), 200

# Edits specified batch #
@batchBluePrint.route('/datapoint/batch/<int:item_id>', methods=['DELETE'])
@token_required
def delete_batch(current_user, item_id):
    from models.batch import Batch
    from models.log import createLog
    from models.enums import LogActions
    if Batch.query.get(item_id) is None:
        return jsonify({'message': 'Batch cannot be found.'}), 404
    else:
        from server import db
        deletedBatch = Batch.query.get(item_id)
        db.session.delete(Batch.query.get(item_id))
        db.session.commit()
        createLog(current_user, LogActions.DELETE_SAMPLE, 'Deleted batch: ' + deletedBatch.id)
        return jsonify({'message': 'Batch has been deleted'}), 200