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
    __tablename__ = 'User'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email: str = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    first_name: str = db.Column(db.String(120), nullable=False)
    last_name: str = db.Column(db.String(120), nullable=False)
    phone_number: str = db.Column(db.String(20))
    role: Roles = db.Column(db.Enum(Roles))
    notes: str = db.Column(db.String(500))

    # References to Foreign Objects
    organization_id = db.Column(db.Integer, db.ForeignKey('Organization.id'))

    # Foreign References to this Object
    sample = db.relationship('Sample',  backref='User')
    log = db.relationship('Log',  backref='User')


class OrganizationSource(db.Model):
    __tablename__ = 'OrganizationSource'
    organization_id: int = db.Column('organization_id', db.Integer, db.ForeignKey('Organization.id'), primary_key=True, nullable=False)
    source_id: int = db.Column('source_id', db.Integer, db.ForeignKey('Source.id'), primary_key=True, nullable=False)


class Organization(db.Model):
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
    __tablename__ = 'Flock'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(255), unique=True, nullable=False)
    strain: str = db.Column(db.String(120))
    species: Species = db.Column(db.Enum(Species), nullable=False)
    gender: BirdGenders = db.Column(db.Enum(BirdGenders), nullable=False)
    production_type: ProductionTypes = db.Column(db.Enum(ProductionTypes), nullable=False)
    birthday = db.Column(db.DateTime)
    timestamp_added: str = db.Column(db.DateTime, server_default=db.func.now())

    # References to Foreign Objects
    source_id = db.Column(db.Integer, db.ForeignKey('Source.id'))
    organization_id = db.Column(db.Integer, db.ForeignKey('Organization.id'))
    # source: Source = db.relationship('Source', secondary='OrganizationSourceFlockSample', innerjoin=True, uselist=False, viewonly=True)


class OrganizationSource_Flock_Sample(db.Model):
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
    validation_status: ValidationTypes = db.Column(db.Enum(ValidationTypes), server_default=ValidationTypes.Pending)
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
    __tablename__ = 'Measurement'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # References to Foreign Objects
    machine_id: int = db.Column(db.Integer, db.ForeignKey('Machine.id'), nullable=False)
    machine = db.relationship('Machine', back_populates='measurement', uselist=False)
    measurementtype_id: int = db.Column(db.Integer, db.ForeignKey('MeasurementType.id'), nullable=False)
    measurementtype = db.relationship('MeasurementType', back_populates='measurement', uselist=False)

    # Foreign References to this Object
    measurementValue = db.relationship('MeasurementValue', backref='Measurement')


class MeasurementValue(db.Model):
    __tablename__ = 'MeasurementValue'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    value: str = db.Column(db.String(120))
    timestamp_added: datetime = db.Column(db.DateTime)

    # References to Foreign Objects
    measurement_id: int = db.Column(db.Integer, db.ForeignKey('Measurement.id'), nullable=False)
    sample_id: int = db.Column(db.Integer, db.ForeignKey('Sample.id'), nullable=False)


class MeasurementType(db.Model):
    __tablename__ = 'MeasurementType'
    id: int = db.Column(db.Integer, unique=True, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120), nullable=False, unique=True)
    abbreviation: str = db.Column(db.String(120), nullable=False)
    units: str = db.Column(db.String(120), nullable=False)
    required: bool = db.Column(db.Boolean)
    general: bool = db.Column(db.Boolean)

    # Foreign References to this Object
    measurement = db.relationship('Measurement', backref='MeasurementType')


class Machine(db.Model):
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
    __tablename__ = 'MachineType'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120), unique=True, nullable=False)


class Log(db.Model):
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
    __tablename__ = 'Batch'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(120))

    # Foreign References to this Object
    sample = db.relationship('Sample', backref='Batch')


def createLog(current_user, action, logContent):
    log = Log(current_user.id, current_user.organization_id, current_user.role, action, logContent)
    db.session.add(log)
    db.session.commit()
