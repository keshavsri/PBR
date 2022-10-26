from typing import List
from src.enums import ValidationTypes
from itsdangerous import json

from src.models import db
from src.models import User as UserORM
from src.models import Sample as SampleORM
from src.models import Measurement as MeasurementORM
from src.schemas import Flock, Organization, Source, Sample, Machine, Measurement, User

def create_sample(sample_dict: dict):
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
            
    setattr(sample, "user_id", 1)
    setattr(sample, "validation_status", ValidationTypes.Saved)
    
    db.session.add(sample)
    db.session.commit()
    db.session.refresh(sample)
    
    measurements = []
    for measurement in sample_dict["measurements"]:
        measurement["sample_id"] = sample.id

        measurement:MeasurementORM = MeasurementORM()
        for name, value in Measurement.parse_obj(measurement):
            setattr(measurement, name, value)
        db.session.add(measurement)
        db.session.commit()
        db.session.refresh(measurement)

        measurements.append(create_measurement(measurement))
    
    setattr(sample, "measurements", measurements)

    return sample


def get_samples_by_org(org_id: int, user_id: int) -> List[dict]:
    """
    The get_samples_by_org function accepts an integer id as input and returns a list of dictionaries containing
    the samples' information.

    :param org_id:int: Used to specify the id of the organization that we want to retrieve the samples from.
    :return: A list of dictionaries containing the samples formatted by pydantic.
    """
    samples = get_sample_organization_joined(db.session)
    
    machines = json.loads(get_machines_by_org(org_id))
    ret = {
        "rows": [],
        "types": []
    }

    for machine in machines:
        machJson = {
            "machineName": machine["name"],
            "machineId": machine["id"],
            "data": []
        }
        for info in machine["info"]:
            machJson["data"].append({"type":info})
        for meas in machine["measurements"]:   
            machJson["data"].append({"type":meas})
        ret["types"].append(machJson)
    for sample in samples:
        print("---------------------------------")
        print(sample.entered_by_id, flush=True)
        if not sample.deleted:
            if sample.entered_by_id == user_id:
                sample.measurement_values = get_measurement_value_ORM_by_sample_id(
                    sample.id)
                sample.timestamp_added = str(sample.timestamp_added)
                ret["rows"].append(Sample.from_orm(sample).dict())
            else:
                if sample.validation_status != ValidationTypes.Saved:
                    sample.measurement_values = get_measurement_value_ORM_by_sample_id(
                        sample.id)
                    sample.timestamp_added = str(sample.timestamp_added)
                    ret["rows"].append(Sample.from_orm(sample).dict())
            
    return json.dumps(ret, default=str)

def get_sample_by_id(id: int) -> dict:
    """
    The get_sample_by_id function accepts an integer id as input and returns a dictionary containing the sample's
    information.

    :param id:int: Used to specify the id of the sample that we want to retrieve.
    :return: A dictionary containing the sample formatted by pydantic.
    """
    sample = SampleORM.query.filter_by(id=id).first()
    if not sample.deleted:
        sample.measurement_values = get_measurement_value_ORM_by_sample_id(sample.id)
        return Sample.from_orm(sample).dict()
    else:
        return None

def get_samples_by_user(user_id: int) -> List[dict]:
    """
    The get_sample_by_user function accepts an integer id as input and returns a list of dictionaries containing
    the samples' information.

    :param user_id:int: Used to specify the id of the user that we want to retrieve the samples from.
    :return: A list of dictionaries containing the samples formatted by pydantic.
    """

    samples = get_sample_organization_joined(db.session).filter_by(entered_by_id=user_id).all()
    user = UserORM.query.filter_by(id=user_id).first()
    machines = json.loads(get_machines_by_org(user.organization_id))
    ret = {
        "rows": [],
        "types": []
    }

    for machine in machines:
        machJson = {
            "machineName": machine["name"],
            "machineId": machine["id"],
            "data": []
        }
        for info in machine["info"]:
            machJson["data"].append({"type":info})
        for meas in machine["measurements"]:   
            machJson["data"].append({"type":meas})
        ret["types"].append(machJson)
    for sample in samples:
        if not sample.deleted:
            sample.measurement_values = get_measurement_value_ORM_by_sample_id(sample.id)
            sample.timestamp_added = str(sample.timestamp_added)
            ret["rows"].append(Sample.from_orm(sample).dict())
    
    return json.dumps(ret, default=str)


def get_all_samples(user_id: int) -> List[dict]:
    """
    The get_all_samples function returns a list of dictionaries containing all the samples.

    :return: A list of dictionaries containing the samples formatted by pydantic.
    """
    samples = get_sample_organization_joined(db.session).all()
    machines = json.loads(get_machines())
    ret = {
        "rows": [],
        "types": []
    }

    for machine in machines:
        machJson = {
            "machineName": machine["name"],
            "machineId": machine["id"],
            "data": []
        }
        for info in machine["info"]:
            machJson["data"].append({"type":info})
        for meas in machine["measurements"]:   
            machJson["data"].append({"type":meas})
        ret["types"].append(machJson)
    for sample in samples:
        if not sample.deleted:
            if sample.entered_by_id == user_id:
                sample.measurement_values = get_measurement_value_ORM_by_sample_id(
                    sample.id)
                sample.timestamp_added = str(sample.timestamp_added)
                ret["rows"].append(Sample.from_orm(sample).dict())
            else:
                if sample.validation_status != ValidationTypes.Saved:
                    sample.measurement_values = get_measurement_value_ORM_by_sample_id(
                        sample.id)
                    sample.timestamp_added = str(sample.timestamp_added)
                    ret["rows"].append(Sample.from_orm(sample).dict())
    return json.dumps(ret, default=str)
