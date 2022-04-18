from dataclasses import dataclass
from models.measurement import MeasurementORM
from server import db

@dataclass
class MachineORM(db.Model):
    __tablename__ = 'machine'
    __table_args__ = {'extend_existing': True}

    id: int = db.Column(db.Integer, primary_key=True)
    serial_number: str = db.Column(db.String(120), nullable=False)
    
    # References to Foreign Objects
    machinetype_id: int = db.Column(db.Integer, db.ForeignKey('machinetype.id'))
    organization_id: int = db.Column(db.Integer, db.ForeignKey('organization.id'), nullable=False)

    # Foreign References to this Object 
    measurement = db.relationship('measurement', backref='machine')
    
    # creates the table in the database
    def createTable():
        MeasurementORM.createTable()
        db.create_all()
