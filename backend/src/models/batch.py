from server import db

from flask_serialize import FlaskSerialize

fs_mixin = FlaskSerialize(db)

class Batch(db.Model, fs_mixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    
    __fs_create_fields__ = __fs_update_fields__ = ['name']