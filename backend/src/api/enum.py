import src.helpers
from http import HTTPStatus
import json
from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src import models, schemas
from src.enums import Species, BirdGenders, AgeGroup, Roles

enumBlueprint = Blueprint('enum', __name__)


@enumBlueprint.route('/species/', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_species(access_allowed, current_user):
    if access_allowed:
        return jsonify({item.name: item.value for item in Species})
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@enumBlueprint.route('/gender/', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_genders(access_allowed, current_user):
    if access_allowed:
        return jsonify({item.name: item.value for item in BirdGenders})
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@enumBlueprint.route('/age/', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_age_groups(access_allowed, current_user):
    if access_allowed:
        return jsonify({item.name: item.value for item in AgeGroup})
    else:
        return jsonify({'message': 'Role not allowed'}), 403


<<<<<<< HEAD
@enumBlueprint.route('/roles/', methods=['GET'])
=======
@enumBlueprint.route('/role/', methods=['GET'])
>>>>>>> 70a1b41 (New gender filter All)
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_roles(access_allowed, current_user):
    if access_allowed:
        return jsonify({item.name: item.value for item in Roles})
    else:
<<<<<<< HEAD
        return jsonify({'message': 'Role not allowed'}), 403
=======
        return jsonify({'message': 'Role not allowed'}), 403
>>>>>>> 70a1b41 (New gender filter All)
