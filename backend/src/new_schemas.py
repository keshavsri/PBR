class User(BaseModel):
    id: int
    email: constr(max_length=120)
    password: constr(max_length=120)
    first_name: constr(max_length=120)
    last_name: constr(max_length=120)
    phone_number: Optional[constr(max_length=120)]
    role: Roles
    notes: Optional[constr(max_length=500)]
    organization_id: int
    is_deleted: bool

    class Config:
        orm_mode = True


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
    code_last_updated: datetime
    is_deleted: bool

# This is the view of an item we want to return to a user
    id: Optional[int] # For the DB representation we have additional fields
    class Config:
        orm_mode = True


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
    organization_id: int
    class Config:
        orm_mode = True


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
    id: Optional[int]
    name: str
    strain: str
    species: Species
    production_type: ProductionTypes
    gender: BirdGenders
    source_id: int
    birthday: Optional[datetime]
    class Config:
        orm_mode = True


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
    comments: Optional[str]
    id: Optional[int]
    measurements: Optional[List[Measurement]]
    validation_status: Optional[ValidationTypes]
    sample_type: SampleTypes
    timestamp_added: Optional[datetime]

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
    user: User
    class Config:
        orm_mode = True
