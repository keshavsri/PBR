from typing import List
from itsdangerous import json

from src.models import db
from src.models import MeasurementType as MeasurementTypeORM
from src.schemas import Sample, MeasurementType

def get_measurement_types() -> List[dict]:
    """
    The get_measurement_types function returns a list of dictionaries containing the measurement types' information.

    :return: A list of dictionaries containing the measurement types formatted by pydantic.
    """
    measurement_types = MeasurementTypeORM.query.filter_by().all()
    ret = []
    for type in measurement_types:
        ret.append(MeasurementType.from_orm(type).dict())
    return json.dumps(ret)

def get_measurement_type_by_id(id: int) -> dict:
    """
    The get_measurement_type_by_id function accepts an integer id as input and returns a dictionary containing the
    measurement type's information.

    :param id:int: Used to specify the id of the measurement type that we want to retrieve.
    :return: A dictionary containing the measurement type formatted by pydantic.
    """
    measurement_type = MeasurementTypeORM.query.filter_by(id=id).first()
    return MeasurementType.from_orm(measurement_type).dict()

def create_measurement_type(measurement_type_dict: dict):
    """
    The create_measurement_type function accepts a dictionary containing the measurement type's information and creates
    a new measurement type using the pydantic model to parse and the ORM model to store the information.

    :param measurement_type_dict:dict: Used to specify the measurement type's information.
    :return: measurement_type:MeasurementType: A MeasurementType sqlalchemy model.
    """
    measurement_type:MeasurementTypeORM = MeasurementTypeORM()
    for name, value in MeasurementType.parse_obj(measurement_type_dict):
        setattr(measurement_type, name, value)
    db.session.add(measurement_type)
    db.session.commit()
    db.session.refresh(measurement_type)
    return measurement_type
