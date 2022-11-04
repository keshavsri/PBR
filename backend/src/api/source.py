
from os import access
from threading import currentThread

from src.schemas import Organization, Source
from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from itsdangerous import json

from src import models, schemas
from src.enums import Roles, LogActions
import src.helpers.log as log_helper
from src.models import Source as SourceORM
from random import randint


sourceBlueprint = Blueprint('source', __name__)


# get a specifc source
@sourceBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0])
def get_source(access_allowed, item_id):

    if access_allowed:
        source_model = SourceORM.query.get(item_id)
        source = Source.from_orm(source_model).dict()
        # otherwise it will return all the organizations in the database
        if source is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return jsonify(source), 200
    else:
        return jsonify({'message': 'Access denied'}), 403


# return all sources in the database
@sourceBlueprint.route('/', methods=['GET'])
@token_required
@allowed_roles([0])
def get_sources(access_allowed):

    if access_allowed:
        sources = SourceORM.query.all()
        ret = []
        for source in sources:
            ret.append(Source.from_orm(source).dict())
        return json.dumps(ret), 200
    else:
        return jsonify({'message': 'Access denied'}), 403


# return all the sources for a specific organization
@sourceBlueprint.route('/organization/<int:org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_sources_by_organization(access_allowed, current_user, org_id):
    if access_allowed:
        if current_user.organization_id == org_id or current_user.role == Roles.Super_Admin:
            sources = SourceORM.query.filter_by(organization_id=org_id).all()
            ret = []
            for source in sources:
                ret.append(Source.from_orm(source).dict())
            return json.dumps(ret), 200
    else:
        return jsonify({'message': 'Access denied'}), 403


# create a new source
@sourceBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0, 1, 2])
def create_source(access_allowed, current_user):

    # if access_allowed:
    if access_allowed:
        # source name must different is posted for the same organization
        if current_user.role == Roles.Super_Admin or current_user.organization_id == request.json['organization_id']:

            if models.Source.query.filter_by(organization_id=request.json.get('organization_id'),name=request.json.get('name')).first() is None:
                models.db.session.add(models.Source(name=request.json.get('name'), street_address=request.json.get('street_address'), city=request.json.get('city'), state=request.json.get('state'), zip=request.json.get('zip'), organization_id=request.json.get('organization_id')))
                models.db.session.commit()
                return jsonify({'message': 'Source created successfully'}), 201
            else:
                return jsonify({'message': 'Source already exists with the same name in the organization'}), 400
    else:
        return jsonify({'message': 'Access denied'}), 403


# update a source
@sourceBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2])
def update_source(item_id):
    source = models.Source.query.get(item_id)
    if source is None:
        return jsonify({'message': 'Source not found'}), 404
    else:
        models.Source.query.filter_by(id=item_id).update(request.json)
        models.db.session.commit()
        return jsonify({'message': 'Source updated successfully'}), 200


# delete a source
@sourceBlueprint.route('/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0])
def delete_source(item_id):
    source = models.Source.query.get(item_id)
    if source is None:
        return jsonify({'message': 'Source not found'}), 404
    else:

        models.Source.query.filter_by(id=item_id).update({'is_deleted': True})
        models.db.session.commit()
        return jsonify({'message': 'Source deleted successfully'}), 200
