from flask import Flask
from flask_restx import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import os
from api import api

load_dotenv(find_dotenv())

app = Flask(__name__)
api.init_app(app)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sources.sqlite3'

db = SQLAlchemy(app)

if __name__ == '__main__':
    db.create_all()
    app.run(
        host= os.environ.get("SERVER_NAME"),
        debug= os.environ.get("DEBUG_MODE"),
        port = os.environ.get("BACKEND_PORT")
    )
    