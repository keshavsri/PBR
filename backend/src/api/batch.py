from flask import request, Blueprint, jsonify
from http import HTTPStatus
import re
import src.helpers
from src.enums import LogActions, ValidationTypes, Roles
from src.api.user import token_required, allowed_roles
from src import models, helpers, schemas

batchBluePrint = Blueprint('batch', __name__)

# Batch Data API #
# Create batch data #
@batchBluePrint.route('/datapoint/batch', methods=['POST'])
@token_required
@allowed_roles([0, 1, 2, 3])
# batch_data is a BatchData.JSON
def create_batch_data(access_allowed, current_user, batch_data):
    """
    NOT IMPLEMENTED YET.
    """
    if access_allowed:
        models.db.session.add(batch_data)
        models.db.session.commit()
        models.create_log(current_user, LogActions.ADD_BATCH,
                         'Created batch data: ' + batch_data.id)
        return jsonify(models.Batch.query.get(request.json.get('id'))),
    else:
        return jsonify({'message': 'Role not allowed'}), 403


# Retrieves all batches #
@batchBluePrint.route('/datapoint/batch', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_batches(access_allowed, current_user):
    """
    NOT IMPLEMENTED YET.
    """
    if access_allowed:
        response_json = jsonify(models.Batch.query.all())
        if response_json.json is None:
            response_json = jsonify({'message': 'Batches cannot be returned.'})
            return response_json, 404
        else:
            return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


# Retrieves specified batch #
@batchBluePrint.route('/datapoint/batch/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_batch(access_allowed, current_user, item_id):
    """
    NOT IMPLEMENTED YET.
    """
    if access_allowed:
        response_json = jsonify(models.Batch.query.get(item_id))
        if response_json.json is None:
            response_json = jsonify({'message': 'Batch cannot be found.'})
            return response_json, 404
        else:
            return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


# Edits specified batch #
@batchBluePrint.route('/datapoint/batch/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2, 3])
def edit_batch(access_allowed, current_user, item_id):
    """
    NOT IMPLEMENTED YET.
    """
    if access_allowed:
        if models.Batch.query.get(item_id) is None:
            return jsonify({'message': 'Batch cannot be found.'}), 404
        else:
            models.Batch.query.filter_by(id=item_id).update(request.json)
            models.db.session.commit()
            edited_batch = models.Batch.query.get(item_id)
            models.create_log(current_user, LogActions.EDIT_BATCH,
                             'Edited batch: ' + edited_batch.id)
            return jsonify(edited_batch), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


# Edits specified batch #
@batchBluePrint.route('/datapoint/batch/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1, 2, 3])
def delete_batch(access_allowed, current_user, item_id):
    """
    NOT IMPLEMENTED YET.
    """
    if access_allowed:
        if models.Batch.query.get(item_id) is None:
            return jsonify({'message': 'Batch cannot be found.'}), 404
        else:
            deleted_batch = models.Batch.query.get(item_id)
            models.db.session.delete(models.Batch.query.get(item_id))
            models.db.session.commit()
            models.create_log(current_user, LogActions.DELETE_SAMPLE,
                             'Deleted batch: ' + deleted_batch.id)
            return jsonify({'message': 'Batch has been deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403