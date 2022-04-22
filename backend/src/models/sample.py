from dataclasses import dataclass
from server import db
from datetime import datetime
from typing import List

from models.user import User
from models.flock import Flock
from models.source import Source
from models.machine import Machine
from models.organization import Organization
from models.enums import AgeUnits, ValidationTypes, SampleTypes, BirdGenders, Species

@dataclass
class Sample(db.Model):
    __tablename__ = 'sample'
    __table_args__ = {'extend_existing': True}

    id: int = db.Column(db.Integer, primary_key=True)
    entered_by_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    entered_by_user: User = db.relationship('User')
    data_entry_timestamp: datetime = db.Column(db.DateTime, default=datetime.now)
    flock_id: int = db.Column(db.Integer, db.ForeignKey('flock.id'))
    flock: Flock = db.relationship('Flock')
    flock_age: int = db.Column(db.Integer)
    flock_age_units_used: AgeUnits = db.Column(db.Enum(AgeUnits))
    species: Species = db.Column(db.Enum(Species))
    source_id = db.Column(db.Integer, db.ForeignKey(Source.id))
    source: Source = db.relationship('Source')
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'))
    organization: Organization = db.relationship('Organization')
    validation_status: ValidationTypes = db.Column(db.Enum(ValidationTypes))
    flock_gender: BirdGenders = db.Column(db.Enum(BirdGenders))
    sample_type: SampleTypes = db.Column(db.Enum(SampleTypes))
    strain: str = db.Column(db.String(120))
    machines: List[Machine] = None
    comments: str = db.Column(db.String(500))
    
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
        self.strain = requestJSON.get('strain')
        self.comments = requestJSON.get('comments')
def createTable():
        db.create_all()