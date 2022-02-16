from platform import machine
from unicodedata import name
from server import db

from flask_serialize import FlaskSerialize

fs_mixin = FlaskSerialize(db)

class Machine(db.Model, fs_mixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    #data = db.Column(db.Integer, db.foreign_key('machinedatatype.id'))
    
    __fs_create_fields__ = __fs_update_fields__ = ['name']

class MachineDataType(db.Model, fs_mixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    abbreviation = db.Column(db.String(120))
    units = db.Column(db.String(120))
    required = db.Column(db.Boolean)
    
    __fs_create_fields__ = __fs_update_fields__ = ['name', 'abbreviation', 'units', 'required']

class DataWrapper(db.Model, fs_mixin):
    id = db.Column(db.Integer, primary_key=True)
    #machinedatatype = db.relationship('MachineDataType', backref='data')
    value = db.Column(db.Float)
    
    __fs_create_fields__ = __fs_update_fields__ = ['value']
    
class MachineData(db.Model, fs_mixin):
    id = db.Column(db.Integer, primary_key=True)
    test_timestamp = db.Column(db.DateTime)
    #machine = db.relationship('Machine', backref='data')
    #data = db.relationship('DataWrapper', backref='data')
    
    __fs_create_fields__ = __fs_update_fields__ = ['test_timestamp']
    
db.create_all()
