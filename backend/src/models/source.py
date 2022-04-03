from server import db
from models.enums import States
from dataclasses import dataclass

from pydantic import BaseModel, validator, constr, conint
from typing import List, Optional
@dataclass
class SourceORM(db.Model):
    __tablename__ = 'source'
    __table_args__ = {'extend_existing': True}
    
    # The fields below are stored in the database, they are assigned both a python and a database type
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(120), unique=True)
    street_address: str = db.Column(db.String(120))
    city: str = db.Column(db.String(120))
    state: States = db.Column(db.String(20))
    zip: int = db.Column(db.Integer)
    
    # creates the table in the database
    def createTable():
        from models.organization import OrganizationORM
        organizations: list[OrganizationORM] = None
        db.create_all()

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

# Example returning a source
def get_source(id: int) -> Source:
    # Get Source from Database
    s = SourceORM.query.filter_by(id=id).first()
    return Source(s)
    
def create_source(source: SourceCreate):
    # We use source.dict() to get a dictionary from the object and
    # then the ** passes the dict as keywords args which is what SQLAlchemy expects.

    source = SourceORM(**source.dict());

    # then save to database as normal
    db.session.add(source);

    # return created object
    db.session.commit();
    db.session.refresh(source);
    return source;


def json_to_organization(json) -> SourceCreate:
    return SourceCreate(json)
