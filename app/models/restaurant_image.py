from .user import User
from .restaurant import Restaurant
from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod

class RestaurantImage(db.Model):
    __tablename__ = 'restaurant_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('restaurants.id')), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    url = db.Column(db.String, nullable=False)
    is_preview = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


    restaurant = db.relationship('Restaurant', back_populates='restaurant_images')

    user = db.relationship('User', back_populates='restaurant_images', lazy='joined')

    def to_dict(self):
        return {
            'id': self.id,
            'restaurant_id': self.restaurant_id,
            'user_id': self.user_id,
            'url': self.url,
            'is_preview': self.is_preview,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            # 'restaurant': self.restaurant.to_dict() if self.restaurant else None,
            'user': self.user.to_dict() if self.user else None
        }
