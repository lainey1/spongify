from datetime import datetime
from flask import Blueprint, request, jsonify
from app.models import db, Reservation, Restaurant
from app.forms import ReservationForm
from flask_login import login_required, current_user

reservation_routes = Blueprint('reservations', __name__)


# Function to validate the reservation data
def validate_reservation_data(data):
    try:
        # Ensure 'date' is in the correct datetime format
        date = datetime.strptime(data['date'], "%Y-%m-%dT%H:%M:%S")
        # Check if the date is valid
        if date < datetime.now():
            return {"error": "Reservation date cannot be in the past"}
        return None  # No errors, data is valid
    except ValueError:
        return {"error": "Invalid date format"}


# Get all reservations of the current user
@reservation_routes.route('/user')
@login_required
def user_reservations():
    """
    Query for all reservations of the current user and returns them in a list of reservation dictionaries
    """
    print(current_user.id)
    reservations = Reservation.query.filter(Reservation.user_id == current_user.id).all()
    return {'reservations': [reservation.to_dict() for reservation in reservations]}

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

@reservation_routes.route('/restaurant/<int:restaurant_id>/new', methods=['POST'])
@login_required
def create_reservation(restaurant_id):
    """
    Create a new reservation and return it as a reservation dictionary
    """
    form = ReservationForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Create a new reservation using the validated form data
        new_reservation = Reservation(
            user_id=current_user.id,
            restaurant_id=restaurant_id,
            date=form.date.data,
            party_size=form.party_size.data,
        )

        db.session.add(new_reservation)
        db.session.commit()

        return jsonify({
            'message': 'Reservation created successfully',
            'reservation': new_reservation.to_dict()
        }), 201

    # If form validation fails
    return jsonify({
        'message': 'Invalid reservation data',
        'errors': form.errors
    }), 400

# Update a reservation
@reservation_routes.route('/<int:reservation_id>', methods=['PUT'])
@login_required
def update_reservation(reservation_id):
    """
    Update a reservation by ID
    """
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'message': 'Reservation not found'}), 404

    # Ensure the user is the one who created the reservation or is not the owner of the restaurant
    if reservation.user_id != current_user.id and reservation.restaurant.owner_id != current_user.id:
        return jsonify({'message': 'You are not authorized to update this reservation'}), 403

    form = ReservationForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Update the reservation fields
        reservation.date = form.date.data
        reservation.party_size = form.party_size.data

        db.session.commit()

        return jsonify({
            'message': 'Reservation updated successfully',
            'reservation': reservation.to_dict()
        }), 200

    # If form validation fails
    return jsonify({
        'message': 'Invalid reservation data',
        'errors': form.errors
    }), 400


# Delete a reservation
@reservation_routes.route('/<int:reservation_id>', methods=['DELETE'])
@login_required
def delete_reservation(reservation_id):
    """
    Delete a reservation by ID
    """
    reservation = Reservation.query.get(reservation_id)
    if reservation:
        # Ensure the user is the one who created the reservation or is not the owner of the restaurant
        if reservation.user_id != current_user.id and reservation.restaurant.owner_id != current_user.id:
            return {'message': 'You are not authorized to delete this reservation'}, 403

        db.session.delete(reservation)
        db.session.commit()
        return {'message': 'Reservation deleted successfully'}, 200

    return {'error': 'Reservation not found'}, 404
