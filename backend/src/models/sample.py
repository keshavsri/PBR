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
    machines: List[Machine] = None
    measurements: List[MeasurementValue] = None
    batch: BatchORM = db.relationship("Batch")

    def __init__(self, requestJSON):
        self.flock_id = requestJSON.get('flock')
        self.flock_age = requestJSON.get('flock_age')
        self.flock_age_units_used = requestJSON.get('flock_age_units_used')
        self.species = requestJSON.get('species')
        self.source_id = requestJSON.get('source')
        self.organization_id = requestJSON.get('organization')
        self.validation_status = requestJSON.get('validation_status')
        self.flock_gender = requestJSON.get('flock_gender')
        self.sample_type = requestJSON.get('sample_type')
        self.comments = requestJSON.get('comments')
    
    def createTable(self):
        sample_machine = db.Table('sample-machine', db.metadata, db.Column('sample_id', db.Integer, db.ForeignKey('sample.id')), db.Column('machine_id', db.Integer, db.ForeignKey('machine.id')), extend_existing=True)
        self.machines = db.relationship('Machine', secondary=sample_machine, backref='samples')
        sample_measurement_value = db.Table('sample-measurement-value', db.metadata, db.Column('sample_id', db.Integer, db.ForeignKey('sample.id')), db.Column('measurement_value_id', db.Integer, db.ForeignKey('measurement_value.id')), extend_existing=True)
        self.measurements = db.relationship('MeasurementValue', secondary=sample_measurement_value, backref='samples')
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
