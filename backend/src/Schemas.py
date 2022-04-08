from itsdangerous import json
from pydantic import BaseModel, validator, constr, conint
from src.enums import States
from typing import List, Optional
from src.Models import db
from src.Models import Flock as FlockORM

# PYDANTIC MODELS

# ------------------------------
# Source
# ------------------------------

# Pydantic defines models with typed fields.
class SourceBase(BaseModel):
    name: constr(max_length=120)
    street_address: constr(max_length=120)
    city: constr(max_length=120)
    state: States
    zip: constr(regex=r'^[0-9]{5}(?:-[0-9]{4})?$')

# We create specialized models for different tasks/views
# These are the fields needed for creating an item.
class SourceCreate(SourceBase):
    pass # No need for extra fields when creating

# This is the view of an item we want to return to a user
class Source(SourceBase):
    id: int # For the DB representation we have additional fields
    class Config:
        orm_mode = True

# ------------------------------
# Sample
# ------------------------------

class SampleBase(BaseModel):
    ageNumber: int
    ageUnit: str
    flagged: bool
    comments: str

class SampleCreate(SampleBase):
    pass

class Sample(SampleBase):
    id: int
    class Config:
        orm_mode = True

# ------------------------------
# Organization
# ------------------------------

class OrganizationBase(BaseModel):
    name: constr(max_length=120)
    street_address: constr(max_length=120)
    city: constr(max_length=120)
    state: States
    zip: constr(regex=r'^[0-9]{5}(?:-[0-9]{4})?$')
    notes: constr(max_length=500)
    organization_code: Optional[constr(regex=r'^[a-zA-Z0-9]{6}?$')]

# We create specialized models for different tasks/views
# These are the fields needed for creating an item.
class OrganizationCreate(OrganizationBase):
    pass # No need for extra fields when creating

# This is the view of an item we want to return to a user
class Organization(OrganizationBase):
    id: int # For the DB representation we have additional fields
    sources: List[Source] = []
    class Config:
        orm_mode = True

# ------------------------------
# Flock
# ------------------------------

class Flock(BaseModel):
    name: str
    strain: str
    species: str
    production_type: str
    gender: str
    id: Optional[int]
    organization: int
    source: int

    class Config:
        orm_mode = True
    
    
def get_flock(id: int) -> Flock:
    flock = FlockORM.query.filter_by(id=id).first()
    print(flock)
    return Flock.from_orm(flock)

def get_flock_by_org(org_id: int) -> List[Flock]:
    flocks = FlockORM.query.filter_by(organization=org_id).all()
    ret = []
    for flock in flocks:
        ret.append(Flock.from_orm(flock))
    return ret.__dict__

def get_all_flocks() -> List[Flock]:
    flocks = FlockORM.query.all()
    ret = []
    for flock in flocks:
        ret.append(Flock(flock))
    return ret.__dict__

def create_flock(flock_dict: dict):
    flock:FlockORM = FlockORM()
    for name, value in Flock.parse_obj(flock_dict):
        setattr(flock, name, value)
    db.session.add(flock)
    db.session.commit()
    db.session.refresh(flock)
    return flock
# ------------------------------
# ?
# ------------------------------