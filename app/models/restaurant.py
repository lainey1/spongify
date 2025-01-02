from .user import User
from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Restaurant(db.Model):
    __tablename__ = 'restaurants'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String(95), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(15), nullable=True)
    email = db.Column(db.String(255), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    hours = db.Column(db.JSON, nullable=True)
    cuisine = db.Column(db.String(50), nullable=True)
    price_point = db.Column(db.Integer, nullable=True)
    description = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    restaurant_images = db.relationship('RestaurantImage', back_populates='restaurant')

    def to_dict(self, form=None):
        # Initialize the dictionary with all other fields
        restaurants_dict = {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'phone_number': self.phone_number,
            'email': self.email,
            'website': self.website,
            'cuisine': self.cuisine,
            'price_point': self.price_point,
            'description': self.description,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }

        # If no form is provided, return the hours stored in the database
        if form:
            restaurants_dict['hours'] = {
                'Monday': [form.monday_open.data, form.monday_close.data],
                'Tuesday': [form.tuesday_open.data, form.tuesday_close.data],
                'Wednesday': [form.wednesday_open.data, form.wednesday_close.data],
                'Thursday': [form.thursday_open.data, form.thursday_close.data],
                'Friday': [form.friday_open.data, form.friday_close.data],
                'Saturday': [form.saturday_open.data, form.saturday_close.data],
                'Sunday': [form.sunday_open.data, form.sunday_close.data],
            }
        else:
            # If no form is provided, handle hours correctly (e.g., ['Closed', 'Closed'] for closed days)
            restaurants_dict['hours'] = {day: self.hours.get(day, ['Closed', 'Closed']) for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}


        return restaurants_dict
