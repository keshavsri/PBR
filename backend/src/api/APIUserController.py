from flask_restx import Namespace, Resource, fields

api = Namespace("users", description="Users-related operations")

# Document API for Swagger
user = api.model(
  "User",
  {
    "id": fields.Integer(required=True, description="The User's identifier"),
    "username": fields.String(required=True, description="The User's username"),
    "password": fields.String(required=True, description="The User's password"),
    "first_name": fields.String(required=True, description="The User's first name"),
    "last_name": fields.String(required=True, description="The User's last name"),
    "email": fields.String(required=True, description="The User's email"),
    "phone_number": fields.String(required=True, description="The User's phone number"),
    "role": fields.Integer(required=True, description="The User's role"),
    "organization": fields.Integer(required=True, description="The User's organization"),
    "notes": fields.String(required=True, description="The User's notes"),
  }
)

USERS = [
  {
    "id": "1",
    "username": "admin",
    "password": "admin",
    "first_name": "Admin",
    "last_name": "User",
    "email": "test@test.com",
    "phone_number": "123-456-7890",
    "role": 1,
    "organization": 1,
    "notes": "This is the admin user"
  }, 
  {
    "id": "2",
    "username": "supervisor",
    "password": "supervisor",
    "first_name": "Supervisor",
    "last_name": "User",
    "email": "test1@test.com",
    "phone_number": "123-456-7890",
    "role": 2,
    "organization": 1,
    "notes": "This is the supervisor user"
  },
  {
    "id": "3",
    "username": "data_collector",
    "password": "data_collector",
    "first_name": "Data",
    "last_name": "Collector",
    "email": "test2@test.com",
    "phone_number": "123-456-7890",
    "role": 3,
    "organization": 1,
    "notes": "This is the data collector user"
  }
]


@api.route("/", methods=['GET', 'POST'])
class UserList(Resource):
  @api.doc("list_users")
  def get(self):
    return USERS

  @api.doc("create_user")
  @api.expect(user)
  def post(self):
    return 'not implemented'

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