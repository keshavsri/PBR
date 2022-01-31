from flask_restx import Namespace, Resource, fields

api = Namespace("users", description="Users-related operations")

# Document API for Swagger
user = api.model(
  "User",
  {
    "id": fields.Integer(required=True, description="The User's identifier"),
    "username": fields.String(required=True, description="The User's username"),
    "email": fields.String(required=True, description="The User's email"),
  }
)

USERS = [
  {
    "id": "1",
    "username": "aaronp",
    "email": "arpenny@ncsu.edu"
  },
  {
    "id": "2",
    "username": "loganp",
    "email": "lppenny@ncsu.edu"
  }
]

@api.route("/")
class UserList(Resource):
  @api.doc("list_users")
  def get(self):
    return USERS

@api.route("/<id>")
@api.param("id", "The user's identifier")
@api.response(404, "User not found")
class User(Resource):
  @api.doc("get_user")
  def get(self, id):
    for user in USERS:
      if user['id'] == id:
        return user
    api.abort(404)