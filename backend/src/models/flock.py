from dataclasses import dataclass
from server import db

from models.organization import Organization
from models.source import Source
from models.enums import Species, BirdGenders, ProductionTypes
from pydantic import BaseModel, validator, constr
from typing import List, Optional
@dataclass
class FlockORM(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(255),unique=True, nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey(Organization.id))
    organization: Organization = db.relationship('Organization')
    strain: str = db.Column(db.String(120))
    species: Species = db.Column(db.Enum(Species), nullable=False)
    production_type: ProductionTypes = db.Column(db.Enum(ProductionTypes), nullable=False)
    source_id = db.Column(db.Integer, db.ForeignKey(Source.id), nullable=False)
    source: Source = db.relationship('Source')
    gender: BirdGenders = db.Column(db.Enum(BirdGenders), nullable=False)
    birthday = db.column(db.DateTime)

    def createTable():
        db.create_all()

class FlockBase(BaseModel):
    name: int
    strain: int
    species: str
    production_type: bool
    gender: str

class FlockCreate(FlockBase):
    organization_id: int
    source_id: int

class Flock(FlockBase):
    id: int
    organization: Organization
    source: Source

    class Config:
        orm_mode = True

def get_flock(id: int) -> Flock:
    flock = FlockORM.query.filter_by(id=id).first()
    return Flock(flock)

def create_flock(flock: FlockCreate):
    flock = FlockORM(**flock.dict())
    db.session.add(flock)
    db.session.commit()
    db.session.refresh(flock)
    return flock

def json_to_flock(json) -> FlockCreate:
    return Flock(json)
    