from email.policy import default
from src.enums import Roles, States, AgeUnits, ValidationTypes, SampleTypes, LogActions, Species, BirdGenders, ProductionTypes
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from typing import List, Optional
from sqlalchemy.orm import (
    joinedload
)
from sqlalchemy import (
    ForeignKeyConstraint,
    UniqueConstraint
)

# SQLALCHEMY MODELS
db = SQLAlchemy()


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

    __tablename__ = 'User'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email: str = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    first_name: str = db.Column(db.String(120), nullable=False)
    last_name: str = db.Column(db.String(120), nullable=False)
    phone_number: str = db.Column(db.String(20))
    role: Roles = db.Column(db.Enum(Roles))
    notes: str = db.Column(db.String(500))
    is_deleted: bool = db.Column(db.Boolean, server_default="0")

    # References to Foreign Objects
    organization_id = db.Column(db.Integer, db.ForeignKey('Organization.id'))

    # Foreign References to this Object
    sample = db.relationship('Sample',  backref='User')
    log = db.relationship('Log',  backref='User')


class OrganizationSource(db.Model):
    """ ORM model for the OrganizationSource tabl

    This table is the jointable between the Organization and Source table.

    Attributes:
        organization_id: id of the organization the source belongs to
        source_id: id of the source
    """
    __tablename__ = 'OrganizationSource'
    organization_id: int = db.Column('organization_id', db.Integer, db.ForeignKey('Organization.id'), primary_key=True, nullable=False)
    source_id: int = db.Column('source_id', db.Integer, db.ForeignKey('Source.id'), primary_key=True, nullable=False)


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
        sources: list of sources used by the organization

        organization_code: NOT IMPLEMENTED yet But will be used to generate a unique organization code which is used to register a user to an organization on account creation


        user: foreign reference to user
        machine: foreign reference to machine
        log: foreign reference to log

    """
    __tablename__ = 'Organization'
    # The fields below are stored in the database, they are assigned both a python and a database type
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120), unique=True)
    street_address: str = db.Column(db.String(120))
    city: str = db.Column(db.String(120))
    state: States = db.Column(db.Enum(States))
    zip: str = db.Column(db.String(10))
    notes: str = db.Column(db.String(500))
    organization_code: str = db.Column(db.String(6), unique=True)

    # Foreign References to this Object
    user = db.relationship('User')
    machine = db.relationship('Machine',  backref='Organization')
    log = db.relationship('Log', backref='Organization')
    sources: List['Source'] = db.relationship('Source', secondary='OrganizationSource', back_populates='organizations', uselist=True)
    flocks: List['Flock'] = db.relationship('Flock', secondary='OrganizationSourceFlockSample')

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

        organizations: list of organizations using the source
    """
    __tablename__ = 'Source'
    # The fields below are stored in the database, they are assigned both a python and a database type
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120), unique=True)
    street_address: str = db.Column(db.String(120))
    city: str = db.Column(db.String(120))
    state: States = db.Column(db.Enum(States))
    zip: int = db.Column(db.Integer)

    # Foreign References to this Object
    # flock = db.relationship('Flock', backref='Source')
    organizations: List[Organization] = db.relationship('Organization', secondary='OrganizationSource', back_populates='sources', uselist=True)


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
        timestamp_added: The timestamp of flock creation
    """

    __tablename__ = 'Flock'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(255), unique=True, nullable=False)
    strain: str = db.Column(db.String(120))
    species: Species = db.Column(db.Enum(Species), nullable=False)
    gender: BirdGenders = db.Column(db.Enum(BirdGenders), nullable=False)
    production_type: ProductionTypes = db.Column(db.Enum(ProductionTypes), nullable=False)
    birthday = db.Column(db.DateTime, nullable=True)
    timestamp_added: str = db.Column(db.DateTime, server_default=db.func.now())

    # References to Foreign Objects
    source_id = db.Column(db.Integer, db.ForeignKey('Source.id'))
    organization_id = db.Column(db.Integer, db.ForeignKey('Organization.id'))
    # source: Source = db.relationship('Source', secondary='OrganizationSourceFlockSample', innerjoin=True, uselist=False, viewonly=True)


class OrganizationSource_Flock_Sample(db.Model):

    """ ORM model for the OrganizationSource_Flock_Sample table

    This table acts as a join table for the OrganizationSource, Flock, and Sample tables.

    Attributes:
        id: unique identifier
        organization_id: id of the organization
        source_id: id of the source
        flock_id: id of the flock
    """
    __tablename__ = 'OrganizationSourceFlockSample'
    id: int = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    organization_id: int = db.Column('organization_id', db.Integer, db.ForeignKey('Organization.id'), nullable=False)
    source_id: int = db.Column('source_id', db.Integer, db.ForeignKey('Source.id'), nullable=False)
    flock_id: int = db.Column('flock_id', db.Integer, db.ForeignKey('Flock.id'), nullable=False)
    __table_args__ = (
        # Composite foreign key requires this to be an entry in AB
        ForeignKeyConstraint(
            columns=[organization_id, source_id],
            refcolumns=[OrganizationSource.organization_id, OrganizationSource.source_id]),
        # Could makes this the primary key instead, but that would add
        # three fields to D. This could be costly if D is a large table.
        UniqueConstraint(
            organization_id, source_id, flock_id
        ),
        UniqueConstraint(
            source_id, flock_id
        )
    )
    organization: Organization = db.relationship(Organization, innerjoin=True, uselist=False, backref='organizationsourceflocksample')
    source: Source = db.relationship(Source, innerjoin=True, uselist=False)
    flock: Flock = db.relationship(Flock, innerjoin=True, uselist=False)


class Sample(db.Model):

    """ ORM model for the Sample table

    This table contains the bloodwork samples for a flock of birds.

    Attributes:
        id: unique identifier for the sample
        timestamp_added: timestamp of the sample
        comments: comments for the sample
        entered_by_id: user who entered the sample
        batch_id: NOT IMPLEMENTED batch the sample belongs to
        flock_age: age of the flock the sample belongs to
        flock_age_unit: unit of the flock age
        flagged: boolean value for if the sample is flagged for review
        deleted: boolean value for if the sample is deleted
        validation_status: validation status of the sample
        sample_type: type of the sample

        measurement_values: list of measurement values for the sample

        organizationsource_flock_sample_id: join table for the sample and organization, with it's sample and flock

    """

    __tablename__ = 'Sample'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    timestamp_added: str = db.Column(db.DateTime, server_default=db.func.now())
    comments: str = db.Column(db.String(500))
    entered_by_id: int = db.Column(db.Integer, db.ForeignKey('User.id'))
    batch_id: int = db.Column(db.Integer, db.ForeignKey('Batch.id'))
    flock_age: int = db.Column(db.Integer)
    flock_age_unit: AgeUnits = db.Column(db.Enum(AgeUnits))
    flagged: bool = db.Column(db.Boolean)
    deleted: bool = db.Column(db.Boolean, server_default="0")
    validation_status: ValidationTypes = db.Column(db.Enum(ValidationTypes))
    sample_type: SampleTypes = db.Column(db.Enum(SampleTypes))

    measurement_values: List['MeasurementValue'] = db.relationship('MeasurementValue', backref='Sample')

    # Foreign References to this Object
    organizationsource_flock_sample_id: int = db.Column(db.Integer, db.ForeignKey(OrganizationSource_Flock_Sample.id), nullable=False)
    organizationsource_flock_sample: OrganizationSource_Flock_Sample = db.relationship('OrganizationSource_Flock_Sample', innerjoin=True)
    organization: Organization = db.relationship('Organization', secondary='OrganizationSourceFlockSample', innerjoin=True, uselist=False, viewonly=True)
    source: Source = db.relationship('Source', secondary='OrganizationSourceFlockSample', innerjoin=True, uselist=False, viewonly=True)
    flock: Flock = db.relationship('Flock', secondary='OrganizationSourceFlockSample', innerjoin=True, uselist=False, viewonly=True)


def get_sample_joined(session):
    return session.query(Sample).options(
        # Include only joins that you need to access
        # This reduces any duplicate joins SQLAlchemy
        # might attempt to add and the innerjoin=True
        # prevents it from making these LEFT OUTER JOIN.
        joinedload(Sample.organizationsource_flock_sample).joinedload(OrganizationSource_Flock_Sample.organization),
        joinedload(Sample.organizationsource_flock_sample).joinedload(OrganizationSource_Flock_Sample.source),
        joinedload(Sample.organizationsource_flock_sample).joinedload(OrganizationSource_Flock_Sample.flock)
    )


def get_sample_organization_joined(session):
    return session.query(Sample).options(
        # Include only joins that you need to access
        # This reduces any duplicate joins SQLAlchemy
        # might attempt to add and the innerjoin=True
        # prevents it from making these LEFT OUTER JOIN.
        joinedload(Sample.organization)
    )

def get_flock_organization_joined(session):
    return session.query(Organization).options(
        # Include only joins that you need to access
        # This reduces any duplicate joins SQLAlchemy
        # might attempt to add and the innerjoin=True
        # prevents it from making these LEFT OUTER JOIN.
        joinedload(Sample.organization)
    )

class Measurement(db.Model):
    """ This table acts almost like a join table between the machine and the measurement type.

        Attributes:
            id: Primary Key
            machine_id: Foreign Key to Machine
            measurement_type_id: Foreign Key to Measurement Type
            machine: Machine object
            measurement_type: Measurement Type object

            measurement_value: foreign reference to MeasurementValue
    """
    __tablename__ = 'Measurement'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # References to Foreign Objects
    machine_id: int = db.Column(db.Integer, db.ForeignKey('Machine.id'), nullable=False)
    machine = db.relationship('Machine', back_populates='measurement', uselist=False)
    measurementtype_id: int = db.Column(db.Integer, db.ForeignKey('MeasurementType.id'), nullable=False)
    measurementtype = db.relationship('MeasurementType', back_populates='measurement', uselist=False)

    # Foreign References to this Object
    measurement_value = db.relationship('MeasurementValue', backref='Measurement')


class MeasurementValue(db.Model):
    """ This table stores the actual measurement value.

        Attributes:
            id: Primary Key
            value: The value of the measurement
            timestamp_added: The time the measurement was added to the database

            measurement_id: Foreign Key to Measurement
            sample_id: Foreign Key to Sample
    """
    __tablename__ = 'MeasurementValue'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    value: str = db.Column(db.String(120))
    timestamp_added: datetime = db.Column(db.DateTime)

    # References to Foreign Objects
    measurement_id: int = db.Column(db.Integer, db.ForeignKey('Measurement.id'), nullable=False)
    sample_id: int = db.Column(db.Integer, db.ForeignKey('Sample.id'), nullable=False)


class MeasurementType(db.Model):
    """ This table stores the measurement types.

    These hold the additional information about the measurement which is shared between all measurements of the same type.

        Attributes:
            id: Primary Key
            name: The name of the measurement type
            abbreviation: The abbreviation of the measurement type
            unit: The unit of the measurement type
            required: Whether or not the measurement type is required
            general: Whether the measurement is a general setting of the machine or a bloodwork-related measurement

            measurement: foreign reference to Measurement
    """
    __tablename__ = 'MeasurementType'
    id: int = db.Column(db.Integer, unique=True, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120), unique=True)
    abbreviation: str = db.Column(db.String(120))
    units: str = db.Column(db.String(120))
    required: bool = db.Column(db.Boolean, default=0, nullable=False)
    general: bool = db.Column(db.Boolean, default=0, nullable=False)

    # Foreign References to this Object
    measurement = db.relationship('Measurement', backref='MeasurementType')


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
    __tablename__ = 'Machine'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    serial_number: str = db.Column(db.String(120), unique=True,nullable=False)

    # References to Foreign Objects
    machinetype_id: int = db.Column(db.Integer, db.ForeignKey('MachineType.id'), nullable=False)
    machinetype = db.relationship('MachineType', backref='machine', uselist=False)
    organization_id: int = db.Column(db.Integer, db.ForeignKey('Organization.id'), nullable=False)
    measurements: List[Measurement] = db.relationship('Measurement', back_populates='machine')

    # Foreign References to this Object
    measurement = db.relationship('Measurement', backref='Machine')


class MachineType(db.Model):
    """ This table stores the machine types.

    It pretty much just stores the names of the machine types.

        Attributes:
            id: Primary Key
            name: The name of the machine type
    """
    __tablename__ = 'MachineType'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120), unique=True, nullable=False)


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
    __tablename__ = 'Log'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user = db.relationship('User')
    role: Roles = db.Column(db.Enum(Roles))
    action: LogActions = db.Column(db.Enum(LogActions))
    logContent: str = db.Column(db.String(500))
    logTime: str = db.Column(db.DateTime, server_default=db.func.now())

    # References to Foreign Objects
    user_id = db.Column(db.Integer, db.ForeignKey('User.id'))
    organization_id = db.Column(db.Integer, db.ForeignKey('Organization.id'))

    def __init__(self, user, organization, role, action, logContent):
        self.user_id = user
        self.organization_id = organization
        self.role = role
        self.action = action
        self.logContent = logContent


class Batch(db.Model):
    """ This table stores the batches.
    NOT IMPLEMENTED

        Attributes:
            id: Primary Key
            name: The name of the batch

            sample: Foreign reference to the samples in this batch
    """
    __tablename__ = 'Batch'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120))

    # Foreign References to this Object
    sample = db.relationship('Sample', backref='Batch')


def createLog(current_user, action, logContent):
    """ This function creates a log entry.

    It takes the current user, the action that was performed, and the content of the action.

    Args:
        current_user: The user who did the action
        action: The action that was performed
        logContent: A more readable version of the action with an ID or name of the affected object
    """
    log = Log(current_user.id, current_user.organization_id, current_user.role, action, logContent)
    db.session.add(log)
    db.session.commit()
