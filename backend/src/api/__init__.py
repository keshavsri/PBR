from flask import Blueprint

apiBlueprint = Blueprint('api', __name__)

@apiBlueprint.route('/')
def home():
    return 'CVM + CSC API Home'




