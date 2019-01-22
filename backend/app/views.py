import urllib

import flask_restful
from flask import Blueprint, jsonify, url_for
from flask_restful import reqparse

from app import app
from app.resources.Auth import auth_blueprint
from app.resources.Tracking import tracking_blueprint
from app.resources.UserEndpoint import UserEndpoint, UserListEndpoint
from app.resources.StudyEndpoint import StudyEndpoint, StudyListEndpoint
from app.resources.SessionEndpoint import SessionEndpoint
from app.resources.CategoryEndpoint import (
    CategoryEndpoint,
    CategoryListEndpoint,
    RootCategoryListEndpoint
)
from app.resources.ResourceEndpoint import (
    ResourceEndpoint,
    ResourceListEndpoint
)
from app.resources.TrainingEndpoint import (
    TrainingEndpoint,
    TrainingListEndpoint
)
from app.resources.OrganizationEndpoint import (
    OrganizationEndpoint,
    OrganizationListEndpoint
)
from app.resources.StudyAndCategoryEndpoint import (
    StudyCategoryEndpoint,
    CategoryByStudyEndpoint,
    StudyByCategoryEndpoint,
    StudyCategoryListEndpoint
)
from app.resources.ResourceAndCategoryEndpoint import (
    ResourceCategoryEndpoint,
    CategoryByResourceEndpoint,
    ResourceByCategoryEndpoint,
    ResourceCategoryListEndpoint
)
from app.resources.TrainingAndCategoryEndpoint import (
    TrainingCategoryEndpoint,
    CategoryByTrainingEndpoint,
    TrainingByCategoryEndpoint,
    TrainingCategoryListEndpoint
)
from app.resources.ContactQuestionnaireEndpoint import (
    ContactQuestionnaireEndpoint,
    ContactQuestionnaireListEndpoint,
    ContactQuestionnaireMetaEndpoint
)
from app.resources.DemographicsQuestionnaireEndpoint import (
    DemographicsQuestionnaireEndpoint,
    DemographicsQuestionnaireListEndpoint
)
from app.resources.GuardianDemographicsQuestionnaireEndpoint import (
    GuardianDemographicsQuestionnaireEndpoint,
    GuardianDemographicsQuestionnaireListEndpoint
)


class StarDriveApi(flask_restful.Api):
    # Define a custom error handler for all rest endpoints that
    # properly handles the RestException status.
    def handle_error(self, e):
        response = jsonify(e.to_dict())
        response.status_code = e.status_code
        flask_restful.abort(e.status_code, response)


api_blueprint = Blueprint("api", __name__, url_prefix='/api')
api = StarDriveApi(api_blueprint)
app.register_blueprint(api_blueprint)
app.register_blueprint(auth_blueprint)
app.register_blueprint(tracking_blueprint)

parser = flask_restful.reqparse.RequestParser()
parser.add_argument('resource')


@app.route('/', methods=['GET'])
def root():
    output = {}
    for rule in app.url_map.iter_rules():
        options = {}
        for arg in rule.arguments:
            options[arg] = "<{0}>".format(arg)

        methods = ','.join(rule.methods)
        url = url_for(rule.endpoint, **options)
        output[rule.endpoint] = urllib.parse.unquote(url)

    return jsonify(output)


endpoints = [

    # Categories
    (CategoryListEndpoint, '/category'),
    (RootCategoryListEndpoint, '/category/root'),
    (CategoryEndpoint, '/category/<id>'),
    (ResourceByCategoryEndpoint, '/category/<category_id>/resource'),
    (StudyByCategoryEndpoint, '/category/<category_id>/study'),
    (TrainingByCategoryEndpoint, '/category/<category_id>/training'),

    # Organizations
    (OrganizationListEndpoint, '/organization'),
    (OrganizationEndpoint, '/organization/<id>'),

    # Resources
    (ResourceListEndpoint, '/resource'),
    (ResourceEndpoint, '/resource/<id>'),
    (CategoryByResourceEndpoint, '/resource/<resource_id>/category'),
    (ResourceCategoryListEndpoint, '/resource_category'),
    (ResourceCategoryEndpoint, '/resource_category/<id>'),

    # Studies
    (StudyListEndpoint, '/study'),
    (StudyEndpoint, '/study/<id>'),
    (CategoryByStudyEndpoint, '/study/<study_id>/category'),
    (StudyCategoryListEndpoint, '/study_category'),
    (StudyCategoryEndpoint, '/study_category/<id>'),

    # Trainings
    (TrainingListEndpoint, '/training'),
    (TrainingEndpoint, '/training/<id>'),
    (CategoryByTrainingEndpoint, '/training/<training_id>/category'),
    (TrainingCategoryListEndpoint, '/training_category'),
    (TrainingCategoryEndpoint, '/training_category/<id>'),

    # User Sessions
    (SessionEndpoint, '/session'),
    (UserListEndpoint, '/user'),
    (UserEndpoint, '/user/<id>'),

    # Questionnaires
    (ContactQuestionnaireListEndpoint, '/contact_questionnaire'),
    (ContactQuestionnaireEndpoint, '/contact_questionnaire/<id>'),
    (ContactQuestionnaireMetaEndpoint, '/contact_questionnaire/meta'),
    (DemographicsQuestionnaireListEndpoint, '/demographics_questionnaire'),
    (DemographicsQuestionnaireEndpoint, '/demographics_questionnaire/<id>'),
    (GuardianDemographicsQuestionnaireListEndpoint, '/guardian_demographics_questionnaire'),
    (GuardianDemographicsQuestionnaireEndpoint, '/guardian_demographics_questionnaire/<id>'),
]

# Add all endpoints to the API
for endpoint in endpoints:
    api.add_resource(endpoint[0], endpoint[1])
