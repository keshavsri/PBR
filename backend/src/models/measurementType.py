from dataclasses import dataclass
from glob import glob
from typing import List
from server import db

@dataclass
class MeasurementType(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(120), unique=True, nullable=False)
    units: str = db.Column(db.String(120), unique=True, nullable=False)