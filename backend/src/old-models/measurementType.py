from dataclasses import dataclass
from glob import glob
from typing import List
from models.measurement import MeasurementORM
from server import db

@dataclass
class MeasurementTypeORM(db.Model):
    __tablename__ = 'measurementtype'
    __table_args__ = {'extend_existing': True}


    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(120), unique=True, nullable=False)
    units: str = db.Column(db.String(120), unique=True, nullable=False)
    required: bool = db.Column(db.Boolean, nullable=False)

    # Foreign References to this Object 
    measurement = db.relationship('measurement', backref='measurementtype')
    
    def __init__(self, name:str, units:str, required:bool):
        self.name = name
        self.units = units
        self.required = required

    # creates the table in the database
    def createTable():
        MeasurementORM.createTable()
        db.create_all()