import datetime

from marshmallow_sqlalchemy import ModelSchema

from app import db
from app.question_service import QuestionService


class EmploymentQuestionnaire(db.Model):
    __tablename__ = 'employment_questionnaire'
    __label__ = "Employment"
    __question_type__ = QuestionService.TYPE_UNRESTRICTED
    __estimated_duration_minutes__ = 2

    id = db.Column(db.Integer, primary_key=True)
    last_updated = db.Column(db.DateTime, default=datetime.datetime.now)
    time_on_task_ms = db.Column(db.BigInteger, default=0)

    participant_id = db.Column(
        'participant_id',
        db.Integer,
        db.ForeignKey('stardrive_participant.id')
    )
    user_id = db.Column(
        'user_id',
        db.Integer,
        db.ForeignKey('stardrive_user.id')
    )
    is_currently_employed = db.Column(
        db.Boolean,
        info={
            'display_order': 1.1,
            'type': 'radio',
            'template_options': {
                'label': 'Are you currently employed?',
                'required': False,
                'options': [
                    {'value': True, 'label': 'Yes'},
                    {'value': False, 'label': 'No'}
                ]
            }
        }
    )
    employment_capacity = db.Column(
        db.String,
        info={
            'display_order': 1.2,
            'type': 'radio',
            'default_value': True,
            'template_options': {
                'label': 'In what capacity?',
                'required': False,
                'options': [
                    {'value': 'fullTime', 'label': 'Full time (At least 35 hours per week)'},
                    {'value': 'partTime', 'label': 'Part time (0-34 hours per week)'}
                ]
            },
            'hide_expression': '!(model.is_currently_employed)',
        }
    )
    has_employment_support = db.Column(
        db.Boolean,
        info={
            'display_order': 2,
            'type': 'radio',
            'template_options': {
                'label': 'Do you currently receive supports to help you work successfully, such as job coaching or '
                         'vocational training?',
                'required': False,
                'options': [
                    {'value': True, 'label': 'Yes'},
                    {'value': True, 'label': 'No, but I am interested'},
                    {'value': False, 'label': 'No'}
                ]
            }
        }
    )

    def get_field_groups(self):
        return {}


class EmploymentQuestionnaireSchema(ModelSchema):
    class Meta:
        model = EmploymentQuestionnaire
        fields = ('id', 'last_updated', 'participant_id', 'user_id', 'is_currently_employed', 'employment_capacity',
                  'has_employment_support')