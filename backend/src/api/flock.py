from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src.enums import Roles, LogActions
from src.models import Flock as FlockORM, Source as SourceORM
from src.schemas import Flock
from src.models import db, engine
from src.helpers.log import create_log

flockBlueprint = Blueprint('flock', __name__)


@flockBlueprint.route('/organization/<int:org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_flocks_by_organization(access_allowed, current_user, org_id):

    """
    This function handles the GET request for all Flocks or flocks belonging to a specific organization.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param org_id: The organization id of the organization that the user wants to get the flocks of.
    :return: A list of all Flocks belonging to a specific organization depending on the request.
    """

    if access_allowed:
        if current_user.role == Roles.Super_Admin or current_user.organization_id == org_id:
            sql_text = db.text("SELECT f.* FROM flock_table f JOIN source_table s ON f.source_id = s.id AND s.organization_id = :org_id AND s.is_deleted = 0;")
            with engine.connect() as connection:
                flocks_models = connection.execute(sql_text, {"org_id": org_id})
                response = []
                for flock in flocks_models:
                    schema_flock = Flock.from_orm(flock).dict()
                    schema_flock.update({"source_name": SourceORM.query.get(flock.source_id).name})
                    response.append(schema_flock)
                return jsonify(response), 200
        else:
            return jsonify({'message': 'Insufficient Permissions'}), 401
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@flockBlueprint.route('/source/<int:source_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_flocks_by_source(access_allowed, current_user, source_id):

    """
    This function handles the GET request for all Flocks or flocks belonging to a specific source.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param source_id: The source id of the source that the user wants to get the flocks of.
    :return: A list of all Flocks belonging to a specific source depending on the request.
    """

    if access_allowed:
        source = SourceORM.query.get(source_id)
        if current_user.role == Roles.Super_Admin or current_user.organization_id == source.organization_id:
            flocks_models = FlockORM.query.filter_by(source_id=source_id, is_deleted=False).all()
            flocks = [Flock.from_orm(flock).dict() for flock in flocks_models]
            return jsonify(flocks), 200
        else:
            return jsonify({'message': 'Insufficient Permissions'}), 401
    else:
        return jsonify({'message': 'Role not allowed'}), 403



@flockBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_flock(access_allowed, current_user, item_id):
    """
    This function handles the GET request for a specific flock.

    :param access_allowed: True if user has access, False otherwise Check the decorator for more info.
    :param current_user: The user who is currently logged in. Check the decorator for more info.
    :param item_id: The id of the flock that the user wants to get.
    :return: A specific flock if it exists, a 404 not found otherwise.
    """
    if access_allowed:
        sql_text = db.text("SELECT s.organization_id FROM flock_table f, source_table s WHERE f.source_id = s.id AND is_deleted = 0;")
        with engine.connect() as connection:
            flock_organization_id = connection.execute(sql_text)
        if current_user.role == Roles.Super_Admin or flock_organization_id == current_user.organization_id:
            flock_model = FlockORM.query.get(item_id)
            if flock_model is None:
                return jsonify({'message': 'No record found'}), 404
            flock = Flock.from_orm(flock_model).dict()
            return jsonify(flock), 200
        else:
            return jsonify({'message': 'Insufficient Permissions'}), 401
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
            create_log(current_user, LogActions.ADD_FLOCK, 'Created new Flock: ' + flock.name)
            return jsonify(Flock.from_orm(flock).dict()), 201
        # if the Flock already exists then return a 409 conflict
        else:
            return jsonify({'message': 'Flock already exists', "existing organization": Flock.from_orm(FlockORM.query.filter_by(name=request.json.get('name')).first()).dict()}), 409
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
        FlockORM.query.filter_by(id=item_id).update(request.json)
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
            setattr(flock, 'is_deleted', 1)
            db.session.commit()
            create_log(current_user, LogActions.DELETE_FLOCK, 'Deleted Flock: ' + flock.name)
            return jsonify({'message': 'Flock deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
