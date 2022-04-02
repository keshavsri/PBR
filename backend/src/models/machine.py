from dataclasses import dataclass
from server import db

from models.machineType import MachineType
from models.organization import Organization

@dataclass
class Machine(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(120), unique=True, nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey('machine_type.id'))
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'), nullable=False)
    serial_number: str = db.Column(db.String(120), nullable=False)
    machine_type: MachineType = db.relationship('MachineType')
    organization: Organization = db.relationship('Organization')
    
    def __init__(self, requestJSON):
        self.name = requestJSON.get('name')
        self.type_id = requestJSON.get('type')
        self.organization_id = requestJSON.get('organization')
        self.serial_number = requestJSON.get('serial_number')

def createTable():
    db.create_all()