
from threading import currentThread
from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from itsdangerous import json

from src import models, schemas
from src.enums import Roles, LogActions
import src.helpers.organization as organization_helper

# Flask blueprint for the organization routes, this is the blueprint that is registered in the app.py file with a prefix of /organization
organizationBlueprint = Blueprint('organization', __name__)


@organizationBlueprint.route('/', methods=['GET'])
@token_required
@allowed_roles([0])
def get_organizations(access_allowed):
    """
    This function will return all the organizations in the database.

    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.

    :return: This function will return all the organizations in the database.
    """

    if access_allowed:
        responseJSON = organization_helper.get_all_organizations()
        print(f"Response JSON: {responseJSON}")
        return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403


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
    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        # if item id exists then it will return the organization with the id
        if current_user.organization_id == item_id or current_user.role == Roles.Super_Admin:
            responseJSON = organization_helper.get_organization_by_id(item_id)
        # otherwise it will return all the organizations in the database
        if responseJSON is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403


@organizationBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0])
def post_organization(access_allowed, current_user):
    """
    This function will create a new organization in the database.

    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.
    :param request.json: This is the json that is used to create the new organization.

    :return: This function will create a new organization in the database.
    """

    if access_allowed:
        # checks if the organization already exists in the database
        if models.Organization.query.filter_by(name=request.json.get('name')).first() is None:
            # builds the organization from the request json
            newOrganization = organization_helper.create_organization(
                request.json)
            models.create_log(current_user, LogActions.ADD_ORGANIZATION,
                              'Created new organization: ' + newOrganization.name)
            return schemas.Organization.from_orm(newOrganization).dict(), 201
        # if the organization already exists then return a 409 conflict
        else:
            return jsonify({'message': 'Organization already exists', "existing organization": schemas.Organization.from_orm(models.Organization.query.filter_by(name=request.json.get('name')).first()).dict()}), 409

    else:
        return jsonify({'message': 'Role not allowed'}), 403


@organizationBlueprint.route('/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0])
def delete_organization(access_allowed, current_user, item_id):
    if access_allowed:
        if models.Organization.query.filter_by(id=item_id) is None:
            return jsonify({'message': 'Organization does not exist'}), 404
        else:
            deleted_organization = models.Organization.query.filter_by(
                id=item_id)
            models.Organization.query.filter_by(
                id=item_id).update({'is_deleted': True})
            models.create_log(current_user, LogActions.DELETE_ORGANIZATION,
                              'Deleted organization with id: ' + str(deleted_organization.name))
            return jsonify({'message': 'Organization deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@organizationBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1])
def put_organization(access_allowed, current_user, item_id):
    """
    This function will update an existing organization in the database.

    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.
    :param item_id: This is the id of the organization that is passed in.
    :param request.json: This is the json that is used to update the organization.

    :return: This function will update an existing organization in the database.
    """

    if access_allowed:
        # check if the organization exists in the database if it does then update the organization
        if models.Organization.query.get(item_id) is None:
            return jsonify({'message': 'Organization does not exist'}), 404
        else:
            models.organization.query.filter_by(
                id(item_id)).update(request.json)
            models.db.session.commit()
            editedOrganization = models.Organization.query.get(item_id)
            models.create_log(current_user, LogActions.EDIT_ORGANIZATION,
                              'Edited Organization: ' + editedOrganization.name)
            return schemas.Organization.from_orm(models.Organization.query.get(item_id)).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
