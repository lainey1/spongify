from flask import Blueprint, jsonify, request
from app.forms import RestaurantForm
from app.models import Restaurant, db
from flask_login import login_required, current_user


restaurant_routes = Blueprint('restaurants', __name__)


@restaurant_routes.route('/')
def restaurants():
    """
    Query for all restaurants and returns them in a list of restaurant dictionaries.
    """
    restaurants = Restaurant.query.all()
    return {'restaurants': [restaurant.to_dict() for restaurant in restaurants]}

@restaurant_routes.route('/owner/<int:owner_id>')
def restaurants_by_owner(owner_id):
    """
    Query restaurants by owner ID. Returns list of dictionaries, where each dictionary represents a Restaurant.
    """

    restaurants_by_owner = Restaurant.query.filter_by(owner_id=owner_id).all()

    print(restaurants_by_owner)

    if not restaurants_by_owner:
        return {'error': f'No restaurants with an owner by ID {owner_id} found.'}, 404
    else:
        return {'restaurants': [restaurant.to_dict() for restaurant in restaurants_by_owner]}


@restaurant_routes.route('/<int:id>', methods=['GET', 'DELETE'])
def restaurant(id):
    """
    Handle GET and DELETE requests for a restaurant by ID.
    - GET: Query for a restaurant by ID and return it as a dictionary.
    - DELETE: Delete a restaurant by ID from the database.
    """
    restaurant = Restaurant.query.get(id)

    if not restaurant:
        return {'error': f'Restaurant with ID {id} not found.'}, 404

    if request.method == 'GET':
        return restaurant.to_dict(), 200

    if request.method == 'DELETE':
        db.session.delete(restaurant)
        db.session.commit()
        return {'message': f'Restaurant with ID {id} deleted successfully.'}, 200

@restaurant_routes.route('/new', methods=['POST'])
@login_required
def create_restaurant():
    """
    Query to add a restaurant to the DB
    """
    form = RestaurantForm()

    if form.validate_on_submit():
        # Create new restaurant
        new_restaurant = restaurants(
            name=form.name.data,
            address=form.address.data,
            city=form.city.data,
            state=form.state.data,
            country=form.country.data,
            phone_number=form.phone_number.data,
            email=form.email.data,
            website=form.website.data,
            cuisine=form.cuisine.data,
            price_point=form.price_point.data,
            description=form.description.data,
            monday_hours=form.monday_hours.data,
            tuesday_hours=form.tuesday_hours.data,
            wednesday_hours=form.wednesday_hours.data,
            thursday_hours=form.thursday_hours.data,
            friday_hours=form.friday_hours.data,
            saturday_hours=form.saturday_hours.data,
            sunday_hours=form.sunday_hours.data
        )

        db.session.add(new_restaurant)
        db.session.commit()
        return jsonify({
            'message': 'Restaurant added successfully!',
            'restaurant': new_restaurant.to_dict()
        }), 201

    # If form validation fails
    return jsonify({
        'message': 'Bad Data, please check your inputs',
        'errors': form.errors
    }), 400


@restaurant_routes.route('/update/<int:id>', methods=['POST']) 
@login_required
def update_restaurant(id):
    """
    Query to update a restaurant in the DB
    """
   
    restaurant = Restaurant.query.get(id)

    if restaurant is None:
        return jsonify({'message': 'Restaurant not found'}), 404

   
    if restaurant.owner_id != current_user.id:
        return jsonify({'message': 'You are not authorized to update this restaurant'}), 403

   
    form = RestaurantForm()

    if form.validate_on_submit():
        # Update the restaurant's details
        restaurant.name = form.name.data
        restaurant.address = form.address.data
        restaurant.city = form.city.data
        restaurant.state = form.state.data
        restaurant.country = form.country.data
        restaurant.phone_number = form.phone_number.data
        restaurant.email = form.email.data
        restaurant.website = form.website.data
        restaurant.cuisine = form.cuisine.data
        restaurant.price_point = form.price_point.data
        restaurant.description = form.description.data
        restaurant.monday_hours = form.monday_hours.data
        restaurant.tuesday_hours = form.tuesday_hours.data
        restaurant.wednesday_hours = form.wednesday_hours.data
        restaurant.thursday_hours = form.thursday_hours.data
        restaurant.friday_hours = form.friday_hours.data
        restaurant.saturday_hours = form.saturday_hours.data
        restaurant.sunday_hours = form.sunday_hours.data

        db.session.commit()

        
        return jsonify({
            'message': 'Restaurant updated successfully!',
            'restaurant': restaurant.to_dict()  
        }), 200

    
    return jsonify({
        'message': 'Bad Data, please check your inputs',
        'errors': form.errors
    }), 400