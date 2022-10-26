from typing import List
from Flask import jsonify
from src.models import User as UserORM
from src.schemas import User

def get_users(org_id: int, current_user) -> List[dict]:
    """
    The get_samples_by_org function accepts an integer id as input and returns a list of dictionaries containing
    the samples' information.

    :param org_id:int: Used to specify the id of the organization that we want to retrieve the samples from.
    :return: A list of dictionaries containing the samples formatted by pydantic.
    """

    users = UserORM.query.filter_by(organization_id=org_id, is_deleted=False)
    ret = {
        "rows": [],
        "types": []
    }
    for user in users:
        ret["rows"].append(User.from_orm(user).dict())
    return jsonify(ret)