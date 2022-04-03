from dataclasses import dataclass
from server import db

@dataclass
class MachineType(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(120))
    
    def __init__(self, name:str):
        self.name = name

# def createTable():
#     db.create_all()