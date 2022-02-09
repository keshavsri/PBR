from flask import Blueprint


sourceBlueprint = Blueprint('source', __name__)

@sourceBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@sourceBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_all(item_id=None):
    from models.source import Source
    return Source.fs_get_delete_put_post(item_id)
