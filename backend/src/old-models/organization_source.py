from server import db
from dataclasses import dataclass


@dataclass
class OrganizationSourceORM(db.Model):
    __tablename__ = 'organization-source'
    __table_args__ = {'extend_existing': True}

    
    id: int = db.Column(db.Integer, primary_key=True)

    # References to Foreign Objects
    organization_id: int = db.Column(db.Integer, db.ForeignKey('organization.id'))
    source_id: int = db.Column(db.Integer, db.ForeignKey('source.id'))
    
    # Foreign References to this Object
    organization_source_flock_sample = db.relationship('organization-source-flock-sample', backref='organization-source')
    
    # creates the table in the database
    def createTable():
        db.create_all()

