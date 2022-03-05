from dataclasses import dataclass
from server import db

from models.user import User
from models.organization import Organization
from models.enums import Roles, LogActions
@dataclass
class Log(db.Model):
    __tablename__ = 'log'
    __table_args__ = {'extend_existing': True}
    
    id: int = db.Column(db.Integer, primary_key=True)
    user: User = db.Column(db.Integer, db.ForeignKey('user.id'))
    role: Roles = db.Column(db.Enum(Roles))
    organization: Organization = db.Column(db.Integer, db.ForeignKey('organization.id'))
    action: LogActions = db.Column(db.Enum(LogActions))
    logContent: str = db.Column(db.String(500))
    
    def __init__(self, requestJSON):
        self.user = requestJSON.get('user')
        self.organization = requestJSON.get('organization')
        self.role = requestJSON.get('role')
        self.action = requestJSON.get('action')
        self.logContent = requestJSON.get('logContent')
        
    def __init__(self, user, organization, role, action, logContent):
        self.user = user
        self.organization = organization
        self.role = role
        self.action = action
        self.logContent = logContent


def createTable():
    db.create_all()
    
def createLog(current_user, action, logContent):
    from models.user import User
    user = User.query.get(current_user.id)
    log = Log(user.id, user.organization, user.role, action, logContent)
    db.session.add(log)
    db.session.commit()
