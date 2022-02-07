from flask_restx import Namespace, Resource, fields


ns = Namespace("sources", description="Source-related operations")

# Document API for Swagger
source = ns.model(
  "source",
  {
    "id": fields.Integer(required=True, description="The Source's identifier"),
    "name": fields.String(required=True, description="The Source's name"),
    "street_address": fields.String(required=True, description="The Source's street address"),
    "city": fields.String(required=True, description="The Source's city"),
    "state": fields.String(required=True, description="The Source's state"),
    "zip": fields.String(required=True, description="The Source's zip"),
  }
)

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


@ns.route("/", methods=['GET', 'POST'])
class SourceList(Resource):
  @ns.doc("list_sources")
  def get(self):
    return SOURCES
  
  @ns.doc("create_source")
  @ns.expect(source)
  def post(self):
    return 'not implemented'

@ns.route("/<id>")
@ns.param("id", "The source's identifier")
@ns.response(404, "Source not found")
class Source(Resource):
  @ns.doc("get_source")
  def get(self, id):
    for source in SOURCES:
      if source['id'] == id:
        return source
    ns.abort(404)