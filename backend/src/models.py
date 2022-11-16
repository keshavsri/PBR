from email.policy import default
from src.enums import Roles, States, AgeUnits, ValidationTypes, SampleTypes, LogActions, Species, BirdGenders, ProductionTypes, AgeGroup
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from typing import List, Optional
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import create_engine
import os

# SQLALCHEMY MODELS
db = SQLAlchemy()
engine = create_engine(os.environ.get("DATABASE_URL"))


class User(db.Model):

    """ ORM model for the User table
    This table contains all the information about the users of the application.
    Attributes:
        id:int unique identifier for the user.
        email: email address for the user
        password: password for the user
        role: role enum of the user
        notes: notes for the user
        organization_id: id of the organization the user belongs to
        sample: foreign reference to the samples the user is assigned to
        log: foreign reference to the logs the user is assigned to
    """

    __tablename__ = 'user_table'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email: str = db.Column(db.String(120), index=True,
                           unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    first_name: str = db.Column(db.String(120), nullable=False)
    last_name: str = db.Column(db.String(120), nullable=False)
    phone_number: str = db.Column(db.String(20))
    role: Roles = db.Column(db.Enum(Roles))
    notes: str = db.Column(db.String(500))
    is_deleted: bool = db.Column(db.Boolean, server_default="0")

    # References to Foreign Objects
    organization_id = db.Column(
        db.Integer, db.ForeignKey('organization_table.id'))


class Organization(db.Model):

    """ ORM model for the Organization table
    This table contains all the infromation about the organizations of the application.
    Attributes:
        id: unique identifier for the organization
        name: name of the organization
        street: street address of the organization
        city: city of the organization
        state: state enum of the organization
        zip: zip code of the organization
        notes: notes for the organization
        code_last_updated: dataetime that the organization_code was last updated
        organization_code: NOT IMPLEMENTED yet But will be used to generate a unique organization code which is used to register a user to an organization on account creation
        is_deleted: If the organization is deleted
        users: foreign reference to users
        machines: foreign reference to machines
        logs: foreign reference to logs
        sources: foreign reference to sources
        flocks: foreign reference to flocks
    """
    __tablename__ = 'organization_table'
    # The fields below are stored in the database, they are assigned both a python and a database type
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120), unique=True)
    street_address: str = db.Column(db.String(120))
    city: str = db.Column(db.String(120))
    state: States = db.Column(db.Enum(States))
    zip: str = db.Column(db.String(10))
    notes: str = db.Column(db.String(500))
    organization_code: str = db.Column(db.String(6), unique=True)
    code_last_updated: datetime = db.Column(db.DateTime)
    is_deleted: bool = db.Column(db.Boolean, server_default="0")

    # Foreign References to this Object
#     users = db.relationship('User')
#     machines = db.relationship('Machine')
#     logs = association_proxy('user_table', 'log_table')
#     sources: List['Source'] = db.relationship('Source')
#     flocks: List['Flock'] = association_proxy('source_table', 'flock_table')


class Source(db.Model):
    """ ORM model for the Source table
    This table contains the sources from which the flock data is collected.
    Attributes:
        id: unique identifier for the source
        name: name of the source
        street_address: street address of the source
        city: city of the source
        state: state enum of the source
        zip: zip code of the source
        is_deleted: whether the source has been deleted
        organization_id: organization that uses the source
    """
    __tablename__ = 'source_table'

    # The fields below are stored in the database, they are assigned both a python and a database type
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120))
    street_address: str = db.Column(db.String(120))
    city: str = db.Column(db.String(120))
    state: States = db.Column(db.Enum(States))
    zip: int = db.Column(db.Integer)
    is_deleted: bool = db.Column(db.Boolean, server_default="0")

    # References to Foreign Objects
    organization_id: int = db.Column(
        db.Integer,  db.ForeignKey('organization_table.id'))


