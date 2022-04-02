from dataclasses import dataclass
from models.measurementValue import MeasurementValue
from server import db
from datetime import datetime

from models.user import User

from models.organization import OrganizationORM
from models.source import SourceORM
from models.flock import FlockORM

from models.batch import BatchORM
from models.machine import Machine
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

    entered_by: User = db.relationship('User')
    # entered_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    # Put these 3 into its own join table like in the Database Design Doc?
    organization: OrganizationORM = db.relationship('Organization')
    source: SourceORM = db.relationship('Source')
    flock: FlockORM = db.relationship('Flock')
    # organization-source_flock_sample_id: int = db.relationship('organization-source_flock_sample')
    # organization-source_flock_sample_id: int = db.Column(db.Integer, db.ForeignKey('organization-source_flock_sample.id'))

    flock_age: int = db.Column(db.Integer)
    flock_age_unit: AgeUnits = db.Column(db.Enum(AgeUnits))
    validation_status: ValidationTypes = db.Column(db.Enum(ValidationTypes))
    sample_type: SampleTypes = db.Column(db.Enum(SampleTypes))
    
    measurement_values: List[MeasurementValue] = None
    batch: BatchORM = db.relationship("Batch")

    def createTable():
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