from server import db
from models.enums import Roles
from flask_serialize import FlaskSerialize

fs_mixin = FlaskSerialize(db)

class User(db.Model, fs_mixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    organization = db.Column(db.Integer, db.ForeignKey('organization.id'))
    email = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(120))
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    phone_number = db.Column(db.String(20))
    role = db.Column(db.Integer)
    notes = db.Column(db.String(500))
    
    __fs_create_fields__ = __fs_update_fields__ = ['password', 'organization', 'first_name', 'last_name', 'email', 'phone_number', 'role', 'notes']

db.create_all()