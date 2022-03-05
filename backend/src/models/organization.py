from dataclasses import dataclass
from server import db
from models.enums import States

from models.source import Source


@dataclass
class Organization(db.Model):
    __tablename__ = 'organization'
    __table_args__ = {'extend_existing': True}
    
    # need to add ot    # The fields below are stored in the database, they are assigned both a python and a database type
    id:int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(120), unique=True)
    street_address: str = db.Column(db.String(120))
    city: str = db.Column(db.String(120))
    state: States = db.Column(db.Enum(States))
    zip: str = db.Column(db.String(10))
    notes: str = db.Column(db.String(500))
    organizationCode: str = db.Column(db.String(6), unique=True)
    # TODO: sort this out
    #organizationCodeExpiry = db.Column(db.DateTime)
    sources: list[Source] = None

    # initialize the class from a json object from the frontend
    def __init__ (self, requestJSON):
        self.name = requestJSON.get('name')
        self.street_address = requestJSON.get('street_address')
        self.city = requestJSON.get('city')
        self.state = requestJSON.get('state')
        self.zip = requestJSON.get('zip')

# creates the table in the database
def createTable():
        db.create_all()
        

