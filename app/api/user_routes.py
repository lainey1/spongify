from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User, db, Reservation, RestaurantImage, ReviewImage

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    
    if users:
        return {'users': [user.to_dict() for user in users]}
    return {"error": "User not found."}, 404


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)

    if user: 
        return user.to_dict()
    return {"error": "User not found."}, 404

@user_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_user(id):
    """
    Deletes a user by id and returns a success message.
    """
    user = User.query.get(id)

    if user != current_user:
        return {"error": "User not found."}, 404
    else:
        db.session.delete(user)
        db.session.commit()
        return {"message": f"User with id {id} has been deleted."}, 200
    
