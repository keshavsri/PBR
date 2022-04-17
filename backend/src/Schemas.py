from datetime import datetime

from pydantic import BaseModel, constr
from src.enums import States, Species, ProductionTypes, BirdGenders, AgeUnits, ValidationTypes, SampleTypes, Roles, LogActions
from typing import List, Optional


# PYDANTIC MODELS



# ------------------------------
# Machinetype
# ------------------------------
class Machinetype(BaseModel):
    id: Optional[int]
    name: constr(max_length=120)
    class Config:
        orm_mode = True


# ------------------------------
# MeasurementType
# ------------------------------
class MeasurementType(BaseModel):
    id: Optional[int]
    name: constr(max_length=120)
    abbreviation: constr(max_length=120)
    units: constr(max_length=120)
    required: bool
    general: bool
    class Config:
        orm_mode = True


# ------------------------------
# Machine
# ------------------------------
class Machine(BaseModel):
    id: Optional[int]
    serial_number: constr(max_length=120)
    # References to Foreign Objects
    machinetype_id: int
    machinetype: Optional[Machinetype]
    organization_id: int
    measurements: "Optional[List[Measurement]]"
    class Config:
        orm_mode = True
# ------------------------------
# Measurement
# ------------------------------
class Measurement(BaseModel):
    id: Optional[int]
    machine_id: Optional[int]
    measurementtype_id: Optional[int]
    measurementtype: Optional[MeasurementType]
    class Config:
        orm_mode = True

# ------------------------------
# MeasurementValue
# ------------------------------
class MeasurementValue(BaseModel):
    id: Optional[int]
    measurement_id: int
    measurement: Optional[Measurement]
    sample_id: int
    value: float
    timestamp_added: Optional[datetime]
    class Config:
        orm_mode = True

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
# Sample
# ------------------------------

class Sample(BaseModel):
    flock_age: int
    flock_age_unit: AgeUnits
    flagged: bool
    comments: Optional[str]
    id: Optional[int]
    measurement_values: Optional[List[MeasurementValue]]
    timestamp_added: Optional[str]
    validation_status: Optional[ValidationTypes]
    sample_type: SampleTypes
    entered_by_id: Optional[int]
    timestamp_added: Optional[datetime]
    organization: Optional[Organization]
    measurement_values: Optional[List[MeasurementValue]]
    class Config:
        orm_mode = True

# ------------------------------
# Flock
# ------------------------------

class Flock(BaseModel):
    name: str
    strain: str
    species: Species
    production_type: ProductionTypes
    gender: BirdGenders
    id: Optional[int]
    organization_id: int
    source_id: int
    birthday: datetime
    timestamp_added: Optional[datetime]
    class Config:
        orm_mode = True

Machine.update_forward_refs()


# ------------------------------
# Logs
# ------------------------------
class Log(BaseModel):
    id: int
    role: Roles
    action: LogActions
    logContent: constr(max_length=500)
    logTime: datetime
    user_id: int
    organization_id: int
    class Config:
        orm_mode = True
