from datetime import date
from typing import List
from itsdangerous import json

from src.models import db
from src.models import Flock as FlockORM
from src.models import Organization as OrganizationORM
from src.models import Sample as SampleORM
from src.schemas import Flock, Organization, Source, Sample

def get_flock_by_id(id: int) -> Flock:
    """
    The get_flock_by_id function accepts an integer id as input and returns a dictionary containing the flock's
    information.

    :param id:int: Used to specify the id of the flock that we want to retrieve.
    :return: A dictionary containing the flock formatted by pydantic.
    """
    flock = FlockORM.query.filter_by(id=id).first()
    return Flock.from_orm(flock).dict()


def get_flock_by_name(name: str) -> Flock:
    """
    The get_flock_by_name function accepts a string name as input and returns a dictionary containing the flock's
    information.

    :param name:str: Used to specify the name of the flock that we want to retrieve.
    :return: A dictionary containing the flock formatted by pydantic.
    """
    flock = FlockORM.query.filter_by(name=name).first()
    ret = None
    if (flock):
        ret = Flock.from_orm(flock).dict()
    return ret

def get_flocks_by_org(org_id: int) -> List[dict]:
    """
    The get_flocks_by_org function accepts an integer org_id as input and returns a list of dictionaries containing
    the flocks' information.

    :param org_id:int: Used to specify the id of the organization that we want to retrieve the flocks from.
    :return: A list of dictionaries containing the flocks formatted by pydantic.
    """
    org = OrganizationORM.query.filter_by(id=org_id).first()

    ret = []
    for flock in org.flocks:
        ret.append(Flock.from_orm(flock).dict())
    return json.dumps(ret, default=str)


def get_all_flocks() -> List[dict]:
    """
    The get_all_flocks function returns a list of dictionaries containing the flocks' information.

    :return: A list of dictionaries containing the flocks formatted by pydantic.
    """
    flocks = FlockORM.query.all()
    ret = []
    for flock in flocks:
        ret.append(Flock.from_orm(flock).dict())
    return json.dumps(ret, default=str)

def update_flock(flock_dict: dict):
    """
    The update_flock function accepts a dictionary containing the flock's information and updates an existing flock using
    the pydantic model to parse and the ORM model to store the information.

    :param flock_dict:dict: Used to specify the flock's information.
    :return: flock:Flock: the updated flock
    """

    flock:FlockORM = FlockORM.query.filter_by(name=flock_dict["name"]).first()

    flockSchema = Flock.parse_obj(flock_dict)
   
    for name, value in flockSchema:
        if name != "id":
            setattr(flock, name, value)
    
    db.session.commit()
    db.session.refresh(flock)
    
    return flock

def create_flock(flock_dict: dict):
    """
    The create_flock function accepts a dictionary containing the flock's information and creates a new flock using
    the pydantic model to parse and the ORM model to store the information.

    :param flock_dict:dict: Used to specify the flock's information.
    :return: flock:Flock: A Flock sqlalchemy model.
    """
    flock:FlockORM = FlockORM()
    for name, value in Flock.parse_obj(flock_dict):
        setattr(flock, name, value)
    
    db.session.add(flock)
    db.session.commit()
    db.session.refresh(flock)

    return flock
