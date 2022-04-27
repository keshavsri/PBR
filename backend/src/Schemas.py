from datetime import datetime

from pydantic import BaseModel, constr
from src.enums import States, Species, ProductionTypes, BirdGenders, AgeUnits, ValidationTypes, SampleTypes, Roles, LogActions
from typing import List, Optional


# PYDANTIC MODELS



# ------------------------------
# Machinetype
# ------------------------------
class Machinetype(BaseModel):
    """
    Pydantic model for the Machinetype table set to orm_mode=True

    Attributes:
        id (int): The id of the machinetype, set as Optional to allow for creation of new machinetypes without an id
        name (str): The name of the machinetype
    """
    id: Optional[int]
    name: constr(max_length=120)
    class Config:
        orm_mode = True


# ------------------------------
# MeasurementType
# ------------------------------
class MeasurementType(BaseModel):
    """
    Pydantic model for the MeasurementType table set to orm_mode=True

    Attributes:
        id (int): The id of the measurementtype object, set as Optional to allow for creation of new measurementtypes without an id
        name (str): The name of the measurementtype
        abbreviation (str): The abbreviation of the measurementtype
        units (str): The unit of the measurementtype
        required (bool): Whether the measurementtype is required or not
        general (bool): ???
    """
    id: Optional[int]
    name: Optional[constr(max_length=120)]
    abbreviation: Optional[constr(max_length=120)]
    units: Optional[constr(max_length=120)]
    required: bool
    general: bool

    class Config:
        orm_mode = True


# ------------------------------
# Machine
# ------------------------------
class Machine(BaseModel):
    """
    Pydantic model for the Machine table set to orm_mode=True

    Attributes:
        id (int): The id of the machine object, set as Optional to allow for creation of new machines without an id
        serial_number (str): The serial number of the machine

        machinetype_id (int): The id of the machinetype of the machine
        machinetype (Machinetype): The machinetype of the machine, set as Optional to allow for creation of new machines without an enitre machinetype
        organization_id (int): The id of the organization of the machine
        measurements (List[Measurement]): The measurements of the machine, set as Optional to allow for creation of new machines without measurements
    """
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
    """
    Pydantic model for the Measurement table set to orm_mode=True

    Attributes:
        id (int): The id of the measurement object, set as Optional to allow for creation of new measurements without an id
        machine_id (int): The id of the machine of the measurement, set as Optional to allow for creation of new measurements without a machine
        measurement_type_id (int): The id of the measurementtype of the measurement, set as Optional to allow for creation of new measurements without a measurementtype
        measurement_type (MeasurementType): The measurementtype of the measurement, set as Optional to allow for creation of new measurements without an enitre measurementtype

        A machine attribute was omitted as it caused an infinitely recursive loop
    """
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
    """
    Pydantic model for the MeasurementValue table set to orm_mode=True

    Attributes:
        id (int): The id of the measurementvalue object, set as Optional to allow for creation of new measurementvalues without an id
        measurement_id (int): The id of the measurement of the measurementvalue, set as Optional to allow for creation of new measurementvalues without a measurement
        measurement (Measurement): The measurement of the measurementvalue, set as Optional to allow for creation of new measurementvalues without an enitre measurement
        sample_id (int): The id of the sample of the measurementvalue
        value (float): The value of the measurementvalue
        timestamp_added (datetime): The timestamp of when the measurementvalue was added, set as Optional as that is set by the database
    """
    id: Optional[int]
    measurement_id: int
    measurement: Optional[Measurement]
    sample_id: Optional[int]
    value: str
    timestamp_added: Optional[datetime]
    class Config:
        orm_mode = True

# ------------------------------
# Source
# ------------------------------

# Pydantic defines models with typed fields.
class Source(BaseModel):
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
    name: str
    strain: str
    species: Species
    production_type: ProductionTypes
    gender: BirdGenders
    id: Optional[int]
    organization_id: int
    source_id: int
    birthday: Optional[datetime]
    timestamp_added: Optional[datetime]
    class Config:
        orm_mode = True

Machine.update_forward_refs()

# ------------------------------
# Sample
# ------------------------------

class Sample(BaseModel):
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
    flock_age: int
    flock_age_unit: AgeUnits
    flock: Optional[Flock]
    flagged: bool
    comments: Optional[str]
    id: Optional[int]
    measurement_values: Optional[List[MeasurementValue]]
    validation_status: Optional[ValidationTypes]
    sample_type: SampleTypes
    entered_by_id: Optional[int]
    timestamp_added: Optional[datetime]
    organization: Optional[Organization]
    class Config:
        orm_mode = True

# ------------------------------
# Logs
# ------------------------------
class Log(BaseModel):
    """
    Pydantic model for the Log table set to orm_mode=True

    Attributes:
        id (int): The id of the log object
        role (Roles): The role of the user who made the log
        user_id (int): The id of the user who made the log
        action (LogActions): The action that was taken
        logContent (LogContent): The content of the log
        logTime (datetime): The timestamp of the log
        organization_id (int): The id of the organization the log is from

    Note:
        None of the attributes are set as Optional as they are all required for a log to be created and cannot be null
    """
    id: int
    role: Roles
    action: LogActions
    logContent: constr(max_length=500)
    logTime: datetime
    user_id: int
    organization_id: int
    class Config:
        orm_mode = True
