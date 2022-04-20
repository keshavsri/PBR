from dataclasses import dataclass
from server import db

from models.machineType import MachineType
from models.organization import Organization

@dataclass
class Machine(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(120), unique=True, nullable=False)
    type: MachineType = db.Column(db.Integer, db.ForeignKey(MachineType.id), nullable=False)
    organization: Organization = db.Column(db.Integer, db.ForeignKey(Organization.id), nullable=False)
    serial_number: str = db.Column(db.String(120), nullable=False)
