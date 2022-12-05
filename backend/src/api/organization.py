
from os import access
from threading import currentThread
from src.schemas import Organization, Source
from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from itsdangerous import json
from src.helpers.log import create_log
from src import models, schemas
from src.enums import Roles, LogActions
import src.helpers.log as log_helper
from src.models import Organization as OrganizationORM
from random import randint
from datetime import datetime
from src.models import db, engine


# Flask blueprint for the organization routes, this is the blueprint that is registered in the app.py file with a prefix of /organization
organizationBlueprint = Blueprint('organization', __name__)


@organizationBlueprint.route('/', methods=['GET'])
@token_required
@allowed_roles([0])
def get_organizations(access_allowed, current_user):
    """
    This function will return all the organizations in the database.

    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.

    :return: This function will return all the organizations in the database.

    """

    if access_allowed:
        organizations = OrganizationORM.query.filter_by(is_deleted=False).all()
        ret = []
        for organization in organizations:
            ret.append(Organization.from_orm(organization).dict())
        return jsonify(ret), 200
    else:
        return jsonify({'message': 'Access denied'}), 403


@organizationBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_organization(access_allowed, current_user, item_id):
    """
    This function will return the organization with the id that is passed in.

    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.
    :param item_id: This is the id of the organization that is passed in.

    :return: This function will return the organization with the id that is passed in.
    """
    # response json is created here and gets returned at the end of the block for GET requests.
    # if item id exists then it will return the organization with the id

    if access_allowed:
        if current_user.organization_id == item_id or current_user.role == Roles.Super_Admin:
            org_model = OrganizationORM.query.filter_by(id = item_id, is_deleted=False).first()
            if org_model is not None:
                org = Organization.from_orm(org_model).dict()

    # otherwise it will return all the organizations in the database
        if org is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return jsonify(org), 200
    else:
        return jsonify({'message': 'Access denied'}), 403


@organizationBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1])
def put_organization(access_allowed, current_user, item_id):

    if access_allowed:
        org_model = OrganizationORM.query.get(item_id)
    # check if the organization exists in the database if it does then update the organization
        if org_model is None:
            return jsonify({'message': 'Organization does not exist'}), 404
        else:
            if models.Organization.query.filter_by(name=request.json.get('name'), is_deleted = False).first() is None:
                models.Organization.query.filter_by(
                    id=item_id).update(request.json)
                models.db.session.commit()
                editedOrganization_model = models.Organization.query.get(item_id)
                editedOrg = Organization.from_orm(editedOrganization_model).dict()
                # add log
                create_log(current_user, LogActions.EDIT_ORGANIZATION,'Edited Organization: ' + editedOrg["name"])
                return editedOrg, 200
            else:
                return jsonify({'message': 'Organization with same name already exists', "existing organization": schemas.Organization.from_orm(models.Organization.query.filter_by(name=request.json.get('name')).first()).dict()}), 409

    else:
        return jsonify({'message': 'Access denied'}), 403


@organizationBlueprint.route('/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0])
def delete_organization(access_allowed, current_user, item_id):
    if access_allowed:
        org_model = OrganizationORM.query.get(item_id)
        # check if the organization exists in the database if it does then update the organization
        if org_model is None or org_model.is_deleted == True:
            return jsonify({'message': 'Organization does not exist'}), 404
        else:
            deleted_organization = models.Organization.query.filter_by(
                id=item_id)
            models.Organization.query.filter_by(
                id=item_id).update({'is_deleted': True})
            models.db.session.commit()
        # add log here
        create_log(current_user, LogActions.DELETE_ORGANIZATION,'Deleted organization ' + str(deleted_organization.name))
        return jsonify({'message': 'Organization deleted'}), 200

    else:
        return jsonify({'message': 'Access denied'}), 403


@organizationBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0])
def post_organization(access_allowed, current_user):
    if access_allowed:
        if models.Organization.query.filter_by(name=request.json.get('name'), is_deleted = False).first() is None:
            org: OrganizationORM = OrganizationORM()
            for name, value in Organization.parse_obj(request.json):
                if name != 'notes':
                    setattr(org, name, value)
                elif value is not None and name == 'notes':
                    org.notes = value

            organizations = OrganizationORM.query.all()
            orgCodes = []
            for organization in organizations:
                orgCodes.append(Organization.from_orm(
                    organization).dict().get("organization_code"))

            organization_code = randint(100000, 999999)
            while organization_code in orgCodes:
                organization_code = randint(100000, 999999)

            org.organization_code = organization_code
            org.code_last_updated = datetime.now()

            models.db.session.add(org)
            models.db.session.commit()
            models.db.session.refresh(org)

            create_log(current_user, LogActions.ADD_ORGANIZATION,'Added organization: ' + str(org.name))

            # add log here after merging
            return schemas.Organization.from_orm(org).dict(), 201
        else:
            return jsonify({'message': 'Organization with same name already exists', "existing organization": schemas.Organization.from_orm(models.Organization.query.filter_by(name=request.json.get('name')).first()).dict()}), 409

    else:
        return jsonify({'message': 'Access denied'}), 403
