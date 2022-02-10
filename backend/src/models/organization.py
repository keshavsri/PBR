from server import db
from models.enums import States
from flask_serialize import FlaskSerialize

fs_mixin = FlaskSerialize(db)

class Organization(db.Model, fs_mixin):
    userTable = 'Organization'
    # need to add other one to many 
    id = db.Column(db.Integer, primary_key=True)
    street_address = db.Column(db.String(120))
    city = db.Column(db.String(120))
    state = db.Column(db.String(20))
    zip = db.Column(db.String(10))
    notes = db.Column(db.String(500))

    users = db.relationship("User")

    
    __fs_create_fields__ = __fs_update_fields__ = ['ID', 'street_address', 'city', 'state', 'zip', 'notes']

db.create_all()