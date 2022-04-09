from typing import List

from itsdangerous import json

from src.Models import db
from src.Models import Flock as FlockORM
from src.Models import Organization as OrganizationORM
from src.Schemas import Flock, Organization

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
    for name, value in Organization.parse_obj(org_dict):
        setattr(org, name, value)
    db.session.add(org)
    db.session.commit()
    db.session.refresh(org)
    return org

def get_flock_by_id(id: int) -> Flock:
    flock = FlockORM.query.filter_by(id=id).first()
    print(flock)
    return Flock.from_orm(flock).dict()


def get_flock_by_org(org_id: int) -> List[dict]:
    flocks = FlockORM.query.filter_by(organization=org_id).all()
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
