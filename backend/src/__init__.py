from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from src.api import apiBlueprint
from src.api.log import logBlueprint
from src.api.enum import enumBlueprint
from src.api.user import userBlueprint
from src.api.batch import batchBlueprint
from src.api.flock import flockBlueprint
from src.api.sample import sampleBlueprint
from src.api.analyte import analyteBlueprint
from src.api.machine import machineBlueprint
from src.api.organization import organizationBlueprint

import os
import click
from flask.cli import with_appcontext
from dotenv import load_dotenv, find_dotenv


load_dotenv(find_dotenv())


app = Flask(__name__)
app.register_blueprint(apiBlueprint, url_prefix='/api')
app.register_blueprint(logBlueprint, url_prefix='/api/log')
app.register_blueprint(enumBlueprint, url_prefix='/api/enum')
app.register_blueprint(userBlueprint, url_prefix='/api/user')
app.register_blueprint(batchBlueprint, url_prefix='/api/batch')
app.register_blueprint(flockBlueprint, url_prefix='/api/flock')
app.register_blueprint(sampleBlueprint, url_prefix='/api/sample')
app.register_blueprint(analyteBlueprint, url_prefix='/api/analyte')
app.register_blueprint(machineBlueprint, url_prefix='/api/machine')
app.register_blueprint(organizationBlueprint, url_prefix='/api/organization')


app.config['SECRET_KEY'] = os.environ.get("JWT_SECRET")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")


from src import models
models.db.init_app(app)