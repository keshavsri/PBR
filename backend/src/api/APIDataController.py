from flask import Blueprint


sampleBlueprint = Blueprint('sample', __name__)
batchBlueprint = Blueprint('batch', __name__)

@sampleBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@sampleBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_sample(item_id=None):
    from models.sample import sample
    return Sample.fs_get_delete_put_post(item_id)

@batchBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@batchBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_batch(item_id=None):
    from models.batch import Batch
    return Batch.fs_get_delete_put_post(item_id)
