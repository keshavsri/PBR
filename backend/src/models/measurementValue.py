from dataclasses import dataclass
from server import db


@dataclass
class MeasurementValue(db.Model):

    from models.measurement import Measurement
    # from models.sample import Sample

    id: int = db.Column(db.Integer, primary_key=True)
    measurement_id = db.Column(db.Integer, db.ForeignKey('measurement.id'), nullable=False)
    measurement: Measurement = db.relationship('Measurement')
    sample_id = db.Column(db.Integer, db.ForeignKey('sample.id'), nullable=False)
    # sample: Sample = db.relationship('Sample')
    value: str = db.column(db.String(120))
    
    def __init__(self, valueJSON):
        self.measurement_id = valueJSON.get('measurement')
        self.sample_id = valueJSON.get('sample')
        self.value = valueJSON.get('value')