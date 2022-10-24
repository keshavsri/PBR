from typing import List
from itsdangerous import json

from src.models import db
from src.models import Measurement as MeasurementORM
from src.models import MeasurementValue as MeasurementValueORM
from src.schemas import Sample, Measurement, MeasurementValue

def get_measurements()-> List[dict]:
    """
    The get_measurements function returns a list of dictionaries containing the measurements' information.

    :return: A list of dictionaries containing the measurements formatted by pydantic.
    """
    measurements = MeasurementORM.query.filter_by().all()
    ret = []
    for measurement in measurements:
        ret.append(Measurement.from_orm(measurement).dict())
    return json.dumps(ret)

def get_measurement_by_id(id: int) -> dict:
    """
    The get_measurement_by_id function accepts an integer id as input and returns a dictionary containing the
    measurement's information.

    :param id:int: Used to specify the id of the measurement that we want to retrieve.
    :return: A dictionary containing the measurement formatted by pydantic.
    """
    measurement = MeasurementORM.query.filter_by(id=id).first()
    return Measurement.from_orm(measurement).dict()

def create_measurement(measurement_dict: dict):
    """
    The create_measurement function accepts a dictionary containing the measurement's information and creates
    a new measurement using the pydantic model to parse and the ORM model to store the information.

    :param measurement_dict:dict: Used to specify the measurement's information.
    :return: measurement:Measurement: A Measurement sqlalchemy model.
    """
    measurement:MeasurementORM = MeasurementORM()
    for name, value in Measurement.parse_obj(measurement_dict):
        setattr(measurement, name, value)
    db.session.add(measurement)
    db.session.commit()
    db.session.refresh(measurement)
    return measurement

    def create_measurement_value(measurement_value_dict: dict):
    """
    The create_measurement_value function accepts a dictionary containing the information of a measurement value and
    creates a new measurement value using pydantic to parse and ORM model to save it.

    :param measurement_value_dict:dict: Used to specify the dictionary containing the information of the measurement
    value that we want to create.
    :return: measurement_value:MeasurementValue: A measurement value sqlalchemy model.
    """
    print("Creating Measurement Values")
    measurement_value:MeasurementValueORM = MeasurementValueORM()
    print(f"MEAS VAL {measurement_value_dict}")
    for name, value in MeasurementValue.parse_obj(measurement_value_dict):
        setattr(measurement_value, name, value)
    db.session.add(measurement_value)
    db.session.commit()
    db.session.refresh(measurement_value)
    return measurement_value

def get_measurement_value_ORM_by_sample_id(sample_id: int) -> dict:
    """
    The get_measurement_value_ORM_by_sample_id function accepts an integer id as input and returns a list of
    dictionaries containing the measurement values' information.

    :param sample_id:int: Used to specify the id of the sample that we want to retrieve the measurement values from.
    :return: A list of dictionaries containing the measurement values formatted by pydantic.
    """
    measurement_values = MeasurementValueORM.query.filter_by(sample_id=sample_id).all()
    for value in measurement_values:
        value.measurement = MeasurementORM.query.filter_by(id=value.measurement_id).first()
    return measurement_values
