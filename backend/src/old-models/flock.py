from dataclasses import dataclass
from server import db

from models.enums import Species, BirdGenders, ProductionTypes
from pydantic import BaseModel, validator, constr
from typing import List, Optional
@dataclass
class FlockORM(db.Model):
    __tablename__ = 'flock'
    __table_args__ = {'extend_existing': True}

    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(255),unique=True, nullable=False)
    strain: str = db.Column(db.String(120))
    species: Species = db.Column(db.Enum(Species), nullable=False)
    gender: BirdGenders = db.Column(db.Enum(BirdGenders), nullable=False)
    production_type: ProductionTypes = db.Column(db.Enum(ProductionTypes), nullable=False)
    birthday = db.column(db.DateTime)

    # References to Foreign Objects
    source = db.Column(db.Integer, db.ForeignKey('source.id'))

    # Foreign References to this Object
    organization_source_flock_sample = db.relationship('organization-source-flock-sample', backref='flock')

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
    from models.source import Source
    from models.organization import Organization
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
    