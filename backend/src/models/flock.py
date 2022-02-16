from server import db
from enums import Bird_Gender
from flask_serialize import FlaskSerialize

fs_mixin = FlaskSerialize(db)



class Flock(db.Model, fs_mixin):
    id = db.Column(db.Integer, primary_key=True)
    #associated_organization = db.relationship('Organization', backref='flock')
    strain = db.Column(db.String(120))
    species = db.Column(db.String(120))
    gender = db.Column(db.Integer)
    #source = db.relationship('Source', backref='flock')
    production_type = db.Column(db.String(120))
    
    __fs_create_fields__ = __fs_update_fields__ = ['strain', 'species', 'gender', 'production_type']

db.create_all()
