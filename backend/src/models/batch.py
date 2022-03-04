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
    name: str = db.Column(db.String(120), nullable=False)