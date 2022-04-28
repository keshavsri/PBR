from flask import Blueprint

apiBlueprint = Blueprint('api', __name__)

@apiBlueprint.route('/')
def home():
    """
    Home page for the API Just a endpoint to test if the API is working
    """
    return 'CVM + CSC API Home'




