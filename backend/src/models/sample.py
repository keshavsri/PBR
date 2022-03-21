from dataclasses import dataclass
from server import db
from datetime import datetime

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
    entered_by_user: User = db.Column(db.Integer, db.ForeignKey(User.id))
    data_entry_timestamp: datetime = db.Column(db.DateTime, default=datetime.now)
    flock: Flock = db.Column(db.Integer, db.ForeignKey(Flock.id))
    flock_age: int = db.Column(db.Integer)
    flock_age_units_used: AgeUnits = db.Column(db.Enum(AgeUnits))
    species: Species = db.Column(db.Integer, db.ForeignKey(Flock.id))
    source: Source = db.Column(db.Integer, db.ForeignKey(Source.id))
    organization: Organization = db.Column(db.Integer, db.ForeignKey(Flock.id))
    validation_status: ValidationTypes = db.Column(db.Enum(ValidationTypes))
    flock_gender: BirdGenders = db.Column(db.Enum(BirdGenders))
    sample_type: SampleTypes = db.Column(db.Enum(SampleTypes))
    strain: str = db.Column(db.String(120))
    machines: list[Machine] = None
    comments: str = db.Column(db.String(500))
    
    def __init__(self, requestJSON):
        flock = requestJSON.get('flock')


def createTable():
        db.create_all()