from marshmallow import fields
from marshmallow_enum import EnumField
from marshmallow_sqlalchemy import ModelSchema

from app.model.participant import Participant, Relationship
from app.model.user import User, Role


#  This package provides specialized schames to use during export and import to
# a mirrored system.  Define classes here as XXXExportSchema and they will be
# picked up bo the ExportService and used automatically.   If not defined here,
# the Export Service will first fall back to using a schema XXXSchema defined in
# the same module as the class to be marshaled. If this does not exist, it will
# check for a schema in the Schama module, a file located in the same directory as
# this file.


class UserExportSchema(ModelSchema):
    """ Used exclusively for data export, removes identifying information"""
    class Meta:
        model = User
        fields = ('id', 'last_updated', 'role', 'email_verified', 'email')
        ordered = True
        include_fk = True
    role = EnumField(Role)
    email = fields.Method("obfuscate_email")

    def obfuscate_email(self, obj):
        return obj.id


class ParticipantExportSchema(ModelSchema):
    """ Used exclusively for data export, removes identifying information"""
    class Meta:
        model = Participant
        fields = ('id', 'last_updated', 'user_id', 'relationship', 'avatar_icon', 'avatar_color')
        ordered = True
        include_fk = True
    relationship = EnumField(Relationship)