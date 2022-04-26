from datetime import date, datetime
from typing import List
from itsdangerous import json

from src.Models import db
from src.Models import Flock as FlockORM
from src.Models import Organization as OrganizationORM
from src.Models import Source as SourceORM
from src.Models import Sample as SampleORM
from src.Models import Machine as MachineORM
from src.Models import MachineType as MachineTypeORM
from src.Models import Measurement as MeasurementORM
from src.Models import get_sample_organization_joined
from src.Models import OrganizationSource as OrganizationSourceORM
from src.Models import OrganizationSource_Flock_Sample as OrganizationSource_Flock_SampleORM
from src.Models import MeasurementType as MeasurementTypeORM
from src.Models import MeasurementValue as MeasurementValueORM
from src.Models import Log as LogORM
from src.Schemas import Flock, Organization, Source, Sample, Machine, Machinetype, Measurement, MeasurementType, MeasurementValue, Log

def get_machines_by_org(org_id: int) -> List[dict]:
    """
    The get_machines_by_org function returns a list of all machines in an organization.

    :param org_id:int: Used to Filter the machines by organization.
    :return: A list of dictionaries.

    :doc-author: Trelent
    """
    machines = MachineORM.query.filter_by(organization_id=org_id).all()
    ret = []
    for machine in machines:
        ret.append(Machine.from_orm(machine).dict())
    return json.dumps(ret)

def get_machines() -> List[dict]:
    machines = MachineORM.query.filter_by().all()
    ret = []
    for machine in machines:
        ret.append(Machine.from_orm(machine).dict())
    return json.dumps(ret)

def get_machine_by_id(id: int) -> dict:
    """
    The get_machine_by_id function accepts an integer id as input and returns a dictionary containing the machine's
    information. If no machine is found with that id, it returns None.

    :param id:int: Used to Specify the id of the machine that we want to retrieve.
    :return: A dictionary with the following keys:.

    :doc-author: Trelent
    """
    machine = MachineORM.query.filter_by(id=id).first()
    return Machine.from_orm(machine).dict()

def create_machine(machine_dict: dict):

    """
    The create_machine function accepts a dictionary containing the machine's information and creates a new machine
    using the pydantic model to parse and the ORM model to store the information.

    :param machine_dict:dict: Used to specify the machine's information.
    :return: machine:Machine: A machine sqlalchemy model.
    """

    machine:MachineORM = MachineORM()
    for name, value in Machine.parse_obj(machine_dict):
        if name != 'measurements':
            setattr(machine, name, value)
    machine.machinetype = MachineTypeORM.query.filter_by(id=machine_dict['machinetype_id']).first()
    db.session.add(machine)
    db.session.commit()
    db.session.refresh(machine)
    return machine

def get_machine_types() -> List[dict]:
    """
    The get_machine_types function returns a list of dictionaries containing all the machine types.

    :return: A list of dictionaries containing all the machine types formatted by pydantic.
    """
    machinetypes = MachineTypeORM.query.filter_by().all()
    ret = []
    for type in machinetypes:
        ret.append(Machinetype.from_orm(type).dict())
    return json.dumps(ret)

def get_machine_type_by_id(id: int) -> dict:
    """
    The get_machine_type_by_id function accepts an integer id as input and returns a dictionary containing the machine
    type's information.

    :param id:int: Used to specify the id of the machine type that we want to retrieve.
    :return: A dictionary containing the machine type formatted by pydantic.
    """
    machinetype = MachineTypeORM.query.filter_by(id=id).first()
    return Machinetype.from_orm(machinetype).dict()

def create_machine_type(machinetype_dict: dict):
    """
    The create_machine_type function accepts a dictionary containing the machine type's information and creates a new
    machine type using the pydantic model to parse and the ORM model to store the information.

    :param machinetype_dict:dict: Used to specify the machine type's information.
    :return: machinetype:MachineType: A machine type sqlalchemy model.
    """
    machinetype:MachineTypeORM = MachineTypeORM()
    for name, value in Machinetype.parse_obj(machinetype_dict):
        setattr(machinetype, name, value)
    db.session.add(machinetype)
    db.session.commit()
    db.session.refresh(machinetype)
    return machinetype

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
    print(organizations)
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

def get_flock_by_id(id: int) -> Flock:
    """
    The get_flock_by_id function accepts an integer id as input and returns a dictionary containing the flock's
    information.

    :param id:int: Used to specify the id of the flock that we want to retrieve.
    :return: A dictionary containing the flock formatted by pydantic.
    """
    flock = FlockORM.query.filter_by(id=id).first()
    print(flock)
    return Flock.from_orm(flock).dict()

# def get_osf_from_org(org_id: int) -> Flock:
#     osf = OrganizationSource_Flock_SampleORM.query.filter_by(organization_id=org_id).first()
#     print(osf)
#     sources = []
#     for source in osf.
#     retJson = {
#         "organization": Organization.from_orm(osf.organization),
#         "source":
#     }
#     return Flock.from_orm(flock).dict()

def get_flock_by_name(name: str) -> Flock:
    """
    The get_flock_by_name function accepts a string name as input and returns a dictionary containing the flock's
    information.

    :param name:str: Used to specify the name of the flock that we want to retrieve.
    :return: A dictionary containing the flock formatted by pydantic.
    """
    flock = FlockORM.query.filter_by(name=name).first()
    print(flock)
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
    print(org.flocks)

    ret = []
    for flock in org.flocks:
        print(flock)
        print(flock.source_id)
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


