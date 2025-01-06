from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


# class Reservation(db.Model):
#     __tablename__ = 'reservations'

#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     restaurant_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('restaurants.id')), nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
#     date = db.Column(db.String, nullable=False)
#     party_size = db.Column(db.Integer, nullable=False)


#     def to_dict(self):
#         return {
#             'id': self.id,
#             'restaurant_id': self.restaurant_id,
#             'user_id': self.user_id,
#             'date': self.date,
#             'party_size': self.party_size,
#         }
class Reservation(db.Model):
    __tablename__ = 'reservations'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('restaurants.id')), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    date = db.Column(db.TIMESTAMP, nullable=False)
    party_size = db.Column(db.Integer, nullable=False)

    restaurant = db.relationship('Restaurant', backref='reservations')
    user = db.relationship('User', backref='reservations')

    def to_dict(self):
        return {
            'id': self.id,
            'restaurant_id': self.restaurant_id,
            'user_id': self.user_id,
            'date': self.date.strftime('%Y-%m-%dT%H:%M'),
            'party_size': self.party_size,
            'name': self.restaurant.name if self.restaurant else None,
            'username': self.user.username if self.user else None
        }
