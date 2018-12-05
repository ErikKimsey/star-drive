import flask_restful
from flask import request
from marshmallow import ValidationError

from app import RestException, db
from app.model.resource import StarResource
from app.resources.schema import StarResourceSchema


class ResourceEndpoint(flask_restful.Resource):

    schema = StarResourceSchema()

    def get(self, id):
        model = db.session.query(StarResource).filter_by(id=id).first()
        if model is None: raise RestException(RestException.NOT_FOUND)
        return self.schema.dump(model)

    def delete(self, id):
        db.session.query(StarResource).filter_by(id=id).delete()
        db.session.commit()
        return None

    def put(self, id):
        request_data = request.get_json()
        instance = db.session.query(StarResource).filter_by(id=id).first()
        updated, errors = self.schema.load(request_data, instance=instance)
        if errors: raise RestException(RestException.INVALID_OBJECT, details=errors)
        db.session.add(updated)
        db.session.commit()
        return self.schema.dump(updated)


class ResourceListEndpoint(flask_restful.Resource):

    resourcesSchema = StarResourceSchema(many=True)
    resourceSchema = StarResourceSchema()

    def get(self):
        resources = db.session.query(StarResource).all()
        return self.resourcesSchema.dump(resources)

    def post(self):
        request_data = request.get_json()
        try:
            load_result = self.resourceSchema.load(request_data).data
            db.session.add(load_result)
            db.session.commit()
            return self.resourceSchema.dump(load_result)
        except ValidationError as err:
            raise RestException(RestException.INVALID_OBJECT,
                                details=load_result.errors)