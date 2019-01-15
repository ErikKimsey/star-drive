import datetime

from app import db


class Organization(db.Model):
    __tablename__ = 'organization'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    last_updated = db.Column(db.DateTime, default=datetime.datetime.now)
    description = db.Column(db.String)
    resources = db.relationship(
        'StarResource', backref=db.backref('organization', lazy=True))
    studies = db.relationship(
        'Study', backref=db.backref('organization', lazy=True))
    trainings = db.relationship(
        'Training', backref=db.backref('organization', lazy=True))