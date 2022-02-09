from flask import request, jsonify, Blueprint


sourceBlueprint = Blueprint('source', __name__)

SOURCES = [
    {
        "id": "1",
        'name': 'CVM',
        'street_address': '123 Main St',
        'city': 'Raleigh',
        'state': 'NC',
        'zip': '27606'
    },
    {
        'id': '2',
        'name': 'CVM Alternative',
        'street_address': '123 Main St',
        'city': 'Raleigh',
        'state': 'NC',
        'zip': '27606'
    }
] 

@sourceBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@sourceBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_all(item_id=None):
    from models.source import Source
    return Source.fs_get_delete_put_post(item_id)
