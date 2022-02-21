from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

from api import apiBlueprint
from api.APISourceController import sourceBlueprint
from api.APIUserController import userBlueprint

app = Flask(__name__)
db = SQLAlchemy(app)

app.register_blueprint(apiBlueprint, url_prefix='/api')
app.register_blueprint(sourceBlueprint, url_prefix='/api/source')
app.register_blueprint(userBlueprint, url_prefix='/api/user')

@app.route('/')
def testMethod():
    return 'Hello World'

app.config['SECRET_KEY'] = os.environ.get("JWT_SECRET")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sources.sqlite3'


if __name__ == '__main__':
    db.create_all()
    app.run(
        host= os.environ.get("SERVER_NAME"),
        debug= os.environ.get("DEBUG_MODE"),
        port = os.environ.get("BACKEND_PORT")
    )

