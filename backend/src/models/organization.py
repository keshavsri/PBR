from unicodedata import name
from server import db
from models.enums import States
from flask_serialize import FlaskSerialize

fs_mixin = FlaskSerialize(db)

class Organization(db.Model, fs_mixin):
    __tablename__ = 'organization'
    __table_args__ = {'extend_existing': True}
    # need to add other one to many 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    street_address = db.Column(db.String(120))
    city = db.Column(db.String(120))
    state = db.Column(db.String(20))
    zip = db.Column(db.String(10))
    mainContact = db.Column(db.Integer, db.ForeignKey('user.id'))
    notes = db.Column(db.String(500))
    sources = None

    
    __fs_create_fields__ = __fs_update_fields__ = ['name','street_address', 'city', 'state', 'zip', 'mainContact','notes']

def createTable():
        db.create_all()
