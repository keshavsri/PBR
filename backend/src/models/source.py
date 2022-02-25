from server import db
from models.enums import States
from dataclasses import dataclass


@dataclass
class Source(db.Model):
    __tablename__ = 'source'
    __table_args__ = {'extend_existing': True}
    
    id: int
    name: str
    street_address: str
    state: States
    zip: str
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), index=True, unique=True)
    street_address = db.Column(db.String(120))
    city = db.Column(db.String(120))
    state = db.Column(db.String(20))
    zip = db.Column(db.String(10))
    organizations = None
    

    def __init__(self, requestJSON: dict):
        self.id = requestJSON.get('id')
        self.name = requestJSON.get('name')
        self.street_address = requestJSON.get('street_address')
        self.city = requestJSON.get('city')
        self.state = requestJSON.get('state')
        self.zip = requestJSON.get('zip')

def createTable():
    db.create_all()


