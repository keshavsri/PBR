from typing import List
from src.enums import ValidationTypes
from itsdangerous import json

from src.models import db
from src.models import User as UserORM
from src.models import Sample as SampleORM
from src.models import Measurement as MeasurementORM
from src.schemas import Flock, Organization, Source, Sample, Machine, Measurement, User

def create_sample(sample_dict: dict, current_user):
    """
    The create_sample function accepts a dictionary containing the sample's information and creates
    a new sample using the pydantic model to parse and the ORM model to store the information.

    :param sample_dict:dict: Used to specify the sample's information.
    :return: sample:Sample: A Sample sqlalchemy model.
    """
    sample:SampleORM = SampleORM()
    for name, value in Sample.parse_obj(sample_dict):
        if name != 'measurements':
            setattr(sample, name, value)
            
    setattr(sample, "user_id", current_user.id)
    setattr(sample, "validation_status", ValidationTypes.Saved)

    
    measurements = []
    for measurement in sample_dict["measurements"]:
        measurement_model:MeasurementORM = MeasurementORM()
        for name, value in Measurement.parse_obj(measurement):
            setattr(measurement_model, name, value)
        measurements.append(measurement_model)
    
    setattr(sample, "measurements", measurements)

    db.session.add(sample)
    db.session.commit()
    db.session.refresh(sample)

    return sample


