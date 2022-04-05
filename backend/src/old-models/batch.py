from dataclasses import dataclass
from glob import glob
from typing import List
from server import db
from datetime import datetime


@dataclass
class BatchORM(db.Model):
    __tablename__ = 'batch'
    __table_args__ = {'extend_existing': True}

    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(120))

    # Foreign References to this Object
    sample = db.relationship('sample', backref='batch')

   
def createTable():
    db.create_all()