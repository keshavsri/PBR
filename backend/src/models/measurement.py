from dataclasses import dataclass
from server import db

from models.machine import Machine
from models.measurementType import MeasurementType
from models.organization import Organization

@dataclass
class Measurement(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    machine_id = db.Column(db.Integer, db.ForeignKey('machine.id'), nullable=False)
    machine: Machine = db.relationship('Machine')
    measurement_type_id = db.Column(db.Integer, db.ForeignKey('measurement_type.id'), nullable=False)
    measurement_type: MeasurementType = db.relationship('MeasurementType')
    
    def __init__(self, requestJSON):
        self.machine_id = requestJSON.get('machine')
        self.measurement_type_id = requestJSON.get('measurement_type')