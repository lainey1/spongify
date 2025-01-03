from flask import Blueprint, request, jsonify
from app.models import db, Review
from app.forms import ReviewForm
from flask_login import login_required, current_user

review_routes = Blueprint('reviews', __name__)

# Get all reviews
@review_routes.route('/')
def reviews():
    """
    Query for all reviews and returns them in a list of review dictionaries
    """
    reviews = Review.query.all()
    if not reviews:
        return jsonify({'message': 'No reviews found'}), 404
    
    return jsonify({'reviews': [review.to_dict() for review in reviews]}), 200

# Get all reviews of the current user
@review_routes.route('/user')
@login_required
def user_reviews():
    """
    Query for all reviews of the current user and returns them in a list of review dictionaries
    """
    reviews = Review.query.filter(Review.user_id == current_user.id).all()
    if not reviews:
        return jsonify({'message': 'No reviews found'}), 404
    
    return jsonify({'reviews': [review.to_dict() for review in reviews]}), 200

# Get all reviews of a specific restaurant
@review_routes.route('/restaurant/<int:restaurant_id>')
def restaurant_reviews(restaurant_id):
    """
    Query for all reviews of a specific restaurant and returns them in a list of review dictionaries
    """
    reviews = Review.query.filter(Review.restaurant_id == restaurant_id).all()
    if not reviews:
        return jsonify({'message': 'No reviews found'}), 404
    
    return jsonify({'reviews': [review.to_dict() for review in reviews]}), 200

# Get a specific review
@review_routes.route('/<int:review_id>')
def review(review_id):
    """
    Query for a specific review and returns it as a review dictionary
    """
    review = Review.query.get(review_id)
    if not review:
        return jsonify({'message': 'Review not found'}), 404
    
    return jsonify({'review': review.to_dict()}), 200

# Create a new review
@review_routes.route('/restaurant/<int:restaurant_id>/new', methods=['POST'])
@login_required
def create_review(restaurant_id):
    """
    Create a new review and return it as a review dictionary
    """
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    print(form.data)

    if form.validate_on_submit():
        # Create new review
        new_review = Review(
            user_id=current_user.id,
            restaurant_id=restaurant_id,
            review=form.data['review_text'],
            stars=form.data['stars']
        )

        # print(new_review.to_dict())

        db.session.add(new_review)
        db.session.commit()
        return jsonify({
            'message': 'Review created successfully',
            'review': new_review.to_dict()
        }), 201
    
    # If form validation fails
    return jsonify({
        'message': 'Invalid review data',
        'errors': form.errors
    }), 401

# Update a review
@review_routes.route('/<int:review_id>', methods=['PUT'])
@login_required
def update_review(review_id):
    """
    Update a review by ID
    """
    review = Review.query.get(review_id)
    if not review:
        return jsonify({'message': 'Review not found'}), 404
    
    if review.user_id != current_user.id:
        return jsonify({'message': 'You are not authorized to update this review'}), 403
    
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        review.review = form.data['review_text']
        review.stars = form.data['stars']
        db.session.commit()
        return jsonify({
            'message': 'Review updated successfully',
            'review': review.to_dict()
        }), 200
    
    # If form validation fails
    return jsonify({
        'message': 'Invalid review data',
        'errors': form.errors
    }), 401

# Delete a review
@review_routes.route('/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    """
    Delete a review by ID
    """
    review = Review.query.get(review_id)
    if not review:
        return jsonify({'message': 'Review not found'}), 404
    
    if review.user_id != current_user.id:
        return jsonify({'message': 'You are not authorized to delete this review'}), 403
    
    if review:
        db.session.delete(review)
        db.session.commit()
        return jsonify({'message': 'Review deleted successfully'}), 200
    
    return jsonify({'error': 'Something went wrong'}), 500