def main():
    """Entry point for the application script"""
    print("Call your main application code here")


from flask_restx import Api

from /api/APIUserController import api as user_api

api = Api(title="PBR API", version="1.0", description="A simple demo API",)

api.add_namespace(user_api)
