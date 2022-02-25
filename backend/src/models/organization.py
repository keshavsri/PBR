from dataclasses import dataclass
from typing import List
from server import db
from models.enums import States

from models.user import User
from models.source import Source


@dataclass
class Organization(db.Model):
    __tablename__ = 'organization'
    __table_args__ = {'extend_existing': True}
    
    id: int
    name: str
    street_address: str
    city: str
    state: States
    zip: str
    mainContact: User
    notes: str
    sources: List[Source]
    
    # need to add other one to many 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    street_address = db.Column(db.String(120))
    city = db.Column(db.String(120))
    state = db.Column(db.String(20))
    zip = db.Column(db.String(10))
    mainContact = db.Column(db.Integer, db.ForeignKey('user.id'))
    notes = db.Column(db.String(500))
    sources = None

    def __init__ (self, requestJSON):
        self.name = requestJSON.get('name')
        self.street_address = requestJSON.get('street_address')
        self.city = requestJSON.get('city')
        self.state = requestJSON.get('state')
        self.zip = requestJSON.get('zip')

def createTable():
        db.create_all()
