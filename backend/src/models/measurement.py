from dataclasses import dataclass
from server import db

from models.machine import Machine
from models.measurementType import MeasurementType
from models.organization import Organization

@dataclass
class Measurement(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    machine: Machine = db.Column(db.Integer, db.ForeignKey(Machine.id), nullable=False)
    measurement_type: MeasurementType = db.Column(db.Integer, db.ForeignKey(MeasurementType.id), nullable=False)