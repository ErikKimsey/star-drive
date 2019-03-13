import datetime

from marshmallow_sqlalchemy import ModelSchema

from app import db


class Medication(db.Model):
    __tablename__ = "medication"
    __label__ = "Medication"
    id = db.Column(db.Integer, primary_key=True)
    last_updated = db.Column(db.DateTime, default=datetime.datetime.now)
    supports_questionnaire_id = db.Column(
        "supports_questionnaire_id",
        db.Integer,
        db.ForeignKey("supports_questionnaire.id"),
    )
    name = db.Column(
        db.String,
        info={
            "display_order": 1,
            "type": "textarea",
            "template_options": {
                "label": "Name of Medication or Vitamin",
                "required": True,
            },
        },
    )
    dosage = db.Column(
        db.String,
        info={
            "display_order": 2,
            "type": "textarea",
            "template_options": {"label": "Dosage", "required": False},
        },
    )
    time_frame = db.Column(
        db.String,
        info={
            "display_order": 3,
            "type": "radio",
            "default_value": True,
            "template_options": {
                "label": "",
                "required": False,
                "options": [
                    {"value": "current", "label": "Currently taking"},
                    {"value": "past", "label": "Received in the past"},
                    {"value": "futureInterest", "label": "Interested in receiving"},
                ],
            },
        },
    )
    notes = db.Column(
        db.String,
        info={
            "display_order": 4,
            "type": "textarea",
            "template_options": {
                "label": "Notes on use and/or issues with medication",
                "required": False,
            },
        },
    )

    def get_field_groups(self):
        return {}


class MedicationSchema(ModelSchema):
    class Meta:
        model = Medication
        fields = ("name", "dosage", "time_frame", "notes")