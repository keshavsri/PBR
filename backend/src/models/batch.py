from dataclasses import dataclass
from glob import glob
from typing import List
from server import db
from datetime import datetime

from models.sample import Sample

@dataclass
class BatchORM(db.Model):
    __tablename__ = 'batch'
    __table_args__ = {'extend_existing': True}

    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(120))
    entries: List[Sample] = None
   
def createTable():
    db.create_all()