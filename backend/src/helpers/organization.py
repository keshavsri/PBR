from typing import List
from itsdangerous import json
from random import randint

from src.models import db
from src.models import Organization as OrganizationORM
from src.schemas import Organization

def get_organization_by_id(id: int):
    """
    The get_organization_by_id function accepts an integer id as input and returns a dictionary containing the
    organization's information.

    :param id:int: Used to specify the id of the organization that we want to retrieve.
    :return: A dictionary containing the organization formatted by pydantic.
    """
    org = OrganizationORM.query.filter_by(id=id).first()
    return Organization.from_orm(org).dict()

def get_all_organizations() -> List[dict]:
    """
    The get_all_organizations function returns a list of dictionaries containing all the organizations.

    :return: A list of dictionaries containing all the organizations formatted by pydantic.
    """
    organizations = OrganizationORM.query.all()
    ret = []
    for organization in organizations:
        ret.append(Organization.from_orm(organization).dict())
    return json.dumps(ret)


def create_organization(org_dict: dict):
    """
    The create_organization function accepts a dictionary containing the organization's information and creates a new
    organization using the pydantic model to parse and the ORM model to store the information.

    :param org_dict:dict: Used to specify the organization's information.
    :return: organization:Organization: An organization sqlalchemy model.
    """
    org:OrganizationORM = OrganizationORM()
    for name, value in Organization.parse_obj(org_dict):
        if name != 'notes' and name != 'sources':
            setattr(org, name, value)
        elif value is not None and name == 'notes':
            org.notes = value

    organizations = OrganizationORM.query.all()
    orgCodes = []
    for organization in organizations:
        orgCodes.append(Organization.from_orm(organization).dict().get("organization_code"))

    organization_code = randint(100000, 999999)
    while organization_code in orgCodes:
        organization_code = randint(100000, 999999)

    org.organization_code = organization_code

    db.session.add(org)
    db.session.commit()
    db.session.refresh(org)
    return org
