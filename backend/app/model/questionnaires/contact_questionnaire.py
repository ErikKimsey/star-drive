import datetime

from marshmallow_sqlalchemy import ModelSchema

from app import db


class ContactQuestionnaire(db.Model):
    __tablename__ = 'contact_questionnaire'
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
    phone = db.Column(
        db.String,
        info={
            'display_order': 1.1,
            'type': 'input',
            'template_options': {
                'required': True,
                'type': 'tel',
                'label': 'Preferred phone number (including area code)',
            },
            'validators': {
                'validation': ['phone']
            }
        }
    )
    phone_type = db.Column(
        db.String,
        info={
            'display_order': 1.2,
            'type': 'radio',
            'template_options': {
                'label': '',
                'placeholder': '',
                'description': '',
                'required': True,
                'options': [
                    {'value': 'home', 'label': 'Home'},
                    {'value': 'cell', 'label': 'Cell'}
                ]
            }
        }
    )
    can_leave_voicemail = db.Column(
        db.Boolean,
        info={
            'display_order': 1.3,
            'type': 'radio',
            'default_value': True,
            'template_options': {
                'label': 'Is it okay to leave a voicemail message at this number?',
                'required': False,
                'options': [
                    {'value': True, 'label': 'Yes'},
                    {'value': False, 'label': 'No'}
                ]
            }
        }
    )
    contact_times = db.Column(
        db.String,
        info={
            'display_order': 1.4,
            'type': 'textarea',
            'template_options': {
                'label': 'Some research studies might involve a phone call. '
                         'If that’s the case, when would be the best times '
                         'of day to call you?',
                'required': False,
            },
        }
    )
    email = db.Column(
        db.String,
        info={
            'display_order': 2,
            'type': 'input',
            'template_options': {
                'label': 'Email',
                'type': 'email',
                'required': True,
            },
            'validators': {
                'validation': ['email'],
            },
        }
    )
    street_address = db.Column(
        db.String,
        info={
            'display_order': 3.1,
            'type': 'input',
            'template_options': {
                'label': 'Street Address',
                'required': True
            }
        }
    )
    city = db.Column(
        db.String,
        info={
            'display_order': 3.2,
            'type': 'input',
            'template_options': {
                'label': 'Town/City',
                'required': False
            }
        }
    )
    state = db.Column(
        db.String,
        info={
            'display_order': 3.3,
            'type': 'input',
            'template_options': {
                'label': 'State',
                'required': False
            }
        }
    )
    zip = db.Column(
        db.Integer,
        info={
            'display_order': 3.4,
            'type': 'input',
            'template_options': {
                'type': 'number',
                'label': 'Zip',
                'max': 99999,
                'min': 0,
                'pattern': '\\d{5}',
                'required': True
            }
        }
    )
    marketing_channel = db.Column(
        db.String,
        info={
            'display_order': 4.1,
            'type': 'radio',
            'class_name': 'vertical-radio-group',
            'template_options': {
                'label': '',
                'placeholder': '',
                'description': '',
                'required': True,
                'options': [
                    {'value': 'internet', 'label': 'Internet'},
                    {'value': 'health_care_provider', 'label': 'Health care provider (doctor, speech therapist, etc)'},
                    {'value': 'school', 'label': 'Teacher or school'},
                    {'value': 'word_of_mouth', 'label': 'Word of mouth (friend, family member, etc)'},
                    {'value': 'community_event', 'label': 'Community event (autism walk, resource fair, etc.)'},
                    {'value': 'media', 'label': 'Television or radio (CNN, NPR, local news, etc.)'},
                    {'value': 'research_study', 'label': 'While participating in a research study'},
                    {'value': 'other', 'label': 'Other'},
                ]
            }
        }
    )
    marketing_other = db.Column(
        db.String,
        info={
            'display_order': 4.2,
            'type': 'input',
            'template_options': {
                'placeholder': 'Where did you hear about us?'
            },
            'hide_expression': '!(model.marketing_channel && (model.marketing_channel === "other"))',
        }
    )

    def get_meta(self):
        info = {
            'table': {
                'sensitive': 'false',
                'label': 'Research Registrant Contact Information',
                'description': 'Please answer the following questions about YOURSELF (* indicates required response):'
            },
            'field_groups': {
                'phone': {
                    'fields': [
                        'phone',
                        'phone_type',
                        'can_leave_voicemail',
                        'contact_times'
                    ],
                    'display_order': 1,
                    'wrappers': ['card'],
                    'template_options': {'label': 'Phone'},
                },
                'address': {
                    'fields': [
                        'street_address',
                        'city',
                        'state',
                        'zip'
                    ],
                    'display_order': 3,
                    'wrappers': ['card'],
                    'template_options': {'label': 'Address'},
                },
                'marketing': {
                    'fields': [
                        'marketing_channel',
                        'marketing_other'
                    ],
                    'display_order': 4,
                    'wrappers': ['card'],
                    'template_options': {'label': 'How did you hear about us?'},
                }
            }
        }

        for c in self.metadata.tables['contact_questionnaire'].columns:
            if c.info:
                info[c.name] = c.info

        return info


class ContactQuestionnaireSchema(ModelSchema):
    class Meta:
        model = ContactQuestionnaire
        fields = ('id', 'last_updated', 'user_id', 'phone', 'phone_type', 'can_leave_voicemail', 'contact_times',
                  'email', 'street_address', 'city', 'state', 'zip', 'marketing_channel')


class ContactQuestionnaireMetaSchema(ModelSchema):
    class Meta:
        model = ContactQuestionnaire
        fields = ('get_meta',)
