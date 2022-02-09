from flask import Blueprint

userBlueprint = Blueprint('user', __name__)

@userBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@userBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_all(item_id=None):
  from models.user import User
  return User.fs_get_delete_put_post(item_id)

# TODO: Add login route
# TODO: Add logout route