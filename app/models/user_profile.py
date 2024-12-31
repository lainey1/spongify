from .user import User
from datetime import datetime
from sqlalchemy.orm import validates
import re
from .db import db, environment, SCHEMA, add_prefix_for_prod

class UserProfile(db.Model):
    """
    Represents a detailed user profile linked to the User model. Includes location, cuisine preference, and a personal headline.
    """

    __tablename__ = 'user_profiles'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    cuisine = db.Column(db.String(100), nullable=True)
    headline = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = db.relationship('User', back_populates='user_profile')


    # TODO Future Enhancement - In your Profile model -
    # profile_image = db.relationship('ProfileImage', back_populates='profile')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'location': self.location,
            'cuisine': self.cuisine,
            'headline': self.headline,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            # TODO Placeholder for profile_image
            # 'profile_image': self.profile_image.to_dict() if self.profile_image else None,
        }

    @validates('location')
    def validate_location(self, key, location):
        """
        Validates that the location is in the format 'City, ST'.
        """
        pattern = r'^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*,\s?[A-Za-z]{2}$'  # Example regex for "City, ST"
        if not re.match(pattern, location):
            raise ValueError("Location must be in 'City, ST' format")
        return location

    @validates('cuisine')
    def validate_cuisine(self, key, cuisine):
        if cuisine and len(cuisine) > 100:
            raise ValueError("Cuisine must not exceed 100 characters.")
        return cuisine

    @validates('headline')
    def validate_headline(self, key, headline):
        if headline and len(headline) > 255:
            raise ValueError("Headline must not exceed 255 characters.")
        return headline