class Flock(db.Model):

    """ ORM model for the Flock table
    This table contains the flocks from which the samples are collected.
    Attributes:
        id: unique identifier for the flock
        name: name of the flock
        strain: strain of the flock
        species: species of the flock
        gender: gender of the flock
        production_type: The type of flock it is.
        birthday: The birthdate calculated from the user input
        source_id: The source that the flock belongs to
        is_deleted: boolean value for if the flock is deleted
    """

    __tablename__ = 'flock_table'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(255), unique=True)
    strain: str = db.Column(db.String(120))
    species: Species = db.Column(db.Enum(Species))
    gender: BirdGenders = db.Column(db.Enum(BirdGenders))
    production_type: ProductionTypes = db.Column(db.Enum(ProductionTypes))
    birthday = db.Column(db.DateTime, nullable=True)
    is_deleted: bool = db.Column(db.Boolean, server_default="0")

    # References to Foreign Objects
    source_id = db.Column(db.Integer, db.ForeignKey('source_table.id'))


class Sample(db.Model):

    """ ORM model for the Sample table
    This table contains the bloodwork samples for a flock of birds.
    Attributes:
        id: unique identifier for the sample
        timestamp_added: timestamp of the sample
        comments: comments for the sample
        user_id: user who entered the sample
        batch_id: NOT IMPLEMENTED batch the sample belongs to
        flock_age: age of the flock the sample belongs to
        flock_age_unit: unit of the flock age
        flagged: boolean value for if the sample is flagged for review
        is_deleted: boolean value for if the sample is deleted
        validation_status: validation status of the sample
        sample_type: type of the sample
        rotor_lot_number: Rotor lot number of the cartridge used for this sample
        flock_id: Flock that the sample is testing
        machine_id: Machine that the sample is collected from
        cartridge_type_id: Cartridge Type that is used for the sample
        measurements: list of measurement values for the sample
    """

    __tablename__ = 'sample_table'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    timestamp_added: str = db.Column(db.DateTime, server_default=db.func.now())
    comments: str = db.Column(db.String(500), nullable=True)

    flock_age: int = db.Column(db.Integer, nullable=True)
    flock_age_unit: AgeUnits = db.Column(db.Enum(AgeUnits), nullable=True)
    is_deleted: bool = db.Column(db.Boolean, server_default="0")
    validation_status: ValidationTypes = db.Column(db.Enum(ValidationTypes))
    sample_type: SampleTypes = db.Column(db.Enum(SampleTypes), nullable=True)
    rotor_lot_number: str = db.Column(db.String(120), nullable=True)

    # References to Foreign Objects
    user_id: int = db.Column(db.Integer, db.ForeignKey('user_table.id'))
    batch_id: int = db.Column(db.Integer, db.ForeignKey(
        'batch_table.id'), nullable=True)
    flock_id: int = db.Column(db.Integer, db.ForeignKey(
        'flock_table.id'), nullable=True)
    cartridge_type_id: int = db.Column(db.Integer, db.ForeignKey(
        'cartridge_type_table.id'), nullable=True)
    machine_id: int = db.Column(db.Integer, db.ForeignKey(
        'machine_table.id'), nullable=True)

    # Foreign References to this Object
    measurements: List['Measurement'] = db.relationship('Measurement')
    flock = db.relationship('Flock')


class Batch(db.Model):
    """ This table stores the batches.
    NOT IMPLEMENTED
        Attributes:
            id: Primary Key
            name: The name of the batch
            sample: Foreign reference to the samples in this batch
    """
    __tablename__ = 'batch_table'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120))


class Measurement(db.Model):
    """
      id: id of the measurement
      value: value of the measurement
      analyte_id: Analyte that the measurement is testing for
      sample_id: Sample that the measurement is a part of
    """
    __tablename__ = 'measurement_table'

    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    value: float = db.Column(db.Float, nullable=True)

    # References to Foreign Objects
    analyte_id: int = db.Column(db.Integer, db.ForeignKey('analyte_table.id'))
    sample_id: int = db.Column(db.Integer, db.ForeignKey('sample_table.id'))

    # Foreign References to this Object
    analyte = db.relationship('Analyte')


"""
    Join table for CartridgeType and Analyte.
    Analytes belong to a MachineType, however multiple CartridgeTypes can have the same analyte.
    This join table allows for Sample entry by CartridgeType and calculating HealthyRanges by MachineType.
"""
cartridge_types_analytes_table = db.Table(
    'cartridge_types_analytes_table',
    db.Model.metadata,
    db.Column('cartridge_type_id', db.ForeignKey('cartridge_type_table.id')),
    db.Column('analyte_id', db.ForeignKey('analyte_table.id'))
)


