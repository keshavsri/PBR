from server import db
from models.enums import States
from dataclasses import dataclass

@dataclass
class Source(db.Model):
    __tablename__ = 'source'
    __table_args__ = {'extend_existing': True}
    
    # The fields below are stored in the database, they are assigned both a python and a database type
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(120), unique=True)
    street_address: str = db.Column(db.String(120))
    city: str = db.Column(db.String(120))
    state: States = db.Column(db.String(20))
    zip: str = db.Column(db.String(10))
    
    # initialize the class from a json object from the frontend
    def __init__(self, requestJSON: dict):
        self.id = requestJSON.get('id')
        self.name = requestJSON.get('name')
        self.street_address = requestJSON.get('street_address')
        self.city = requestJSON.get('city')
        self.state = requestJSON.get('state')
        self.zip = requestJSON.get('zip')

    # creates the table in the database
    def createTable():
        from models.organization import Organization
        organizations: list[Organization] = None
        db.create_all()


