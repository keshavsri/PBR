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
from src.Models import MeasurementType as MeasurementTypeORM
from src.Schemas import Flock, Organization, Source, Sample, Machine, Machinetype, Measurement, MeasurementType

def get_machines_by_org(org_id: int) -> List[dict]:
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
    machine = MachineORM.query.filter_by(id=id).first()
    return Machine.from_orm(machine).dict()

def create_machine(machine_dict: dict):
    machine:MachineORM = MachineORM()
    for name, value in Machine.parse_obj(machine_dict):
        setattr(machine, name, value)
    machine.machinetype = MachineTypeORM.query.filter_by(id=machine_dict['machinetype_id']).first()
    db.session.add(machine)
    db.session.commit()
    db.session.refresh(machine)
    return machine

def get_machine_types() -> List[dict]:
    machinetypes = MachineTypeORM.query.filter_by().all()
    ret = []
    for type in machinetypes:
        ret.append(Machinetype.from_orm(type).dict())
    return json.dumps(ret)

def get_machine_type_by_id(id: int) -> dict:
    machinetype = MachineTypeORM.query.filter_by(id=id).first()
    return Machinetype.from_orm(machinetype).dict()

def create_machine_type(machinetype_dict: dict):
    machinetype:MachineTypeORM = MachineTypeORM()
    for name, value in Machinetype.parse_obj(machinetype_dict):
        setattr(machinetype, name, value)
    db.session.add(machinetype)
    db.session.commit()
    db.session.refresh(machinetype)
    return machinetype

def create_sample(sample_dict: dict):
    sample:SampleORM = SampleORM()
    for name, value in Sample.parse_obj(sample_dict):
        setattr(sample, name, value)
    db.session.add(sample)
    db.session.commit()
    db.session.refresh(sample)
    return sample

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
    source:SourceORM = SourceORM()
    for name, value in Source.parse_obj(source_dict):
        setattr(source, name, value)
    db.session.add(source)
    db.session.commit()
    db.session.refresh(source)
    return source

def get_flock_by_id(id: int) -> Flock:
    flock = FlockORM.query.filter_by(id=id).first()
    print(flock)
    return Flock.from_orm(flock).dict()


def get_flock_by_org(org_id: int) -> List[dict]:
    flocks = FlockORM.query.filter_by(organization_id=org_id).all()
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

def get_measurement_types() -> List[dict]:
    measurement_types = MeasurementTypeORM.query.filter_by().all()
    ret = []
    for type in measurement_types:
        ret.append(MeasurementType.from_orm(type).dict())
    return json.dumps(ret)

def get_measurement_type_by_id(id: int) -> dict:
    measurement_type = MeasurementTypeORM.query.filter_by(id=id).first()
    return MeasurementType.from_orm(measurement_type).dict()

def create_measurement_type(measurement_type_dict: dict):
    measurement_type:MeasurementTypeORM = MeasurementTypeORM()
    for name, value in MeasurementType.parse_obj(measurement_type_dict):
        setattr(measurement_type, name, value)
    db.session.add(measurement_type)
    db.session.commit()
    db.session.refresh(measurement_type)
    return measurement_type

def get_measurements()-> List[dict]:
    measurements = MeasurementORM.query.filter_by().all()
    ret = []
    for measurement in measurements:
        ret.append(Measurement.from_orm(measurement).dict())
    return json.dumps(ret)

def get_measurement_by_id(id: int) -> dict:
    measurement = MeasurementORM.query.filter_by(id=id).first()
    return Measurement.from_orm(measurement).dict()

def create_measurement(measurement_dict: dict):
    measurement:MeasurementORM = MeasurementORM()
    for name, value in Measurement.parse_obj(measurement_dict):
        setattr(measurement, name, value)
    db.session.add(measurement)
    db.session.commit()
    db.session.refresh(measurement)
    return measurement
