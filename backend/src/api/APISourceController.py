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

# @sourceBlueprint.route('/', methods=['GET', 'POST'])
# def sources(sourceJSON=None):
#   from models.source import Source
#   if request.method == 'GET':
#     return Source.fs_get_delete_put_post()
#   elif request.method == 'POST':
#     from server import db
#     sourceJSON = request.get_json()
#     newSource = Source(sourceJSON.get('name'), sourceJSON.get('street_address'), sourceJSON.get('city'), sourceJSON.get('state'), sourceJSON.get('zip'))
#     # TODO: check if source already exists in db before adding
#     db.session.add(newSource)
#     db.session.commit()
#     return 'Success', 201

# @sourceBlueprint.route('/<id>', methods=['GET', 'DELETE', 'PUT'])
# def getSource(id):
#   from models.source import Source
#   if request.method == 'GET':
#     return Source.fs_get_delete_put_post(id)
#   elif request.method == 'DELETE':
#     return Source.fs_get_delete_put_post(id)
#   elif request.method == 'PUT':
#     return Source.fs_get_delete_put_post(id)
  

@sourceBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@sourceBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_all(item_id=None):
    from models.source import Source
    return Source.fs_get_delete_put_post(item_id)