def create_sample(sample_dict: dict):
    """
    The create_sample function accepts a dictionary containing the sample's information and creates
    a new sample using the pydantic model to parse and the ORM model to store the information.

    :param sample_dict:dict: Used to specify the sample's information.
    :return: sample:Sample: A Sample sqlalchemy model.
    """
    sample:SampleORM = SampleORM()
    for name, value in Sample.parse_obj(sample_dict):
        if name != 'measurement_values':
            setattr(sample, name, value)
        else:
            values = []
            for measurement_value_dict in value:
                values.append(create_measurement_value(measurement_value_dict))
            setattr(sample, name, values)
    db.session.add(sample)
    db.session.commit()
    db.session.refresh(sample)
    return sample


def get_samples_by_org(org_id: int) -> List[dict]:
    """
    The get_samples_by_org function accepts an integer id as input and returns a list of dictionaries containing
    the samples' information.

    :param org_id:int: Used to specify the id of the organization that we want to retrieve the samples from.
    :return: A list of dictionaries containing the samples formatted by pydantic.
    """
    samples = get_sample_organization_joined(db.session)
    # print("SAMPLE 0", json.dumps(samples[0], default=str))
    ret = {
        "rows": [],
        "types": []
    }
    for sample in samples:
        sample.measurement_values = get_measurement_value_ORM_by_sample_id(sample.id)
        ret["rows"].append(Sample.from_orm(sample).dict())
        # print(f"Measurement ID: {sample.measurement_values[0].Measurement}")
        for measurement_value in sample.measurement_values:
            print(measurement_value.Measurement.machine)
            current_machine_name = measurement_value.Measurement.machine.machinetype.name
            current_machine_id = measurement_value.Measurement.machine.machinetype.id

            # Check to see if this measurement's machine already exists in the types array
            try:
                type_entry = next(item for item in ret["types"] if item["machineId"] == current_machine_id)
                # Just append to the data array.
                type_entry["data"].append({
                    type: MeasurementType.from_orm(measurement_value.Measurement.measurementtype).dict()
                })
            except:
                print("Exception! Adding type")
                # Not found. Add a new entry with this in the data array.
                ret["types"].append({
                    "machineName": current_machine_name,
                    "machineId": current_machine_id,
                    "data": {
                        "type": [MeasurementType.from_orm(measurement_value.Measurement.measurementtype).dict()]
                    }
                })
    print(f"RET {ret}")


    # print(json.dumps(rows, default=str))
    # ret = rows
    return json.dumps(ret, default=str)

def get_sample_by_id(id: int) -> dict:
    """
    The get_sample_by_id function accepts an integer id as input and returns a dictionary containing the sample's
    information.

    :param id:int: Used to specify the id of the sample that we want to retrieve.
    :return: A dictionary containing the sample formatted by pydantic.
    """
    sample = SampleORM.query.filter_by(id=id).first()
    sample.measurement_values = get_measurement_value_ORM_by_sample_id(sample.id)
    return Sample.from_orm(sample).dict()

# def get_sample_by_org(org_id: int) -> List[dict]:
#     samples = SampleORM.query.filter_by(organization_id=org_id).all()
#     ret = []
#     for sample in samples:
#         ret.append(Sample.from_orm(sample).dict())
#     return json.dumps(ret)

def get_samples_by_user(user_id: int) -> List[dict]:
    """
    The get_sample_by_user function accepts an integer id as input and returns a list of dictionaries containing
    the samples' information.

    :param user_id:int: Used to specify the id of the user that we want to retrieve the samples from.
    :return: A list of dictionaries containing the samples formatted by pydantic.
    """
    samples = SampleORM.query.filter_by(entered_by_id=user_id).all()
    ret = []
    for sample in samples:
        sample.measurement_values = get_measurement_value_ORM_by_sample_id(sample.id)
        ret.append(Sample.from_orm(sample).dict())
    return json.dumps(ret)

def get_samples() -> List[dict]:
    """
    The get_samples function returns a list of dictionaries containing all the samples.

    :return: A list of dictionaries containing the samples formatted by pydantic.
    """
    samples = SampleORM.query.filter_by().all()
    ret = []
    for sample in samples:
        sample.measurement_values = get_measurement_value_ORM_by_sample_id(sample.id)
        ret.append(Sample.from_orm(sample).dict())
    return json.dumps(ret)

def create_measurement_value(measurement_value_dict: dict):
    """
    The create_measurement_value function accepts a dictionary containing the information of a measurement value and
    creates a new measurement value using pydantic to parse and ORM model to save it.

    :param measurement_value_dict:dict: Used to specify the dictionary containing the information of the measurement
    value that we want to create.
    :return: measurement_value:MeasurementValue: A measurement value sqlalchemy model.
    """
    measurement_value:MeasurementValueORM = MeasurementValueORM()
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

def get_logs_by_org(org_id: int) -> List[dict]:
    """
    The get_logs_by_org function accepts an integer id as input and returns a list of dictionaries containing
    the logs' information.

    :param org_id:int: Used to specify the id of the organization that we want to retrieve the logs from.
    :return: A list of dictionaries containing the logs formatted by pydantic.
    """
    logs = LogORM.query.filter_by(organization_id=org_id).all()
    ret = []
    for log in logs:
        ret.append(Log.from_orm(log).dict())
    return ret

def get_logs() -> List[dict]:
    """
    The get_logs function returns a list of dictionaries containing all the logs.

    :return: A list of dictionaries containing the logs formatted by pydantic.
    """
    logs = LogORM.query.filter_by().all()
    ret = []
    for log in logs:
        ret.append(Log.from_orm(log).dict())
    return ret

# def create_sample(sample_dict: dict):
#     sample:SampleORM = SampleORM()
#     for name, value in Sample.parse_obj(sample_dict):
#         if name != 'measurement_values':
#             setattr(sample, name, value)
#         else:
#             for measurement_value_dict in value:
#                 new_mv = create_measurement_value(measurement_value_dict)
#                 sample.measurement_values.append(new_mv)
#     return sample
