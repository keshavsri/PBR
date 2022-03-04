from dataclasses import dataclass
from server import db

from models.measurement import Measurement
from models.sample import Sample
@dataclass
class MeasurementValue(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    measurement: Measurement = db.Column(db.Integer, db.ForeignKey(Measurement.id), nullable=False)
    sample: Sample = db.Column(db.Integer, db.ForeignKey(Sample.id), nullable=False)
    value: str = db.column(db.String(120))