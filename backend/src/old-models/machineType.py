from dataclasses import dataclass
from server import db

@dataclass
class MachineTypeORM(db.Model):
    __tablename__ = 'machinetype'
    __table_args__ = {'extend_existing': True}

    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(120))

    # Foreign References to this Object 
    machine = db.relationship('machine', backref='machinetype')
    
    def __init__(self, name:str):
        self.name = name

    # creates the table in the database
    def createTable():
        db.create_all()