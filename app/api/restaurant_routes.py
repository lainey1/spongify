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

    # Check if the current user is the owner of the restaurant
    if restaurant.owner_id != current_user.id:
        return {'error': 'You are not authorized to delete this restaurant.'}, 403

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
    Query to add a restaurant to the DB using either JSON or Form data
    """
    if request.is_json:
        # Handle JSON input (from Postman)
        data = request.get_json()

        try:
            new_restaurant = Restaurant(
                owner_id=current_user.id,
                name=data['name'],
                address=data['address'],
                city=data['city'],
                state=data['state'],
                country=data['country'],
                phone_number=data.get('phone_number'),
                email=data.get('email'),
                website=data.get('website'),
                cuisine=data.get('cuisine'),
                price_point=data.get('price_point'),
                description=data.get('description'),
                hours=data['hours']  # Directly assign hours from the JSON
            )

            db.session.add(new_restaurant)
            db.session.commit()

            return jsonify(new_restaurant.to_dict()), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    else:
        # Handle form input (when you're using the Flask form later)
        form = RestaurantForm()
        form['csrf_token'].data = request.cookies['csrf_token']

        if form.validate_on_submit():
            try:
                new_restaurant = Restaurant(
                    owner_id=current_user.id,
                    name=form.name.data,
                    address=form.address.data,
                    city=form.city.data,
                    state=form.state.data,
                    country=form.country.data,
                    phone_number=form.phone_number.data,
                    email=form.email.data,
                    website=form.website.data,
                    cuisine=form.cuisine.data,
                    price_point=int(form.price_point.data),
                    description=form.description.data,
                    hours={
                        "Monday": [form.monday_open.data, form.monday_close.data],
                        "Tuesday": [form.tuesday_open.data, form.tuesday_close.data],
                        "Wednesday": [form.wednesday_open.data, form.wednesday_close.data],
                        "Thursday": [form.thursday_open.data, form.thursday_close.data],
                        "Friday": [form.friday_open.data, form.friday_close.data],
                        "Saturday": [form.saturday_open.data, form.saturday_close.data],
                        "Sunday": [form.sunday_open.data, form.sunday_close.data],
                    }
                )

                db.session.add(new_restaurant)
                db.session.commit()

                return jsonify(new_restaurant.to_dict()), 201

            except Exception as e:
                return jsonify({"error": str(e)}), 500
        else:
            return jsonify({"errors": form.errors}), 400
