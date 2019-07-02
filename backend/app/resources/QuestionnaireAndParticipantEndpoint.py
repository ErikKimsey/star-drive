import flask_restful

from app import db, auth
from app.model.user import Role
from app.wrappers import requires_roles

# The Questionnaire by Participant Endpoint expects a "type" that is the exact Class name of a file
# located in the Questionnaire Package. It should have the following properties:
#   * It is saved in a snaked cased file of the same name as the class.
#   * It extends db.Model
#   * it has an id field called "id"
#   * It has a date field called "last_updated"
#   * When calling the endpoint, use the snakecase format of the name.
from app.question_service import QuestionService


class QuestionnaireByParticipantEndpoint(flask_restful.Resource):

    @auth.login_required
    @requires_roles(Role.admin)
    def get(self, name, participant_id):
        class_ref = QuestionService.get_class(name)
        schema = QuestionService.get_schema(name, many=True)
        questionnaires = db.session.query(class_ref)\
            .filter(class_ref.participant_id == participant_id)\
            .all()
        return schema.dump(questionnaires)

