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

# Get all reviews of the current user
@review_routes.route('/user')
@login_required
def user_reviews():
    """
    Query for all reviews of the current user and returns them in a list of review dictionaries
    """
    reviews = Review.query.filter(Review.user_id == current_user.id).all()
    return {'reviews': [review.to_dict() for review in reviews]}

# Get all reviews of a specific restaurant
@review_routes.route('/restaurant/<int:restaurant_id>')
def restaurant_reviews(restaurant_id):
    """
    Query for all reviews of a specific restaurant and returns them in a list of review dictionaries
    """
    reviews = Review.query.filter(Review.restaurant_id == restaurant_id).all()
    return {'reviews': [review.to_dict() for review in reviews]}

# Get a specific review
@review_routes.route('/<int:review_id>')
def review(review_id):
    """
    Query for a specific review and returns it as a review dictionary
    """
    review = Review.query.get(review_id)
    return review.to_dict()

# Create a new review
@review_routes.route('/', methods=['POST'])
@login_required
def create_review():
    """
    Create a new review and return it as a review dictionary
    """
    data = request.json
    review = Review(
        user_id=current_user.id,
        restaurant_id=data['restaurant_id'],
        rating=data['rating'],
        body=data['body']
    )
    db.session.add(review)
    db.session.commit()
    return review.to_dict()