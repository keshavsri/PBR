from datetime import date, datetime
from typing import List
from src.enums import ValidationTypes
from itsdangerous import json
from random import randint

from src.models import db
from src.models import Source as SourceORM
from src.schemas import source

def create_source(source_dict: dict):
    """
    The create_source function accepts a dictionary containing the source's information and creates a new source using
    the pydantic model to parse and the ORM model to store the information.

    :param source_dict:dict: Used to specify the source's information.
    :return: source:Source: A source sqlalchemy model.
    """
    source:SourceORM = SourceORM()
    for name, value in Source.parse_obj(source_dict):
        setattr(source, name, value)
    db.session.add(source)
    db.session.commit()
    db.session.refresh(source)
    return source
