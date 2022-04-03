from server import db
from models.user import User
from models.organization import OrganizationORM
from models.source import SourceORM
from models.sample import SampleORM
from models.log import createTable as createLogTable
from models.flock import FlockORM
from models.batch import createTable as createBatchTable

from models.sample import Sample


SourceORM.createTable()
OrganizationORM.createTable()
User.createTable()
SampleORM.createTable()
FlockORM.createTable()
createLogTable()
createBatchTable()
db.create_all()
