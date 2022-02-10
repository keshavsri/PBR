from flask import Blueprint

userBlueprint = Blueprint('user', __name__)

@userBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@userBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_all(item_id=None):
  from models.user import User
  return User.fs_get_delete_put_post(item_id)

@userBlueprint.route('/login', methods=['POST'])
def login():
  from models.user import User
  loggedIn = False
  # TODO: Add login logic
  if loggedIn:
    return "Login", 200
  else:
    return "Not Logged in", 401

@userBlueprint.route('/logout', methods=['POST'])
def logout():
  from models.user import User
  # TODO: Add logout logic
  return 'Logout', 200