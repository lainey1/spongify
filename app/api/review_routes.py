from flask import Blueprint, request, jsonify
from app.models import db, Review
from flask_login import login_required, current_user

review_routes = Blueprint('reviews', __name__)

@review_routes.route('/')
def reviews():
    """
    Query for all reviews and returns them in a list of review dictionaries
    """
    reviews = Review.query.all()
    return {'reviews': [review.to_dict() for review in reviews]}
