from models.machine import MachineORM
from models.machineType import MachineTypeORM
from models.measurement import MeasurementORM
from models.measurementType import MeasurementTypeORM
from models.measurementValue import MeasurementValueORM
from models.organization_source import OrganizationSourceORM
from models.organizationsource_flock_sample import OrganizationSourceFlockSampleORM
from server import db
from models.user import UserORM
from models.organization import OrganizationORM
from models.source import SourceORM
from models.sample import SampleORM
from models.log import createTable as createLogTable
from models.flock import FlockORM
from models.batch import createTable as createBatchTable



UserORM.createTable()
MeasurementValueORM.createTable()
OrganizationORM.createTable()
OrganizationSourceORM.createTable()
OrganizationSourceFlockSampleORM.createTable()
SourceORM.createTable()
FlockORM.createTable()
SampleORM.createTable()
MeasurementORM.createTable()
MeasurementTypeORM.createTable()
MachineORM.createTable()
MachineTypeORM.createTable()
createLogTable()
createBatchTable()
db.create_all()
