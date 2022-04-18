from dataclasses import dataclass
from models.measurementValue import MeasurementValueORM
from server import db
from datetime import datetime
from models.enums import AgeUnits, ValidationTypes, SampleTypes, BirdGenders, Species
from pydantic import BaseModel, validator, constr
from typing import List, Optional
@dataclass
class SampleORM(db.Model):
    __tablename__ = 'sample'
    __table_args__ = {'extend_existing': True}


    id: int = db.Column(db.Integer, primary_key=True)
    timestamp_added: datetime = db.Column(db.DateTime)
    comments: str = db.Column(db.String(500))
    entered_by_id: int = db.Column(db.Integer, db.ForeignKey('user.id'))
    batch_id: int = db.Column(db.Integer, db.ForeignKey('batch.id'))
    organization_source_flock_sample_id: int = db.Column(db.Integer, db.ForeignKey('organization-source-flock-sample.id'))
    flock_age: int = db.Column(db.Integer)
    flock_age_unit: AgeUnits = db.Column(db.Enum(AgeUnits))
    validation_status: ValidationTypes = db.Column(db.Enum(ValidationTypes))
    sample_type: SampleTypes = db.Column(db.Enum(SampleTypes))

    # Foreign References to this Object
    measurementValue = db.relationship('measurementvalue', backref='sample')

    def createTable():
        MeasurementValueORM.createTable()
        db.create_all()

class SampleBase(BaseModel):
    ageNumber: int
    ageUnit: str
    flagged: bool
    comments: str

class SampleCreate(SampleBase):
    pass
class Sample(SampleBase):
    id: int
    class Config:
        orm_mode = True
