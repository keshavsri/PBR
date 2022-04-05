from dataclasses import dataclass
from server import db
from datetime import datetime


@dataclass
class MeasurementValueORM(db.Model):
    __tablename__ = 'measurementvalue'
    __table_args__ = {'extend_existing': True}

    id: int = db.Column(db.Integer, primary_key=True)
    value: str = db.column(db.String(120))
    timestamp_added: datetime = db.Column(db.DateTime)

    # References to Foreign Objects
    measurement_id: int = db.Column(db.Integer, db.ForeignKey('measurement.id'), nullable=False)
    sample_id: int = db.Column(db.Integer, db.ForeignKey('sample.id'), nullable=False)
    
    def __init__(self, valueJSON):
        self.measurement_id = valueJSON.get('measurement')
        self.sample_id = valueJSON.get('sample')
        self.value = valueJSON.get('value')
    
    def createTable():
        db.create_all()