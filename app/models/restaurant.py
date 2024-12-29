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
            'description': self.description
        }

        # If a form is provided, add hours data to the dictionary
        if form:
            restaurants_dict['hours'] = {
                'monday': form.monday_hours.data,
                'tuesday': form.tuesday_hours.data,
                'wednesday': form.wednesday_hours.data,
                'thursday': form.thursday_hours.data,
                'friday': form.friday_hours.data,
                'saturday': form.saturday_hours.data,
                'sunday': form.sunday_hours.data
            }
        else:
            # If no form is provided, return the hours stored in the database
            restaurants_dict['hours'] = self.hours
        
        return restaurants_dict