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
    entered_by_user: User = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    data_entry_timestamp: datetime = db.Column(db.DateTime, default=datetime.now, nullable=False)
    flock: Flock = db.Column(db.Integer, db.ForeignKey(Flock.id), nullable=False)
    flock_age: int = db.Column(db.Integer, nullable=False)
    flock_age_units_used: AgeUnits = db.Column(db.Enum(AgeUnits), nullable=False)
    species: Species = db.Column(db.Integer, db.ForeignKey(Flock.id), nullable=False)
    source: Source = db.Column(db.Integer, db.ForeignKey(Source.id), nullable=False)
    organization: Organization = db.Column(db.Integer, db.ForeignKey(Flock.id), nullable=False)
    validation_status: ValidationTypes = db.Column(db.Enum(ValidationTypes), nullable=False)
    flock_gender: BirdGenders = db.Column(db.Enum(BirdGenders), nullable=False)
    sample_type: SampleTypes = db.Column(db.Enum(SampleTypes), nullable=False)
    strain: str = db.Column(db.String(120), nullable=False)
    machines: list[Machine] = None
    comments: str = db.Column(db.String(500))


def createTable():
        db.create_all()