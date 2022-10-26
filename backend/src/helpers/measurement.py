from typing import List
from itsdangerous import json

from src.models import db
from src.models import Measurement as MeasurementORM
from src.models import MeasurementValue as MeasurementValueORM
from src.schemas import Sample, Measurement, MeasurementValue

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
