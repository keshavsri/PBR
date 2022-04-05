from server import db
from dataclasses import dataclass


@dataclass
class OrganizationSourceFlockSampleORM(db.Model):
    __tablename__ = 'organization-source-flock-sample'
    __table_args__ = {'extend_existing': True}
    
    id: int = db.Column(db.Integer, primary_key=True)

    # References to Foreign Objects
    organization_source_id: int = db.Column(db.Integer, db.ForeignKey('organization-source.id'))
    flock_id: int = db.Column(db.Integer, db.ForeignKey('flock.id'))
    
    # Foreign References to this Object 
    sample = db.relationship('sample', backref='organization-source-flock-sample')

    # creates the table in the database
    def createTable():
        db.create_all()

