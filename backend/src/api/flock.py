from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src.enums import Roles, LogActions
from src.models import Flock as FlockORM
from src.schemas import Flock
from src.models import db
from src.helpers.log import create_log

flockBlueprint = Blueprint('flock', __name__)

@flockBlueprint.route('/organization/<int:org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_flocks(access_allowed, current_user, org_id):

    """
    This function handles the GET request for all Flocks or flocks belonging to a specific organization.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param org_id: The organization id of the organization that the user wants to get the flocks of.
    :return: A list of all Flocks or a list of all Flocks belonging to a specific organization depending on the request.
    """

    if access_allowed:
        current_organization = current_user.organization_id
        if current_user.role == Roles.Super_Admin or current_user.organization_id == org_id:
<<<<<<< HEAD
<<<<<<< HEAD
            flocks_models = db.engine.execute("SELECT flock_table.* FROM flock_table, Source, Organization WHERE Flock.source_id = Source.id AND Source.organization_id = Organization.id;")
=======
            flocks_models = db.engine.execute("SELECT Flock.* FROM Flock, Source, Organization WHERE Flock.source_id = Source.id AND Source.organizaiton_id = Organization.id;")
>>>>>>> 514f489 (API endpoints for CartridgeType, Flock, and Log)
=======
            flocks_models = db.engine.execute("SELECT Flock.* FROM Flock, Source, Organization WHERE Flock.source_id = Source.id AND Source.organization_id = Organization.id;")
>>>>>>> 4440ab1 (Add newline at eof)
            flocks = [Flock.from_orm(flock).dict() for flock in flocks_models]
            return jsonify(flocks), 200
        else:
            return jsonify({'message': 'Insufficient Permissions'}), 401
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
        flock_model = FlockORM.query.filter_by(id=item_id).first()
        if flock_model is None:
            return jsonify({'message': 'No record found'}), 404
        flock = Flock.from_orm(flock_model).dict()
        return jsonify(flock), 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403
    

@flockBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0, 1, 2, 3])
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
        if FlockORM.query.filter_by(name=request.json.get('name')).first() is None:
            # builds the Flock from the request json
            flock: FlockORM = FlockORM()
            for name, value in Flock.parse_obj(request.json):
                setattr(flock, name, value)
            db.session.add(flock)
            db.session.commit()
            db.session.refresh(flock)
            create_log(current_user, LogActions.ADD_FLOCK, 'Created new Flock: ' + new_flock.name)
            return jsonify(schemas.Flock.from_orm(flock).dict()), 201
        # if the Flock already exists then return a 409 conflict
        else:
            return jsonify({'message': 'Flock already exists', "existing organization": schemas.Flock.from_orm(models.Flock.query.filter_by(name=request.json.get('name')).first()).dict()}), 409
    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

@flockBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2, 3])
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
        flock_model = FlockORM.query.get(item_id)
        if flock_model is None:
            return jsonify({'message': 'Flock does not exist'}), 404
        flock_model.update(request.json)
        db.session.commit()
        edited_flock = FlockORM.query.get(item_id)
        create_log(current_user, LogActions.EDIT_FLOCK, 'Edited Flock: ' + edited_flock.name)
        return jsonify(Flock.from_orm(edited_flock).dict()), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

@flockBlueprint.route('/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1, 2, 3])
def delete_flock(access_allowed, current_user, item_id):

    """
    This function handles the DELETE request for deleting a specific flock.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the flock that the user wants to delete.
    :return: 200 if flock exists, a 404 not found otherwise.
    """

    if access_allowed:
        # check if the Flock exists in the database if it does then delete the Flock
        if FlockORM.query.get(item_id) is None:
            return jsonify({'message': 'Flock does not exist'}), 404
        else:
            flock = FlockORM.query.get(item_id)
            models.db.session.delete(flock)
            models.db.session.commit()
            create_log(current_user, LogActions.DELETE_FLOCK, 'Deleted Flock: ' + flock.name)
            return jsonify({'message': 'Flock deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
