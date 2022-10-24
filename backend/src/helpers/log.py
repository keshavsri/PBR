from typing import List

from src.models import db
from src.models import Log as LogORM
from src.schemas import Log

def create_log(current_user, action, logContent):
    """ This function creates a log entry.

    It takes the current user, the action that was performed, and the content of the action.

    Args:
        current_user: The user who did the action
        action: The action that was performed
        logContent: A more readable version of the action with an ID or name of the affected object
    """
    log = Log(current_user.id, current_user.organization_id, current_user.role, action, logContent)
    db.session.add(log)
    db.session.commit()

def get_logs_by_org(org_id: int) -> List[dict]:
    """
    The get_logs_by_org function accepts an integer id as input and returns a list of dictionaries containing
    the logs' information.

    :param org_id:int: Used to specify the id of the organization that we want to retrieve the logs from.
    :return: A list of dictionaries containing the logs formatted by pydantic.
    """
    logs = LogORM.query.filter_by(organization_id=org_id).all()
    ret = []
    for log in logs:
        ret.append(Log.from_orm(log).dict())
    return ret

def get_logs() -> List[dict]:
    """
    The get_logs function returns a list of dictionaries containing all the logs.

    :return: A list of dictionaries containing the logs formatted by pydantic.
    """
    logs = LogORM.query.filter_by().all()
    ret = []
    for log in logs:
        ret.append(Log.from_orm(log).dict())
    return ret
