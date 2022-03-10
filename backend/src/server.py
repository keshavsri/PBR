from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

from api import apiBlueprint
from api.APISourceController import sourceBlueprint
from api.APIUserController import userBlueprint
from api.APIDataController import sampleBlueprint
from api.APIOrganizationController import organizationBlueprint

app = Flask(__name__)
app.register_blueprint(apiBlueprint, url_prefix='/api')
app.register_blueprint(sourceBlueprint, url_prefix='/api/source')
app.register_blueprint(sampleBlueprint, url_prefix='/api/sample')
app.register_blueprint(userBlueprint, url_prefix='/api/user')
app.register_blueprint(organizationBlueprint, url_prefix='/api/organization')
app.config['SECRET_KEY'] = os.environ.get("JWT_SECRET")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
db = SQLAlchemy(app)


@app.route('/')
def testMethod():
    return 'CVM + CSC Home'



if __name__ == '__main__':
    app.run(
        host= os.environ.get("SERVER_NAME"),
        debug= os.environ.get("DEBUG_MODE"),
        port = os.environ.get("BACKEND_PORT")
    )

