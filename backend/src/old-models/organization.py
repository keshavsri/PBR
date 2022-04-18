from dataclasses import dataclass
from server import db
from enums import States
from pydantic import BaseModel, validator, constr, conint
from typing import List, Optional


@dataclass
class OrganizationORM(db.Model):
    __tablename__ = 'organization'
    __table_args__ = {'extend_existing': True}

    from models.user import UserORM

    # The fields below are stored in the database, they are assigned both a python and a database type
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(120), unique=True)
    street_address: str = db.Column(db.String(120))
    city: str = db.Column(db.String(120))
    state: States = db.Column(db.Enum(States))
    zip: str = db.Column(db.String(10))
    notes: str = db.Column(db.String(500))
    organization_code: str = db.Column(db.String(6), unique=True)

    # References to Foureign Objects
    main_contact: UserORM = db.Column(db.Integer, db.ForeignKey('user.id'))

    # Foreign References to this Object
    user = db.relationship('user', backref='organization')
    machine = db.relationship('machine',  backref='organization')
    organization_source = db.relationship('organization-source', backref='organization')

    # TODO: sort this out
    #organizationCodeExpiry = db.Column(db.DateTime)

    # creates the table in the database
    def createTable():
        db.create_all()

# Pydantic defines models with typed fields.
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
    from models.source import Source
    id: int # For the DB representation we have additional fields
    sources: List[Source] = []
    class Config:
        orm_mode = True

# Example returning a user
def get_organization(id: int) -> Organization:
    # Get Organization from Database
    org = OrganizationORM.query.filter_by(id=id).first()
    return Organization(org)

def create_organization(organization: OrganizationCreate):
    # We use organization.dict() to get a dictionary from the object and
    # then the ** passes the dict as keywords args which is what SQLAlchemy expects.
    organization = OrganizationORM(**organization.dict())

    # then save to database as normal
    db.session.add(organization)

    # return created object
    db.session.commit()
    db.session.refresh(organization)
    return organization


def json_to_organization(json) -> OrganizationCreate:
    return OrganizationCreate(json)