import flask_restful
from flask import request
from marshmallow import ValidationError, EXCLUDE
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload

from app import db, RestException
from app.model.category import Category
from app.schema.schema import CategorySchema, ParentCategorySchema


class CategoryEndpoint(flask_restful.Resource):
    schema = CategorySchema()

    def get(self, id):
        category = db.session.query(Category).filter(Category.id == id).first()
        if category is None: raise RestException(RestException.NOT_FOUND)
        return self.schema.dump(category)

    def delete(self, id):
        try:
            db.session.query(Category).filter(Category.id == id).delete()
        except IntegrityError as error:
            raise RestException(RestException.CAN_NOT_DELETE)
        return

    def put(self, id):
        request_data = request.get_json()
        instance = db.session.query(Category).filter_by(id=id).first()
        try:
            updated = self.schema.load(request_data, session=db.session, instance=instance, unknown=EXCLUDE)
            db.session.add(updated)
            return self.schema.dump(updated)
        except ValidationError as err:
            errors = err.messages
            raise RestException(RestException.INVALID_OBJECT, details=errors)


class CategoryListEndpoint(flask_restful.Resource):
    category_schema = CategorySchema()
    categories_schema = ParentCategorySchema(many=True)

    def get(self):
        categories = db.session.query(Category)\
            .options(joinedload(Category.children))\
            .order_by(Category.name)\
            .all()
        return self.categories_schema.dump(categories)

    def post(self):
        request_data = request.get_json()
        try:
            new_cat = self.category_schema.load(request_data, unknown=EXCLUDE)
            db.session.add(new_cat)
            db.session.commit()
            return self.category_schema.dump(new_cat)
        except ValidationError as err:
            errors = err.messages
            raise RestException(RestException.INVALID_OBJECT, details=errors)


class RootCategoryListEndpoint(flask_restful.Resource):
    categories_schema = CategorySchema(many=True)

    def get(self):
        categories = db.session.query(Category)\
            .filter(Category.parent_id == None)\
            .order_by(Category.name)\
            .all()
        return self.categories_schema.dump(categories)
