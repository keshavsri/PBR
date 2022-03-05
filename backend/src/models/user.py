from server import db
from dataclasses import dataclass

from models.enums import Roles
from models.organization import Organization

@dataclass
class User(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    organization: Organization = db.Column(db.Integer, db.ForeignKey(Organization.id), nullable=False)
    email: str = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password: str = db.Column(db.String(120), nullable=False)
    first_name: str = db.Column(db.String(120), nullable=False)
    last_name: str = db.Column(db.String(120), nullable=False)
    phone_number: str = db.Column(db.String(20), nullable=False)
    role: Roles = db.Column(db.Enum(Roles), nullable=False)
    notes: str = db.Column(db.String(500))
    
def createTable():
    db.create_all()