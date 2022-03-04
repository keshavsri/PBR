from dataclasses import dataclass
from glob import glob
from typing import List
from server import db
from datetime import datetime

from models.user import User
from models.flock import Flock
from models.source import Source
from models.organization import Organization
from models.enums import AgeUnits, ValidationTypes, SampleTypes, BirdGenders, Species

@dataclass
class Sample(db.Model):
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
    comments: str = db.Column(db.String(500))

    ## VetScan VS2 ##
    date_of_VS2: datetime.date
    time_of_VS2: datetime.time

    ast: float
    ba: float
    ck: float
    ua: float
    glucose: float
    total_ca: float
    phos: float
    tp: float
    alb: float
    glob: float
    potassium: float
    sodium: float
    qc: float
    hem: float
    lip: float
    ict: float

    ## i-Stat Data ##
    date_of_iStat: datetime.date
    time_of_iStat: datetime.time

    ph: float
    pco2: float
    po2: float
    be: float
    hco3: float
    tco2: float
    so2: float
    na: float
    k: float
    ica: float
    glu: float
    hct: float
    hb: float
    istat_num: float