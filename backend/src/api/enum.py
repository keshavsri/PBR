import src.helpers
from http import HTTPStatus
import json
from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src import models, schemas
from src.enums import Species, BirdGenders, AgeGroup, Roles, ChickenStrain, TurkeyStrain, ProductionTypes

enumBlueprint = Blueprint('enum', __name__)


@enumBlueprint.route('/species', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_species(access_allowed, current_user):
    if access_allowed:
        return jsonify({item.name: item.value for item in Species})
    else:
        return jsonify({'message': 'Role not allowed'}), 403
        

@enumBlueprint.route('/strain/<string:species>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_strains(access_allowed, current_user, species):
    if access_allowed:
        match species:
            case 'Chicken':
                return jsonify({item.name: item.value for item in ChickenStrain})
            case 'Turkey':
                return jsonify({item.name: item.value for item in TurkeyStrain})
            case _:
                return jsonify({'message': 'Species Not Found'}), 403
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@enumBlueprint.route('/production-type', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_production_types(access_allowed, current_user):
    if access_allowed:
        return jsonify({item.name: item.value for item in ProductionTypes})
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@enumBlueprint.route('/gender', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_genders(access_allowed, current_user):
    if access_allowed:
        return jsonify({item.name: item.value for item in BirdGenders})
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@enumBlueprint.route('/age', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_age_groups(access_allowed, current_user):
    if access_allowed:
        return jsonify({item.name: item.value for item in AgeGroup})
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@enumBlueprint.route('/roles', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_roles(access_allowed, current_user):
    if access_allowed:
        return jsonify({item.name: item.value for item in Roles})
    else:
        return jsonify({'message': 'Role not allowed'}), 403