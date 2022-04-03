from dataclasses import dataclass
from server import db

from models.enums import Species, BirdGenders, ProductionTypes
from pydantic import BaseModel, validator, constr
from typing import List, Optional
@dataclass
class FlockORM(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(255),unique=True, nullable=False)
    from models.organization import OrganizationORM
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'))
    organization: OrganizationORM = db.relationship('Organization')
    strain: str = db.Column(db.String(120))
    species: Species = db.Column(db.Enum(Species), nullable=False)
    production_type: ProductionTypes = db.Column(db.Enum(ProductionTypes), nullable=False)
    from models.source import SourceORM
    source_id = db.Column(db.Integer, db.ForeignKey('source.id'), nullable=False)
    source: SourceORM = db.relationship('Source')
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
    from models.source import Source
    from models.organization import OrganizationORM
    id: int
    organization: OrganizationORM
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
    