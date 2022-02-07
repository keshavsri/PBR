from server import db
from enums import Roles


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(120))
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    email = db.Column(db.String(120), index=True, unique=True)
    phone_number = db.Column(db.String(20))
    role = db.Column(db.Integer)
    organization = db.relationship('Organization', backref='user')
    notes = db.Column(db.String(500))

    def __init__(self, username, password, first_name, last_name, email, phone_number, role, organization,notes):
        self.username = username
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.phone_number = phone_number
        self.role = role
        self.organization = organization
        self.notes = notes