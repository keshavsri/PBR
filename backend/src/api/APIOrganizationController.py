from flask import Blueprint


organizationBlueprint = Blueprint('organization', __name__)

@organizationBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE', 'POST'])
@organizationBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_all(item_id=None):
    from models.organization import Organization
    return Organization.fs_get_delete_put_post(item_id)
