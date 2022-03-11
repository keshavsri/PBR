from server import db
from models.user import User
from models.organization import Organization
from models.source import Source
from models.log import createTable as createLogTable
from models.flock import createTable as createFlockTable
from models.sample import createTable as createSampleTable
from models.batch import createTable as createBatchTable

from models.batch import Batch
from models.sample import Sample
Sample.batch_id = db.Column(db.Integer, db.ForeignKey(Batch.id), nullable=True)
Batch.entries = db.relationship('Sample')


Organization.createTable()
User.createTable()
Source.createTable()
createLogTable()
createFlockTable()
createSampleTable()
createBatchTable()
db.create_all()
