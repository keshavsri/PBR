from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from src.api import apiBlueprint
from src.api.APIUserController import userBlueprint
from src.api.APIDataController import sampleBlueprint
from src.api.APIOrganizationController import organizationBlueprint
from src.api.APILogController import logBlueprint
from src.api.APIFlockController import flockBlueprint
from src.api.APIDataController import sampleBlueprint
from src.api.APIMachineController import machineBlueprint
from src.api.APIMeasurementController import measurementBlueprint
from src.api.APIDataController import sampleBlueprint
import os
from dotenv import load_dotenv, find_dotenv
from flask.cli import with_appcontext
import click

load_dotenv(find_dotenv())


app = Flask(__name__)
app.register_blueprint(apiBlueprint, url_prefix='/api')
app.register_blueprint(userBlueprint, url_prefix='/api/user')
app.register_blueprint(organizationBlueprint, url_prefix='/api/organization')
app.register_blueprint(logBlueprint, url_prefix='/api/log')
app.register_blueprint(flockBlueprint, url_prefix='/api/flock')
app.register_blueprint(sampleBlueprint, url_prefix='/api/sample')
app.register_blueprint(machineBlueprint, url_prefix='/api/machine')
app.register_blueprint(measurementBlueprint, url_prefix='/api/measurement')
app.config['SECRET_KEY'] = os.environ.get("JWT_SECRET")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")


from src import Models
Models.db.init_app(app)