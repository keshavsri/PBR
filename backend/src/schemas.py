from pydantic import BaseModel, constr
from typing import Any, Optional, List
from src.enums import Roles, States, AgeUnits, ValidationTypes, SampleTypes, LogActions, Species, BirdGenders, ProductionTypes, AgeGroup, HealthyRangeMethod
from datetime import datetime
from src.models import *


class PydanticModel(BaseModel):
    class Config:
        orm_mode = True
        arbitrary_types_allowed = True


class User(PydanticModel):
    id: int
    email: constr(max_length=120)
    # password: constr(max_length=120)
    first_name: constr(max_length=120)
    last_name: constr(max_length=120)
    phone_number: Optional[constr(max_length=120)]
    role: Roles
    notes: Optional[constr(max_length=500)]
    organization_id: int
    is_deleted: bool


class Organization(PydanticModel):
    """
    Pydantic model for the Organization table set to orm_mode=True

    Attributes:
        id (int): The id of the organization object, set as Optional to allow for creation of new organizations without an id
        name (str): The name of the organization
        street_address (str): The street address of the organization
        city (str): The city of the organization
        state (States): The state of the organization
        zip (str): The zip code of the organization
        notes (str): The notes on the organization
        organization_code (str): NOT IMPLEMENTED The organization code of the organization, set as Optional to allow for creation of new organizations without an organization code

        sources (List[Source]): The sources of the organization, set as Optional to allow for creation of new organizations without sources
    """
    id: Optional[int]
    name: constr(max_length=120)
    street_address: constr(max_length=120)
    city: constr(max_length=120)
    state: States
    zip: constr(regex=r'^[0-9]{5}(?:-[0-9]{4})?$')
    notes: Optional[constr(max_length=500)]
    organization_code: Optional[constr(regex=r'^[a-zA-Z0-9]{6}?$')]
    code_last_updated: Optional[datetime]
    is_deleted: bool

# Pydantic defines models with typed fields.


class Source(PydanticModel):
    """
    Pydantic model for the Source table set to orm_mode=True

    Attributes:
        id (int): The id of the source object, set as Optional to allow for creation of new sources without an id
        name (str): The name of the source
        street_address (str): The street address of the source
        city (str): The city of the source
        state (States): The state of the source
        zip (str): The zip code of the source
    """
    id: Optional[int]
    name: constr(max_length=120)
    street_address: constr(max_length=120)
    city: constr(max_length=120)
    state: States
    zip: constr(regex=r'^[0-9]{5}(?:-[0-9]{4})?$')
    organization_id: int


class Flock(PydanticModel):
    """
    Pydantic model for the Flock table set to orm_mode=True

    Attributes:
        id (int): The id of the flock object, set as Optional to allow for creation of new flocks without an id
        name (str): The name of the flock
        strain (str): The strain of the flock
        species (Species): The species of the flock
        gender (BirdGenders): The gender of the flock
        production_type (ProductionType): The type of use the flock is for
        organization_id (int): The id of the organization the flock is from
        source_id (int): The id of the source the flock is from
        source (Source): The source of the flock, set as Optional to allow for creation of new flocks without a source
        birthdate (str): The birthdate of the flock
        timestamp_added (datetime): The timestamp the flock was added, set as Optional to allow for creation of new flocks without a timestamp as it is set by the DB
    """
    id: Optional[int]
    name: str
    strain: str
    species: Species
    production_type: ProductionTypes
    gender: BirdGenders
    source_id: int
    birthday: Optional[datetime]


class Sample(PydanticModel):
    """
    Pydantic model for the Sample table set to orm_mode=True

    Attributes:
        id (int): The id of the sample object, set as Optional to allow for creation of new samples without an id
        flock_age (int): The age of the flock at the time of the sample
        flock_age_unit (AgeUnits): The unit of the flock age
        flock (Flock): The flock the sample is from, set as Optional to allow for creation of new samples without a flock
        flagged (bool): Whether the sample is flagged for review or not
        comments (str): The comments on the sample, set as Optional to allow for creation of new samples without comments
        measurement_values (List[MeasurementValue]): The values of the measurements of the sample, set as Optional to allow for creation of new samples without measurements
        timestamp_added (datetime): The timestamp the sample was added, set as Optional to allow for creation of new samples without a timestamp as it is set by the DB
        validation_status (ValidationStatus): The status of the sample, set as Optional to allow for creation of new samples without a validation status
        sample_type (SampleTypes): The type of the sample, set as Optional to allow for creation of new samples without a sample type
        entered_by_id (int): The id of the user who entered the sample, set as Optional to allow for creation of new samples without an entered by id as it is set by the helper function
        organization (Organization): The organization the sample is from, set as Optional to allow for creation of new samples without an organization

    """
    id: Optional[int]
    flock_age: Optional[int]
    flock_age_unit: Optional[AgeUnits]
    flock: Optional[Flock]
    comments: Optional[str]
    measurements: Optional[List[Measurement]]
    validation_status: Optional[ValidationTypes]
    sample_type: Optional[SampleTypes]
    timestamp_added: Optional[datetime]


class Batch(PydanticModel):
    id: Optional[int]
    name: str


class Measurement(PydanticModel):
    id: Optional[int]
    value: Optional[float]
    sample_id: int
    analyte: Analyte


class Analyte(PydanticModel):
    id: Optional[int]
    name: Optional[str]
    abbreviation: str
    units: Optional[str]
    machine_type_id: int


class Machine(PydanticModel):
    id: Optional[int]
    serial_number: str
    machine_type_id: int
    organization_id: int


class MachineType(PydanticModel):
    id: Optional[int]
    name: str


class Cartridge(PydanticModel):
    id: Optional[int]
    rotor_lot_number: str
    cartridge_type_id: int
    organization_id: int


class CartridgeType(PydanticModel):
    id: Optional[int]
    name: str
    machine_type_id: int
    analytes: Optional[List[Analyte]]


class HealthyRange(PydanticModel):
    id: Optional[int]
    lower_bound: float
    upper_bound: float
    species: Species
    gender: Optional[BirdGenders]
    age_group: AgeGroup
    method: HealthyRangeMethod
    generated: datetime
    current: bool
    analyte: Analyte


class Log(PydanticModel):
    id: Optional[int]
    role: Roles
    action: LogActions
    logContent: constr(max_length=500)
    logTime: datetime
    user_id: int
    user: User
