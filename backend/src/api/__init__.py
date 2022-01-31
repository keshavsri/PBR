from flask_restx import Api

from .APIUserController import api as user_api

api = Api(title="PBR API", version="1.0", description="A simple demo API",)

api.add_namespace(user_api)
