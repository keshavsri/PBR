
from src.api.APIUserController import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src import Models, Schemas
from src.enums import Roles, LogActions
import src.helpers

# Flask blueprint for the organization routes, this is the blueprint that is registered in the app.py file with a prefix of /organization
organizationBlueprint = Blueprint('organization', __name__)

@organizationBlueprint.route('/', methods=['GET'])
@token_required
@allowed_roles([0])
def get_organizations(access_allowed, current_user):
    if access_allowed:
        responseJSON = src.helpers.get_all_organizations()
        # if the response json is empty then return a 404 not found
        if responseJSON is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@organizationBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_organization(access_allowed, current_user, item_id):
    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        # if item id exists then it will return the organization with the id
        if current_user.organization.id == item_id:
            responseJSON = src.helpers.get_organization_by_id(item_id)
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
    if access_allowed:        
        # checks if the organization already exists in the database
        if Models.Organization.query.filter_by(name=request.json.get('name')).first() is None:
            # builds the organization from the request json
            newOrganization = src.helpers.create_organization(request.json)
            Models.createLog(current_user, LogActions.ADD_ORGANIZATION, 'Created new organization: ' + newOrganization.name)
            return Schemas.Organization.from_orm(Models.Organization.query.filter_by(name=request.json.get('name')).first()).dict(), 201
        # if the organization already exists then return a 409 conflict
        else:
            return jsonify({'message': 'Organization already exists', "existing organization": Schemas.Organization.from_orm(Models.Organization.query.filter_by(name=request.json.get('name')).first()).dict()}), 409

    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

@organizationBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1])
def put_organization(access_allowed, current_user, item_id):
    if access_allowed:
        #check if the organization exists in the database if it does then update the organization
        if Models.Organization.query.get(item_id) is None:
            return jsonify({'message': 'Organization does not exist'}), 404
        else:
            if request.json.get('sources') is None:
                Models.Organization.query.filter_by(id=item_id).update(request.json)
                Models.db.session.commit()
            else:
                sources = request.json.pop('sources')
                Models.Organization.query.filter_by(id=item_id).update(request.json)
                for source in sources:
                    temp_org = Models.Organization.query.filter_by(id=item_id).first()
                    if Models.Source.query.get(source.get('id')) is None:
                        Models.db.session.commit()
                        new_source = src.helpers.create_source(source)
                        temp_org.sources.append(new_source)
                    else:
                        Models.Source.query.filter_by(id=source.get('id')).update(source)
                        temp_org.sources.append(Models.Source.query.get(source.get('id')))
                Models.db.session.commit()
            
            editedOrganization = Models.Organization.query.get(item_id)
            Models.createLog(current_user, LogActions.EDIT_ORGANIZATION, 'Edited Organization: ' + editedOrganization.name)
            return Schemas.Organization.from_orm(Models.Organization.query.get(item_id)).dict(), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

# @organizationBlueprint.route('/<int:item_id>/sources', methods=['GET'])
# @token_required
# @allowed_roles([0,1,2,3])
# def getSources(access_allowed, current_user, item_id):
#     if access_allowed:
#         responseJSON = jsonify(Models.Organization.query.get(item_id).sources)
#         # if the response json is empty then return a 404 not found
#         if responseJSON.json is None or (current_user.organization.id is not item_id and current_user.role.id is not Roles.Super_Admin):
#             responseJSON = jsonify({'message': 'No records found'})
#             return responseJSON, 404
#         else:
#             return responseJSON, 200
#     else:
#         return jsonify({'message': 'Role not allowed'}), 403
#
#
# @organizationBlueprint.route('/<int:item_id>/sources/<int:source_id>', methods=['GET'])
# @token_required
# @allowed_roles([0, 1, 2, 3])
# def getSource(access_allowed, current_user, item_id, source_id):
#     if access_allowed:
#         # response json is created here and gets returned at the end of the block for GET requests.
#         responseJSON = None
#         # if item id exists then it will return the organization with the id
#         if current_user.organization.id == item_id or current_user.role.id is Roles.Super_Admin:
#             responseJSON = jsonify(Models.Source.query.get(source_id))
#         # otherwise it will return all the organizations in the database
#         if responseJSON.json is None:
#             responseJSON = jsonify({'message': 'No records found'})
#             return responseJSON, 404
#         else:
#             return responseJSON, 200
#     else:
#         return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403


@organizationBlueprint.route('/<int:item_id>/sources/<int:source_id>', methods=['DELETE'])
@token_required
@allowed_roles([0])
def deleteSource(access_allowed, current_user, item_id, source_id):
    if access_allowed:
        if current_user.organization_id is not item_id and current_user.role is not Roles.Super_Admin:
            return jsonify({'message': 'Cannot delete in another organization'}), 403
        # check if the source exists in the database if it does then delete the source
        source = Models.Source.query.get(source_id)
        if Models.Source.query.get(source_id) is None:
            return jsonify({'message': 'Source does not exist'}), 404
        else:
            Models.db.session.delete(Models.Source.query.get(source_id))
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.DELETE_SOURCE, 'Deleted source: ' + source.name + ' in organization: ' + Models.Organization.query.get(item_id).name)
            return jsonify({'message': 'Source deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@organizationBlueprint.route('/<int:item_id>')
@organizationBlueprint.route('/')
def invalid_method(item_id = None):
    return jsonify({'message': 'Invalid Method'}), 405

