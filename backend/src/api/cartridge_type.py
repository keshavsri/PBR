from flask import request, Blueprint, jsonify
from http import HTTPStatus

from src import models, helpers, schemas
from src.enums import LogActions, ValidationTypes, Roles
from src.api.user import token_required, allowed_roles

cartridgeTypeBlueprint = Blueprint('cartridgetype', __name__)
