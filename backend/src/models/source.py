from server import db
from models.enums import States
from flask_serialize import FlaskSerialize

fs_mixin = FlaskSerialize(db)

class Source(db.Model, fs_mixin):
    __tablename__ = 'source'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), index=True, unique=True)
    street_address = db.Column(db.String(120))
    city = db.Column(db.String(120))
    state = db.Column(db.String(20))
    zip = db.Column(db.String(10))
    organizations = None
    
    __fs_create_fields__ = __fs_update_fields__ = ['name', 'street_address', 'city', 'state', 'zip', 'organizations']

def createTable():
    db.create_all()


