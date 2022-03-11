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
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user: User = db.relationship('User')
    role: Roles = db.Column(db.Enum(Roles))
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'))
    organization: Organization = db.relationship('Organization')
    action: LogActions = db.Column(db.Enum(LogActions))
    logContent: str = db.Column(db.String(500))
    logTime: str = db.Column(db.DateTime, server_default=db.func.now())
    
    def __init__(self, requestJSON):
        self.user = requestJSON.get('user')
        self.organization = requestJSON.get('organization')
        self.role = requestJSON.get('role')
        self.action = requestJSON.get('action')
        self.logContent = requestJSON.get('logContent')
        
    def __init__(self, user, organization, role, action, logContent):
        self.user_id = user
        self.organization_id = organization
        self.role = role
        self.action = action
        self.logContent = logContent


def createTable():
    db.create_all()
    
def createLog(current_user, action, logContent):
    log = Log(current_user.id, current_user.organization, current_user.role, action, logContent)
    db.session.add(log)
    db.session.commit()
