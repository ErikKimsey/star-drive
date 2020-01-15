from app.model.email_log import EmailLogSchema
import flask_restful
from app import db, auth
from app.model.resource_change_log import ResourceChangeLog
from app.schema.schema import ResourceChangeLogSchema
from app.model.user import Role
from app.wrappers import requires_roles


class ResourceChangeLogListEndpoint(flask_restful.Resource):

    emailLogsSchema = ResourceChangeLogSchema(many=True)

    @auth.login_required
    @requires_roles(Role.admin)
    def get(self):
        email_logs = db.session.query(ResourceChangeLog).all()
        return self.emailLogsSchema.dump(email_logs)


class ResourceChangeLogByUserEndpoint(flask_restful.Resource):

    @auth.login_required
    @requires_roles(Role.admin)
    def get(self, user_id):
        schema = ResourceChangeLogSchema(many=True)
        logs = db.session.query(ResourceChangeLog)\
            .filter(ResourceChangeLog.user_id == user_id)\
            .all()
        return schema.dump(logs)


class ResourceChangeLogByResourceEndpoint(flask_restful.Resource):

    @auth.login_required
    @requires_roles(Role.admin)
    def get(self, resource_id):
        schema = ResourceChangeLogSchema(many=True)
        logs = db.session.query(ResourceChangeLog)\
            .filter(ResourceChangeLog.resource_id == resource_id)\
            .all()
        return schema.dump(logs)
