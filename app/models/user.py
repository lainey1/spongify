from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.orm import validates
import re


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(150), nullable=True)
    favorite_cuisine = db.Column(db.String(100), nullable=True)
    headline = db.Column(db.String(255), nullable=True)

    review_images = db.relationship('ReviewImage', back_populates='user')

    restaurant_images = db.relationship('RestaurantImage', back_populates='user')

    # TODO Future Enhancement - In your Profile model -
    # profile_image = db.relationship('ProfileImage', back_populates='profile')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @validates('location')
    def validate_location(self, key, location):
        """
        Validates that the location is in the format 'City, ST'.
        """
        pattern = r'^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*,\s?[A-Za-z]{2}$'  # Example regex for "City, ST"
        if not re.match(pattern, location):
            raise ValueError("Location must be in 'City, ST' format")
        return location

    @validates('favorite_cuisine')
    def validate_cuisine(self, key, favorite_cuisine):
        if favorite_cuisine and len(favorite_cuisine) > 100:
            raise ValueError("Cuisine must not exceed 100 characters.")
        return favorite_cuisine

    @validates('headline')
    def validate_headline(self, key, headline):
        if headline and len(headline) > 255:
            raise ValueError("Headline must not exceed 255 characters.")
        return headline


    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'location': self.location,
            'favorite_cuisine': self.favorite_cuisine,
            'headline': self.headline,
            # TODO Placeholder for profile_image
            # 'profile_image': self.profile_image.to_dict() if self.profile_image else None,
        }