class Analyte(db.Model):

    """
      id: id of the Analyte
      name: name of the Analyte
      abbreviation: abbreviation of the Analyte
      units: units of the Analyte
      machine_type_id: MachineType associated with analyte. Needed for HealthyRange calculation
    """

    __tablename__ = 'analyte_table'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120))
    abbreviation: str = db.Column(db.String(20))
    units: str = db.Column(db.String(12))

    # References to Foreign Objects
    machine_type_id: int = db.Column(
        db.Integer, db.ForeignKey('machine_type_table.id'))


class Machine(db.Model):
    """ This table stores the machines.
    These hold the additional information about the machine which is shared between all measurements of the same machine.
        Attributes:
            id: Primary Key
            serial_number: The serial number of the machine
            machine_type_id: Foreign Key to MachineType
            machine_type: foreign reference to MachineType
            organization_id: Foreign Key to Organization
            measurements: list of Measurements from this machine
            measurement: foreign reference to this object
    """
    __tablename__ = 'machine_table'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    serial_number: str = db.Column(db.String(120), unique=True)
    is_deleted: bool = db.Column(db.Boolean, server_default="0")

    # References to Foreign Objects
    machine_type_id: int = db.Column(
        db.Integer, db.ForeignKey('machine_type_table.id'))
    organization_id: int = db.Column(
        db.Integer, db.ForeignKey('organization_table.id'))

    # Foreign References to this Object
    machine_type = db.relationship('MachineType')


class MachineType(db.Model):
    """ This table stores the machine types.
    It pretty much just stores the names of the machine types.
        Attributes:
            id: Primary Key
            name: The name of the machine type
    """
    __tablename__ = 'machine_type_table'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120), unique=True, nullable=False)


class CartridgeType(db.Model):
    __tablename__ = 'cartridge_type_table'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120))

    # References to Foreign Objects
    machine_type_id: int = db.Column(
        db.Integer, db.ForeignKey('machine_type_table.id'))

    # Foreign References to this Object
    analytes: List['Analyte'] = db.relationship(
        'Analyte', secondary=cartridge_types_analytes_table)


class HealthyRange(db.Model):
    """
    This table represents a Healthy Range object for a specific analyte
    Attributes:
                id: Primary Key
                lower_bound: Lower Bound of the healthy range
                upper_bound: Upper Bound of the healthy range
                species: Species we are constructing the healthy range for
                gender: Gender we are constructing the healthy range for
                age_group: Age Group we are constructing the healthy range for
                analyte_id: Analyte we are constructing the healthy range for
                cartridge_type_id: Cartridge Type used in measuring the analytes in this healthyh range object
    """
    __tablename__ = 'healthy_range_table'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lower_bound: float = db.Column(db.Float)
    upper_bound: float = db.Column(db.Float)
    species: Species = db.Column(db.Enum(Species))
    gender: BirdGenders = db.Column(db.Enum(BirdGenders))
    age_group: AgeGroup = db.Column(db.Enum(AgeGroup))

    # References to Foreign Objects
    analyte_id: int = db.Column(db.Integer, db.ForeignKey('analyte_table.id'))

    # Foreign References to this Object
    analyte = db.relationship('Analyte')


class Log(db.Model):
    """ This table stores the logs.
    The logs store the user who did the action, their role, the enum for the action, the content is a more readable
    version of the action with an ID or name of the affected object.
        Attributes:
            id: Primary Key
            user: The user who did the action
            role: The role of the user
            action: The action that was performed
            content: A more readable version of the action with an ID or name of the affected object
            log_time: The time the action was performed
            user_id: Foreign Key to User
            organization_id: Foreign Key to Organization
    """
    __tablename__ = 'log_table'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role: Roles = db.Column(db.Enum(Roles))
    action: LogActions = db.Column(db.Enum(LogActions))
    logContent: str = db.Column(db.String(500))
    logTime: str = db.Column(db.DateTime, server_default=db.func.now())

    # References to Foreign Objects
    user_id = db.Column(db.Integer, db.ForeignKey('user_table.id'))
    organization_id = db.Column(
        db.Integer, db.ForeignKey('organization_table.id'))

    # Foreign References to this Object
    user = db.relationship('User')

    def __init__(self, user, organization, role, action, logContent):
        self.user_id = user
        self.organization_id = organization
        self.role = role
        self.action = action
        self.logContent = logContent
