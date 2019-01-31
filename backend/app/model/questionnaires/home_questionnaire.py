import datetime

from marshmallow_sqlalchemy import ModelSchema

from app import db
from app.model.questionnaires.housemate import Housemate


class HomeQuestionnaire(db.Model):
    __tablename__ = 'home_questionnaire'
    id = db.Column(db.Integer, primary_key=True)
    last_updated = db.Column(db.DateTime, default=datetime.datetime.now)
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
    self_living_situation = db.Column(
        db.String,
        info={
            'display_order': 1.1,
            'type': 'multicheckbox',
            'class_name': 'vertical-checkbox-group',
            'template_options': {
                'required': True,
                'label': 'Where do you currently live? (select all that apply)',
                'options': [
                    {'value': 'alone', 'label': 'On my own'},
                    {'value': 'spouse', 'label': 'With a spouse or significant other'},
                    {'value': 'family', 'label': 'With my family'},
                    {'value': 'roommates', 'label': 'With roommates'},
                    {'value': 'caregiver', 'label': 'With a paid caregiver'},
                    {'value': 'livingOther', 'label': 'self_living_situation'}
                ]
            }
        }
    )
    self_living_other = db.Column(
        db.String,
        info={
            'display_order': 1.2,
            'type': 'input',
            'template_options': {
                'placeholder': 'Describe your current living situation'
            },
            'hide_expression': '!(model.self_living_situation && (model.self_living_situation === "livingOther"))',
        }
    )
    dependent_living_situation = db.Column(
        db.String,
        info={
            'display_order': 2.1,
            'type': 'multicheckbox',
            'class_name': 'vertical-checkbox-group',
            'template_options': {
                'required': True,
                'label': '',
                'options': [
                    {'value': 'fullTimeGuardian', 'label': 'With me full-time'},
                    {'value': 'partTimeGuardian', 'label': 'With me part time'},
                    {'value': 'otherFamily', 'label': 'With other parent/guardian/family member '},
                    {'value': 'residentialFacility', 'label': 'Residential facility'},
                    {'value': 'groupHome', 'label': 'Group home'},
                    {'value': 'livingOther', 'label': 'Other (please explain)'}
                ]
            },
            'expression_properties': {
                'template_options.label': '"Where does " + (model.nickname || model.first_name || "your child") + " currently live (select all that apply)?"'
            }
        }
    )
    dependent_living_other = db.Column(
        db.String,
        info={
            'display_order': 2.2,
            'type': 'input',
            'template_options': {
                'placeholder': ''
            },
            'hide_expression': '!(model.dependent_living_situation && model.dependent_living_situation.livingOther)',
            'expression_properties': {
                'template_options.placeholder': '"Please describe "+ (model.nickname || model.first_name || "your child") + "\'s current living situation"'
            }
        }
    )
    housemates = db.relationship(
        "Housemate",
        backref=db.backref('home_questionnaire', lazy=True),
        info={
            'display_order': 3,
            'type': 'repeat',
            'template_options': {
                'required': False,
                'label': 'Who else lives there?'
            },
            'expression_properties': {
                'template_options.label': '"Who else lives with " + (model.is_self ? "you" : (model.nickname || model.first_name || "your child")) + "?"'
            }
        }
    )
    struggle_to_afford = db.Column(
        db.Boolean,
        info={
            'display_order': 4,
            'type': 'radio',
            'default_value': True,
            'template_options': {
                'required': False,
                'label': 'Do you ever struggle with being able to afford to pay for household needs, food, or security?',
                'options': [
                    {'value': True, 'label': 'Yes'},
                    {'value': False, 'label': 'No'}
                ]
            },
            'expression_properties': {
                'template_options.label': '"Do you " + (!model.is_self ? "or " + (model.nickname || model.first_name || "your child") + "\'s other caregivers" : "") + " ever struggle with being able to afford to pay for household needs, food, or security" + (!model.is_self ? " for the family" : "") + "?"'
            }
        }
    )

    def get_meta(self):
        info = {
            'table': {'sensitive': False,
                      'label': 'Home'
                      },
            'field_groups': {
                'self_living': {
                    'fields': [
                        'self_living_situation',
                        'self_living_other'
                    ],
                    'display_order': 1,
                    'wrappers': ['card'],
                    'template_options': {'label': 'Current Living Situation'},
                    'hide_expression': '!model.is_self'
                },
                'dependent_living': {
                    'fields': [
                        'dependent_living_situation',
                        'dependent_living_other'
                    ],
                    'display_order': 2,
                    'wrappers': ['card'],
                    'template_options': {'label': 'Current Living Situation'},
                    'hide_expression': 'model.is_self'
                },
                'housemates': {
                    'type': 'repeat',
                    'display_order': 3,
                    'wrappers': ['card'],
                    'template_options': {
                        'label': 'Who else lives there?',
                        'description': 'Add a housemate',
                    },
                    'expression_properties': {
                        'template_options.label': '"Who else lives with " + (model.is_self ? "you" : (model.nickname || model.first_name || "your child")) + "?"'
                    }
                }
            }
        }
        for c in self.metadata.tables['home_questionnaire'].columns:
            if c.info:
                info[c.name] = c.info

        info['housemates'] = Housemate().get_meta()

        return info


class HomeQuestionnaireSchema(ModelSchema):
    class Meta:
        model = HomeQuestionnaire
        fields = ('id', 'last_updated', 'participant_id', 'user_id', 'self_living_situation', 'self_living_other',
                  'dependent_living_situation', 'dependent_living_other', 'housemates', 'struggle_to_afford')


class HomeQuestionnaireMetaSchema(ModelSchema):
    class Meta:
        model = HomeQuestionnaire
        fields = ('get_meta',)
