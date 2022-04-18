from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

from api import apiBlueprint
from api.APIUserController import userBlueprint
from api.APIDataController import sampleBlueprint
from api.APIOrganizationController import organizationBlueprint
from api.APILogController import logBlueprint
from api.APIFlockController import flockBlueprint
from api.APIDataController import sampleBlueprint
from Models import db

app = Flask(__name__)
app.register_blueprint(apiBlueprint, url_prefix='/api')
app.register_blueprint(userBlueprint, url_prefix='/api/user')
app.register_blueprint(organizationBlueprint, url_prefix='/api/organization')
app.register_blueprint(logBlueprint, url_prefix='/api/log')
app.register_blueprint(flockBlueprint, url_prefix='/api/flock')
app.register_blueprint(sampleBlueprint, url_prefix='/api/sample')
app.config['SECRET_KEY'] = os.environ.get("JWT_SECRET")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")

db.init_app(app = app)

with app.app_context():
    print("Creating database tables...")
    db.create_all()
    print("Done!")


@app.route('/')
def testMethod():
    return 'CVM + CSC Home'

if __name__ == '__main__':
    app.run(
        host= os.environ.get("SERVER_NAME"),
        debug= os.environ.get("DEBUG_MODE"),
        port = os.environ.get("BACKEND_PORT")
    )

