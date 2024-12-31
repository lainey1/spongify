from flask import Blueprint, request, jsonify
from app.models import db, Reservation, Restaurant
from flask_login import login_required, current_user

reservation_routes = Blueprint('reservations', __name__)


# Get all reservations of the current user
@reservation_routes.route('/user')
@login_required
def user_reviews():
    """
    Query for all reservations of the current user and returns them in a list of review dictionaries
    """
    reservations = Reservation.query.filter(Reservation.user_id == current_user.id).all()
    return {'reservations': [review.to_dict() for review in reservations]}

@reservation_routes.route('/restaurant/<int:restaurant_id>', methods=['GET'])
@login_required
def get_restaurant_reservations(restaurant_id):
    """
    Query for all reservations of a specific restaurant if the current user is the owner.
    """
    # Query for the restaurant
    restaurant = Restaurant.query.get(restaurant_id)

    # Check if the restaurant exists
    if not restaurant:
        return jsonify({'error': 'Restaurant not found'}), 404

    # Verify the current user is the owner of the restaurant
    if restaurant.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized access'}), 403

    # Fetch all reservations for the restaurant
    reservations = Reservation.query.filter_by(restaurant_id=restaurant_id).all()

    return jsonify({'reservations': [reservation.to_dict() for reservation in reservations]})
