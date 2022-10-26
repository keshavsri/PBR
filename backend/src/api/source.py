
from urllib import response
from backend.src.enums import LogActions
from src.api.user import token_required, allowed_roles
from flask import request, Blueprint, jsonify

from src import models, schemas
from src.enums import Roles, LogActions
import src.helpers.source as source_helper



sourceBlueprint = Blueprint('source', __name__)


@sourceBlueprint.route('/<int:org_id>/sources/', methods=['POST'])
@token_required
@allowed_roles([0, 1, 2, 3 ])
def post_source(access_allowed, current_user):
    """
    This function will create a new source in the database.

    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.

    :return: This function will return the source that was created in the database.
    """
    if access_allowed:
        if models.Source.query.filter_by(name=request.json['name']).first() is None:
            newSource = source_helper.create_source(request.json)
            models.create_log(current_user, LogActions.ADD_SOURCE,'Created new source', newSource.id)
            return schemas.Source.from_orm(newSource).dict(), 201
        else:
            return jsonify({'message': 'Source already exists', "existing source": schemas.Source.from_orm(models.Source.query.filter_by(name=request.json['name']).first()).dict()}), 409
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403


@sourceBlueprint.route('/<int:item_id>/sources/<int:source_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_source(access_allowed, current_user, item_id):
    """
    This function will return the source with the id that is passed in.

    :param access_allowed: This is the access_allowed variable that is passed in from the token_required function.
    :param current_user: This is the current_user variable that is passed in from the token_required function.
    :param item_id: This is the id of the source that is passed in.

    :return: This function will return the source with the id that is passed in.
    """
    if access_allowed:
        responseJson = None
        if  models.Source.query.filter_by(item_id) is None:
            responseJson = jsonify({'message': 'No records found'})
            return responseJson, 404
        else:
            models.Source.query.filter_by(item_id).update(request.json)
            models.db.session.commit()
            editSource = models.Source.query.filter_by(item_id).first()
            models.create_log(current_user, LogActions.EDIT_SOURCE, 'Edited source', editSource.id)

    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403


@sourceBlueprint.route('/<int:item_id>/sources/<int:source_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1, 2, 3])
def put_source(access_allowed, current_user, item_id):
    if access_allowed:
        responseJson = None
        if models.Source.query.filter_by(item_id) is None:
            responseJson = jsonify({'message': 'No records found'})
            return responseJson, 404
        else:
            models.Source.query.filter_by(item_id).update(request.json)
            models.db.session.commit()
            editSource = models.Source.query.filter_by(item_id).first()
            models.create_log(current_user, LogActions.EDIT_SOURCE,
                              'Edited source', editSource.id)
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403



@sourceBlueprint.route('/<int:organization_id>/sources/<int:source_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1, 2, 3])
def deleteSource(access_allowed, current_user, item_id, source_id, given_org_id=None):
    """
    Deletes a source from an organization

    :param access_allowed: boolean, whether the user has access to the route
    :param current_user: the user object of the user making the request
    :param item_id: the id of the organization to delete the source from
    :param source_id: the id of the source to delete

    :return: a json response with the source deleted
    """

    if access_allowed:
        if current_user.organization_id is not item_id and current_user.role is not Roles.Super_Admin:
            return jsonify({'message': 'Cannot delete in another organization'}), 403
        # check if the source exists in the database if it does then delete the source
        source = models.Source.query.get(source_id)
        if models.Source.query.get(source_id) is None:
            return jsonify({'message': 'Source does not exist'}), 404
        else:
            models.db.session.delete(models.Source.query.get(source_id))
            models.db.session.commit()
            models.create_log(current_user, LogActions.DELETE_SOURCE, 'Deleted source: ' +
                              source.name + ' in organization: ' + models.Organization.query.get(item_id).name)
            return jsonify({'message': 'Source deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
