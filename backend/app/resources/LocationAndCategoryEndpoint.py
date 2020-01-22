import flask_restful
from flask import request
from marshmallow import ValidationError, EXCLUDE

from app import db, RestException
from app.model.category import Category
from app.model.location import Location
from app.model.resource_category import ResourceCategory
from app.schema.schema import LocationCategorySchema, CategoryLocationsSchema, LocationCategoriesSchema


class LocationByCategoryEndpoint(flask_restful.Resource):

    schema = CategoryLocationsSchema()

    def get(self, category_id):
        location_categories = db.session.query(ResourceCategory)\
            .join(ResourceCategory.resource)\
            .filter(ResourceCategory.category_id == category_id, ResourceCategory.type == 'location')\
            .order_by(Location.title)\
            .all()
        return self.schema.dump(location_categories, many=True)


class CategoryByLocationEndpoint(flask_restful.Resource):

    schema = LocationCategoriesSchema()

    def get(self, location_id):
        location_categories = db.session.query(ResourceCategory).\
            join(ResourceCategory.category).\
            filter(ResourceCategory.resource_id == location_id).\
            order_by(Category.name).\
            all()
        return self.schema.dump(location_categories,many=True)

    def post(self, location_id):
        request_data = request.get_json()
        try:
            location_categories = self.schema.load(request_data, many=True, unknown=EXCLUDE)
            db.session.query(ResourceCategory).filter_by(resource_id=location_id).delete()
            for c in location_categories:
                db.session.add(ResourceCategory(resource_id=location_id,
                               category_id=c.category_id, type='location'))
            db.session.commit()
            return self.get(location_id)
        except ValidationError as err:
            errors = err.messages
            raise RestException(RestException.INVALID_OBJECT, details=errors)


class LocationCategoryEndpoint(flask_restful.Resource):
    schema = LocationCategorySchema()

    def get(self, id):
        model = db.session.query(ResourceCategory).filter_by(id=id).first()
        if model is None: raise RestException(RestException.NOT_FOUND)
        return self.schema.dump(model)

    def delete(self, id):
        db.session.query(ResourceCategory).filter_by(id=id).delete()
        db.session.commit()
        return None


class LocationCategoryListEndpoint(flask_restful.Resource):
    schema = LocationCategorySchema()

    def post(self):
        request_data = request.get_json()
        try:
            load_result = self.schema.load(request_data, unknown=EXCLUDE)
            db.session.query(ResourceCategory).filter_by(resource_id=load_result.resource_id,
                                                         category_id=load_result.category_id).delete()
            db.session.add(load_result)
            db.session.commit()
            return self.schema.dump(load_result)
        except ValidationError as err:
            errors = err.messages
            raise RestException(RestException.INVALID_OBJECT, details=errors)
