from typing import List

from itsdangerous import json

from src.Models import db
from src.Models import Flock as FlockORM
from src.Models import Organization as OrganizationORM
from src.Models import Source as SourceORM
from src.Schemas import Flock, Organization, Source

def get_organization_by_id(id: int):
    org = OrganizationORM.query.filter_by(id=id).first()
    return Organization.from_orm(org).dict()

def get_all_organizations() -> List[dict]:
    organizations = OrganizationORM.query.all()
    ret = []
    for organization in organizations:
        ret.append(Organization.from_orm(organization).dict())
    return json.dumps(ret)

def create_organization(org_dict: dict):
    org:OrganizationORM = OrganizationORM()
    print(Organization.parse_obj(org_dict))
    for name, value in Organization.parse_obj(org_dict):
        if name != 'notes' and name != 'sources':
            setattr(org, name, value)
        elif value is not None and name == 'notes':
            org.notes = value
    db.session.add(org)
    db.session.commit()
    db.session.refresh(org)
    return org

def create_source(source_dict: dict):
    source:SourceORM = SourceORM()
    for name, value in Source.parse_obj(source_dict):
        setattr(source, name, value)
    db.session.add(source)
    db.session.commit()
    db.session.refresh(source)
    return source

def get_flock_by_id(id: int) -> Flock:
    flock = FlockORM.query.filter_by(id=id).first()
    print(flock)
    return Flock.from_orm(flock).dict()


def get_flock_by_org(org_id: int) -> List[dict]:
    flocks = FlockORM.query.filter_by(organization_id=org_id).all()
    ret = []
    for flock in flocks:
        ret.append(Flock.from_orm(flock).dict())
    return json.dumps(ret)


def get_all_flocks() -> List[dict]:
    flocks = FlockORM.query.all()
    ret = []
    for flock in flocks:
        ret.append(Flock.from_orm(flock).dict())
    return json.dumps(ret)


def create_flock(flock_dict: dict):
    flock:FlockORM = FlockORM()
    for name, value in Flock.parse_obj(flock_dict):
        setattr(flock, name, value)
    db.session.add(flock)
    db.session.commit()
    db.session.refresh(flock)
    return flock
