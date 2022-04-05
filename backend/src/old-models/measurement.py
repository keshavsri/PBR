from dataclasses import dataclass
from models.measurementValue import MeasurementValueORM
from server import db



@dataclass
class MeasurementORM(db.Model):
    __tablename__ = 'measurement'
    __table_args__ = {'extend_existing': True}

    id: int = db.Column(db.Integer, primary_key=True)

    # References to Foreign Objects
    machine_id: int = db.Column(db.Integer, db.ForeignKey('machine.id'), nullable=False)
    measurementtype_id: int = db.Column(db.Integer, db.ForeignKey('measurementtype.id'), nullable=False)

    # Foreign References to this Object 
    measurementValue = db.relationship('measurementvalue', backref='measurement')

    def createTable():
        MeasurementValueORM.createTable()
        db.create_all()
    




    