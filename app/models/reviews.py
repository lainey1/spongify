from .user import User
from .restaurant import Restaurant
from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('restaurants.id')), nullable=False)
    review = db.Column(db.String, nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # In your Review model
    review_images = db.relationship('ReviewImage', back_populates='review')
    # users = db.relationship('User', backref='reviews')
    # restaurants = db.relationship('Restaurant', backref='reviews')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'restaurant_id': self.restaurant_id,
            'review': self.review,
            'stars': self.stars,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            # 'user': {
            #     'id': self.user.id,
            #     'username': self.user.username,
            #     'email': self.user.email  # Adjust with desired fields
            # } if self.user else None,
            # 'restaurant': {
            #     'id': self.restaurant.id,
            #     'name': self.restaurant.name  # Adjust with desired fields
            # } if self.restaurant else None,
        }