from flask import Blueprint, jsonify, request
from app.models import Restaurant, db
from app.forms import NewRestaurant
from flask_login import login_required

restaurant_routes = Blueprint('restaurants', __name__)


@restaurant_routes.route('/')
def restaurants():
    """
    Query for all restaurants and returns them in a list of restaurant dictionaries
    """
    restaurants = Restaurant.query.all()
    return jsonify([restaurants.to_dict() for restaurants in restaurants])


@restaurant_routes.route('/<int:id>')
def restaurant(id):
    """
    Query for a restaurant by id and returns that restaurant in a dictionary
    """
    restaurant = Restaurant.query.get(id)
    return restaurant.to_dict()

@restaurant_routes.route('/new', methods=['GET'])
def new_restaurant():
    form = NewRestaurant()

    # Prepare the form data to be returned as a dictionary
    form_data = {
        "name": form.name,
        "address": form.address,
        "city": form.city,
        "state": form.state,
        "country": form.country,
        "cuisine": form.cuisine,
        "description": form.description,
        "email": form.email,
        "phone_number": form.phone_number,
        "price_point": form.price_point,
        "website": form.website,
        "sunday_hours": form.sunday_hours,
        "monday_hours": form.monday_hours,
        "tuesday_hours": form.tuesday_hours,
        "wednesday_hours": form.wednesday_hours,
        "thursday_hours": form.thursday_hours,
        "friday_hours": form.friday_hours,
        "saturday_hours": form.saturday_hours
    }

    return jsonify(form_data)



@restaurant_routes.route('/new', methods=['POST'])
def create_restaurant():
    """
    Query to add a restaurant to the DB
    """
    form = NewRestaurant()

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



@restaurant_routes.route('/update/<int:id>', methods=['GET', 'POST'])
@login_required
def update_restaurant(id):
    """
    Query to update a restaurant 
    """
    restaurant = Restaurant.query.get(id)
    
    # If restaurant not found, return error
    if not restaurant:
        return {'error': f'Restaurant with ID {id} not found.'}, 404

    form = NewRestaurant(obj=restaurants)

    # Handling GET request to fetch the restaurant details
    if request.method == 'GET':
        return jsonify(restaurant.to_dict()), 200

    # Handling POST request to update the restaurant details
    if form.validate_on_submit():
        # Update the restaurant attributes with form data
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

        # Commit changes to the database
        db.session.commit()

        return jsonify({
            'message': 'Restaurant updated successfully!',
            'restaurant': restaurants.to_dict()
        }), 200  # Successful update should return 200 status

    # If form validation fails
    return jsonify({
        'message': 'Bad Data, please check your inputs',
        'errors': form.errors
    }), 400

    


    
