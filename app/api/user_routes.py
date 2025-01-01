from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User
from app.forms import UserProfileForm


user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


# Update a profile
@user_routes.route('/<int:user_id>/profile/edit', methods=['PUT'])
@login_required
def update_profile(user_id):
    """
    Update a profile by ID
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'ResUserervation not found'}), 404

    # Ensure the user is the one who created the reservation or is not the owner of the restaurant
    if user_id != current_user.id and restaurant.owner_id != current_user.id:
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
