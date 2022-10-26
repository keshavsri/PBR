import src.helpers
from http import HTTPStatus
from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src import models, schemas
from src.enums import Roles, LogActions

flockBlueprint = Blueprint('flock', __name__)


@flockBlueprint.route('/', methods=['GET'])
@flockBlueprint.route('/organization/<int:given_org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_flocks(access_allowed, current_user, given_org_id=None):

    """
    This function handles the GET request for all Flocks or flocks belonging to a specific organization.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param given_org_id: The organization id of the organization that the user wants to get the flocks of.
    :return: A list of all Flocks or a list of all Flocks belonging to a specific organization depending on the request.
    """

    if access_allowed:

        current_organization = current_user.organization_id

        if given_org_id:
            if current_user.role == Roles.Super_Admin:
                response_json = src.helpers.get_flocks_by_org(given_org_id)
            elif current_user.organization_id == given_org_id:
                response_json = src.helpers.get_flocks_by_org(given_org_id)
            else:
                response_json = jsonify({'message': 'Insufficient Permissions'})
                return response_json, 401
        else:
            if current_user.role == Roles.Super_Admin:
                response_json = src.helpers.get_all_flocks()
            else:
                response_json = src.helpers.get_flocks_by_org(current_organization)

        # if the response json is empty then return a 404 not found
        if response_json is None:
            response_json = jsonify({'message': 'No records found'})
            return response_json, 404
        else:
            return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@flockBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_flock(access_allowed, current_user, item_id):
    """
    This function handles the GET request for a specific flock.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the flock that the user wants to get.
    :return: A specific flock if it exists, a 404 not found otherwise.
    """
    if access_allowed:

        current_organization = current_user.organization_id
        flock = src.helpers.get_flock_by_id(item_id)
        if flock is None:
            return jsonify({'message': 'No record found'}), 404
        if current_user.role == Roles.Super_Admin or flock.organization == current_organization:
            response_json = src.helpers.get_flock_by_id(item_id)
        else:
            return jsonify({'message': 'You cannot access this flock'}), 403
        return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403
    

@flockBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0, 1])
def post_flock(access_allowed, current_user):
    """
    This function handles the POST request for creating a new flock.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param request.json: The json data that the user wants to create a new flock with.
    :return: A new flock if the request is valid, a 400 bad request otherwise.
    """
    if access_allowed:
        # checks if the Flock already exists in the database
        if models.Flock.query.filter_by(name=request.json.get('name')).first() is None:
            # builds the Flock from the request json
            new_flock = src.helpers.create_flock(request.json)
            # stages and then commits the new Flock to the database
            models.db.session.add(new_flock)
            models.db.session.commit()
            models.create_log(current_user, LogActions.ADD_FLOCK, 'Created new Flock: ' + new_flock.name)
            return schemas.Flock.from_orm(new_flock).dict(), 201
        # if the Flock already exists then return a 409 conflict
        else:
            return jsonify({'message': 'Flock already exists', "existing organization": schemas.Flock.from_orm(models.Flock.query.filter_by(name=request.json.get('name')).first()).dict()}), 409
    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

@flockBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1])
def put_flock(access_allowed, current_user, item_id):

    """
    This function handles the PUT request for updating a specific flock.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the flock that the user wants to update.
    :param request.json: The json data that the user wants to update the flock with.
    :return: A specific flock if it exists, a 404 not found otherwise.
    """

    if access_allowed:
        # check if the Flock exists in the database if it does then update the Flock
        if models.Flock.query.filter_by(organization=current_user.organization_id, id=item_id).first() is None:
            return jsonify({'message': 'Flock does not exist'}), 404
        else:
            if request.json.get('organization') is None and request.json.get('source') is None:
                models.Flock.query.filter_by(id=item_id).update(request.json)
                models.db.session.commit()
                edited_flock = models.Flock.query.get(item_id)
                models.create_log(current_user, LogActions.EDIT_FLOCK, 'Edited Flock: ' + edited_flock.name)
                return schemas.Flock.from_orm(edited_flock).dict(), 200
            else:
                return jsonify({'message': 'Cannot Edit Flock'}), 400
    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

@flockBlueprint.route('/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1])
def delete_flock(access_allowed, current_user, item_id):

    """
    This function handles the DELETE request for deleting a specific flock.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the flock that the user wants to delete.
    :return: The deleted flock if it exists, a 404 not found otherwise.
    """

    if access_allowed:
        # check if the Flock exists in the database if it does then delete the Flock
        if models.Flock.query.filter_by(organization_id=current_user.organization_id, id=item_id).first() is None:
            return jsonify({'message': 'Flock does not exist'}), 404
        else:
            deleted_flock = models.Flock.query.get(item_id)
            models.db.session.delete(models.Flock.query.filter_by(organization_id=current_user.organization_id, id=item_id).first())
            models.db.session.commit()
            models.create_log(current_user, LogActions.DELETE_FLOCK, 'Deleted Flock: ' + deleted_flock.name)
            return jsonify({'message': 'Flock deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@flockBlueprint.route('/<int:item_id>')
@flockBlueprint.route('/')
def invalid_method(item_id=None):

    """
    This function handles an invalid method.

    :param item_id: accepts an id if the user tries to pass one.
    :return: A message saying that the method is invalid.
    """

    return jsonify({'message': 'Invalid Method'}), 405


# Inspiration from https://roytuts.com/python-flask-rest-api-file-upload/
@flockBlueprint.route('/strains/<string:species>', methods=['GET'])
def get_strains(species=None):

    """
    This function handles the GET request for getting all the strains of a specific species.

    :param species: The species of the strain that the user wants to get.
    :return: The strains of the species if it exists, a 404 not found otherwise.
    """

    print(species.lower())
    # Move this to a database soon
    strains = {
        "chicken": [
            "Ross 308",
            "Ross 708",
            "Ross 308 AP",
            "Ranger Premium",
            "Ranger Classic",
            "Ranger Gold",
            "Cobb500",
            "Cobb700",
            "Arbor Acres Plus",
            "Hubbard",
            "Brown",
            "LSL",
            "Sandy",
            "Silver",
            "Tradition",
            "White",
        ],
        "turkey": [
            "Nicholas Select",
            "BUT 6",
            "Converter",
            "Grade Maker",
            "Optima",
            "ConverterNOVO",
        ],
    }

    if species and species.lower() in strains.keys():
        resp = jsonify(strains[species.lower()])
        resp.status_code = HTTPStatus.OK
        return resp
    elif species:
        resp = jsonify({
            'message': 'Unsupported Species!'
        })
        resp.status_code = HTTPStatus.BAD_REQUEST
        return resp
    else:
        resp = jsonify({
            'message': 'Must include a species!'
        })
        resp.status_code = HTTPStatus.BAD_REQUEST
        return resp
