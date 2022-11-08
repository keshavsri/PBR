from typing import List

from src.models import db
from src.models import Log

def create_log(current_user, action, logContent):
    """ This function creates a log entry.

    It takes the current user, the action that was performed, and the content of the action.

    Args:
        current_user: The user who did the action
        action: The action that was performed
        logContent: A more readable version of the action with an ID or name of the affected object
    """
    log = Log(current_user.id, action, logContent)
    db.session.add(log)
    db.session.commit()
