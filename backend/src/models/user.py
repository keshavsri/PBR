from server import db
from dataclasses import dataclass

from models.enums import Roles

@dataclass
class User(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'))
    from models.organization import OrganizationORM
    organization: OrganizationORM = db.relationship('Organization')
    email: str = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    first_name: str = db.Column(db.String(120), nullable=False)
    last_name: str = db.Column(db.String(120), nullable=False)
    phone_number: str = db.Column(db.String(20))
    role: Roles = db.Column(db.Enum(Roles))
    notes: str = db.Column(db.String(500))
    
    def createTable():
        db.create_all()