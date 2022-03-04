from dataclasses import dataclass
from server import db

from models.organization import Organization
from models.source import Source
from models.enums import Species, BirdGenders

class Flock(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    associated_organization: Organization = db.Column(db.Integer, db.ForeignKey('organization.id'))
    strain: str = db.Column(db.String(120))
    species: Species = db.Column(db.Enum(Species), nullable=False)
    gender: BirdGenders = db.Column(db.Enum(BirdGenders), nullable=False)
    source: Source = db.Column(db.Integer, db.ForeignKey(Source.id), nullable=False)
    
