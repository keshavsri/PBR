from dataclasses import dataclass
from backend.src.models import organization
from server import db

from models.user import User
from models.organization import Organization

@dataclass
class Log(db.model):
    __tablename__ = 'log'
    __table_args__ = {'extend_existing': True}
    
    id: int = db.Column(db.Integer, primary_key=True)
    user: User = db.Column(db.Integer, db.ForeignKey('user.id'))
    organization: Organization = db.Column(db.Integer, db.ForeignKey('organization.id'))
    logContent: str = db.Column(db.String(500))
    
    def __init__(self, requestJSON):
        self.user = requestJSON.get('user')
        self.organization = requestJSON.get('organization')
        self.logContent = requestJSON.get('logContent')
        
    def __init__(self, user, organization, logContent):
        self.user = user
        self.organization = organization
        self.logContent = logContent


def createTable():
    db.create_all()
