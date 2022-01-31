from flask import Flask
from flask_restx import Api, Resource, fields
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

app = Flask(__name__)
api = Api(app,
    version="1.0",
    title="PBR API",
    description="API for the PBR Application",
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

db = SQLAlchemy(app)


app.run(
    host= os.environ.get("SERVER_NAME"),
    debug= os.environ.get("DEBUG_MODE"),
    port = os.environ.get("BACKEND_PORT")
)
