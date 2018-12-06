from flask import jsonify, url_for, Blueprint
from app import app
import flask_restful
from flask_restful import reqparse

from app.resources.ResourceEndpoint import ResourceListEndpoint, ResourceEndpoint
from app.resources.StudyEndpoint import StudyListEndpoint, StudyEndpoint
from app.resources.TrainingEndpoint import TrainingListEndpoint, TrainingEndpoint
from app.resources.UserEndpoint import UserListEndpoint, UserEndpoint


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

parser = flask_restful.reqparse.RequestParser()
parser.add_argument('resource')


@app.route('/', methods=['GET'])
def root():
    _links = {"_links": {
        "resources": url_for("api.resourcelistendpoint"),
        "studies": url_for("api.studylistendpoint"),
        "trainings": url_for("api.traininglistendpoint"),
        "users": url_for("api.userlistendpoint")
    }}
    return jsonify(_links)


api.add_resource(ResourceListEndpoint, '/resource')
api.add_resource(ResourceEndpoint, '/resource/<id>')
api.add_resource(StudyListEndpoint, '/study')
api.add_resource(StudyEndpoint, '/study/<id>')
api.add_resource(TrainingListEndpoint, '/training')
api.add_resource(TrainingEndpoint, '/training/<id>')
api.add_resource(UserListEndpoint, '/user')
api.add_resource(UserEndpoint, '/user/<id>')
