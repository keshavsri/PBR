from platform import machine
from unicodedata import name
from server import db

from flask_serialize import FlaskSerialize

fs_mixin = FlaskSerialize(db)

class Machine(db.Model, fs_mixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    type = db.Column(db.Integer, db.ForeignKey('machine_type.id'))
    #data = db.Column(db.Integer, db.foreign_key('machinedatatype.id'))
    
    __fs_create_fields__ = __fs_update_fields__ = ['name', 'type']

class MachineType(db.Model, fs_mixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    
    __fs_create_fields__ = __fs_update_fields__ = ['name']

class DataType(db.Model, fs_mixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    abbreviation = db.Column(db.String(120))
    units = db.Column(db.String(120))
    required = db.Column(db.Boolean)
    
    __fs_create_fields__ = __fs_update_fields__ = ['name', 'abbreviation', 'units', 'required']

class DataWrapper(db.Model, fs_mixin):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Float)
    datatype = db.Column(db.Integer, db.ForeignKey('datatype.id'))
    
    __fs_create_fields__ = __fs_update_fields__ = ['value', 'datatype']


db.create_all()
