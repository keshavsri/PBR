from server import db

from flask_serialize import FlaskSerialize

fs_mixin = FlaskSerialize(db)

class SingleDataEntry(db.Model, fs_mixin):
    id = db.Column(db.Integer, primary_key=True)
    #entered_by_user = db.Column(db.Integer, db.ForeignKey('user.id'))
    #associated_organization = db.Column(db.Integer, db.ForeignKey('organization.id'))
    data_entry_timestamp = db.Column(db.DateTime)
    #flock = db.Column(db.Integer, db.ForeignKey('flock.id'))
    flock_age = db.Column(db.DateTime)
    flock_age_units = db.Column(db.Integer)
    validation_status = db.Column(db.Integer)
    sample_type = db.Column(db.Integer)
    #machine_data = db.relationship('MachineData', backref='data')
    
    __fs_create_fields__ = __fs_update_fields__ = ['data_entry_timestamp', 'flock_age', 'flock_age_units', 'validation_status', 'sample_type']