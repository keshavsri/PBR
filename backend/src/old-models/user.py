from server import db
from dataclasses import dataclass

from models.enums import Roles

@dataclass
class UserORM(db.Model):
    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True}


    id: int = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'))
    email: str = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    first_name: str = db.Column(db.String(120), nullable=False)
    last_name: str = db.Column(db.String(120), nullable=False)
    phone_number: str = db.Column(db.String(20))
    role: Roles = db.Column(db.Enum(Roles))
    notes: str = db.Column(db.String(500))

    # Foreign References to this Object
    sample = db.relationship('sample',  backref='user')

    
    def createTable():
        db.create_all()