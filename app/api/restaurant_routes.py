from flask import Blueprint, jsonify, redirect, render_template, flash
from app.models import Restaurant, db
from app.forms import NewRestaurant

restaurant_routes = Blueprint('restaurants', __name__)


@restaurant_routes.route('/')
def restaurants():
    """
    Query for all restaurants and returns them in a list of restaurant dictionaries
    """
    restaurants = Restaurant.query.all()
    return {'restaurants': [restaurant.to_dict() for restaurant in restaurants]}


@restaurant_routes.route('/<int:id>')
def restaurant(id):
    """
    Query for a restaurant by id and returns that restaurant in a dictionary
    """
    restaurant = Restaurant.query.get(id)
    return restaurant.to_dict()

@restaurant_routes.route('/restuarants/new', methods=['POST'])
def create_restaurant():
    """
    Query to add a restaurant to the DB
    """
    form = NewRestaurant()

    if form.validate_on_submit():
        new_restaurant = restaurants(
            name = form.name.data,
            address = form.address.data,
            city = form.city.data,
            state = form.state.data,
            country = form.country.data,
            phone_number = form.phone_number.data,
            email = form.email.data,
            website = form.website.data,
            cuisine = form.cuisine.data,
            price_point = form.price_point.data,
            description = form.description.data,
            monday_hours = form.monday_hours.data,
            tuesday_hours = form.tuesday_hours.data,
            wednesday_hours = form.wednesday_hours.data,
            thursday_hours = form.thursday_hours.data,
            friday_hours = form.friday_hours.data,
            saturday_hours = form.saturday_hours.data,
            sunday_hours = form.sunday_hours.data
            )
        

        db.session.add(new_restaurant)
        db.session.commit()
        flash("Restaurant added successfully!", "success")
        return redirect('/')
    
    flash("Bad Data, please check your inputs", "error")
    return new_restaurant

    


    
