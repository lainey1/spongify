from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User
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


@user_routes.route('/<int:user_id>', methods=['PUT'])
@login_required
def update_profile(user_id):
    """
    Update a profile by ID
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Ensure the current user is the profile owner
    if user_id != current_user.id:
        return jsonify({'message': 'You are not authorized to update this user profile'}), 403

    form = UserProfileForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        user.location = form.location.data
        user.favorite_cuisine = form.favorite_cuisine.data
        user.headline = form.headline.data

        db.session.commit()

        return jsonify({
            'message': 'User profile updated successfully',
            'user': user.to_dict()
        }), 200

    # If form validation fails
    return jsonify({
        'message': 'Invalid user data',
        'errors': form.errors
    }), 400
