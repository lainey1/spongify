from flask import Blueprint, jsonify, request
from app.forms import ImageForm
from app.models import Review, db, ReviewImage
from flask_login import current_user, login_required

review_image_routes = Blueprint('review_images', __name__)

@review_image_routes.route('/')
def all_images():
    """
    Query for all review images and return them in a list of image dictionaries.
    """
    images = ReviewImage.query.all()
    return {'review_images': [image.to_dict() for image in images]}



@review_image_routes.route('/review/<int:review_id>/images', methods=['GET','POST'])
@login_required
def upload_image(review_id):
    """
    Query to post and delete a review image.
    """
    review = Review.query.get(review_id)

    # Validate review existence
    if not review:
        return jsonify({"error": "Restaurant not found"}), 404

    # Handle GET request to fetch images
    if request.method == 'GET':
        images = ReviewImage.query.filter_by(review_id=review_id).all();
        if not images:
            return jsonify({"message": "No images found for this review"}), 404

        return jsonify({
            "review_id": review_id,
            "image": [image.url for image in images]
        }), 200


    # Handle POST request to upload images
    form = ImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # Validate form
    if not form.validate_on_submit():
        return jsonify({"error": "Invalid form submission", "errors": form.errors}), 400

    # Check for image data
    image_url = form.image_url.data
    is_preview = form.is_preview.data

    if not image_url:
        return jsonify({"error": "No image uploaded"}), 400

    # Process and save images
    try:
        if not image_url.startswith(('http://', 'https://')):
            return jsonify({"error": f"Invalid URL: {image_url}"}), 400

        review_image = ReviewImage(
            review_id=review.id,
            user_id=current_user.id,
            url=image_url,
            is_preview=is_preview
        )

        db.session.add(review_image)

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error saving images: {str(e)}"}), 500

    return jsonify({"message": "Image uploaded successfully",}), 200


@review_image_routes.route('/<int:image_id>', methods=['DELETE'])
@login_required
def delete_image(image_id):
    """
    Delete a review image by ID
    """
    image = ReviewImage.query.filter_by(id=image_id).first()

    if image:
        # Ensure the user is the one who created the image
        if image.user_id != current_user.id:
            return {'message': 'You are not authorized to delete this image.'}, 403

        db.session.delete(image)
        db.session.commit()

        return {'message': 'Image deleted successfully'}

    return {'error': 'Image not found.'}, 404
