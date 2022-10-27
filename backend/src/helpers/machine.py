from typing import List
from itsdangerous import json

from src.models import db
from src.models import Machine as MachineORM
from src.models import MachineType as MachineTypeORM
from src.schemas import Machine, MachineType, Measurement, Analyte
from flask import jsonify

def get_machines_by_org(org_id: int) -> List[dict]:
    """
    The get_machines_by_org function returns a list of all machines in an organization.

    :param org_id:int: Used to Filter the machines by organization.
    :return: A list of dictionaries.

    :doc-author: Trelent
    """
    machines = MachineORM.query.filter_by(organization_id=org_id).all()
    pydanticMachines = []
    for machine in machines:
        pydanticMachines.append(Machine.from_orm(machine).dict())
    return jsonify(pydanticMachines)

def get_machines() -> List[dict]:
    machines = MachineORM.query.filter_by().all()
    pydanticMachines = []
    for machine in machines:
        pydanticMachines.append(Machine.from_orm(machine).dict())

    return jsonify(pydanticMachines)

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
        ret.append(MachineType.from_orm(type).dict())
    return json.dumps(ret)

def get_machine_type_by_id(id: int) -> dict:
    """
    The get_machine_type_by_id function accepts an integer id as input and returns a dictionary containing the machine
    type's information.

    :param id:int: Used to specify the id of the machine type that we want to retrieve.
    :return: A dictionary containing the machine type formatted by pydantic.
    """
    machinetype = MachineTypeORM.query.filter_by(id=id).first()
    return MachineType.from_orm(machinetype).dict()

def create_machine_type(machinetype_dict: dict):
    """
    The create_machine_type function accepts a dictionary containing the machine type's information and creates a new
    machine type using the pydantic model to parse and the ORM model to store the information.

    :param machinetype_dict:dict: Used to specify the machine type's information.
    :return: machinetype:MachineType: A machine type sqlalchemy model.
    """
    machinetype:MachineTypeORM = MachineTypeORM()
    for name, value in machinetype.parse_obj(machinetype_dict):
        setattr(machinetype, name, value)
    db.session.add(machinetype)
    db.session.commit()
    db.session.refresh(machinetype)
    return machinetype
