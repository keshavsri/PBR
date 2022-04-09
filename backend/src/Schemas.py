from pydantic import BaseModel, constr
from src.enums import States
from typing import List, Optional


# PYDANTIC MODELS

# ------------------------------
# Source
# ------------------------------

# Pydantic defines models with typed fields.
class Source(BaseModel):
    name: constr(max_length=120)
    street_address: constr(max_length=120)
    city: constr(max_length=120)
    state: States
    zip: constr(regex=r'^[0-9]{5}(?:-[0-9]{4})?$')
    id: Optional[int] = None
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

class Organization(BaseModel):
    name: constr(max_length=120)
    street_address: constr(max_length=120)
    city: constr(max_length=120)
    state: States
    zip: constr(regex=r'^[0-9]{5}(?:-[0-9]{4})?$')
    notes: Optional[constr(max_length=500)]
    organization_code: Optional[constr(regex=r'^[a-zA-Z0-9]{6}?$')]
# This is the view of an item we want to return to a user
    id: Optional[int] # For the DB representation we have additional fields
    sources: Optional[List[Source]]
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
    organization_id: int
    source_id: int

    class Config:
        orm_mode = True

# ------------------------------
# ?
# ------------------------------
