from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy


class Reservation(db.Model, UserMixin):
    __tablename__ = 'reservations'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('restaurants.id')), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    party_size = db.Column(db.Integer, nullable=False)


    def to_dict(self):
        return {
            'id': self.id,
            'restaurant_id': self.restaurant_id,
            'user_id': self.user_id,
            'date': self.datetime.isoformat(),
            'party_size': self.party_size,
        }
