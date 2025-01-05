from flask import Blueprint, jsonify, request
from app.forms import ImageForm
from app.models import Restaurant, db, RestaurantImage
from flask_login import current_user, login_required

restaurant_images = Blueprint('restaurant_images', __name__)

@restaurant_images.route('/')
def all_images():
    """
    Query for all restaurant images and return them in a list of image dictionaries.
    """
    images = RestaurantImage.query.all()
    return {'restaurant_images': [image.to_dict() for image in images]}



@restaurant_images.route('/restaurant/<int:restaurant_id>/images', methods=['GET','POST'])
@login_required
def upload_image(restaurant_id):
    """
    Query to post and delete a restaurant image.
    """
    restaurant = Restaurant.query.get(restaurant_id)

    # Validate restaurant existence
    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404

    # Handle GET request to fetch images
    if request.method == 'GET':
        images = RestaurantImage.query.filter_by(restaurant_id=restaurant_id).all()
        if not images:
            return jsonify({"message": "No images found for this restaurant"}), 404

        return jsonify({
            "restaurant_id": restaurant_id,
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

        restaurant_image = RestaurantImage(
            restaurant_id=restaurant.id,
            user_id=current_user.id,
            url=image_url,
            is_preview=is_preview
        )

        db.session.add(restaurant_image)

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error saving images: {str(e)}"}), 500

    return jsonify({"message": "Image uploaded successfully",}), 200


@restaurant_images.route('/<int:image_id>', methods=['DELETE'])
@login_required
def delete_image(image_id):
    """
    Delete a restaurant image by ID
    """
    image = RestaurantImage.query.filter_by(id=image_id).first()

    if image:
        # Ensure the user is the one who created the image or is the owner of the restaurant
        if image.user_id != current_user.id:
            return {'message': 'You are not authorized to delete this image.'}, 403

        db.session.delete(image)
        db.session.commit()

        return {'message': 'Image deleted successfully'}

    return {'error': 'Image not found.'}, 404



@restaurant_images.route('/<int:image_id>', methods=['PUT'])
@login_required
def update_image(image_id):
    """
    Update a restaurant image by ID
    """
    image = RestaurantImage.query.filter_by(id=image_id).first()

    if not image:
        return jsonify({"error": "Image not found"}), 404

    # Ensure the user is the one who created the image or is the owner of the restaurant
    if image.user_id != current_user.id or image.restaurant.owner_id != current_user.id:
        return jsonify({'message': 'You are not authorized to update this image.'}), 403

    form = ImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if not form.validate_on_submit():
        return jsonify({"error": "Invalid form submission", "errors": form.errors}), 400

    image_url = form.image_url.data
    is_preview = form.is_preview.data

    if image_url and not image_url.startswith(('http://', 'https://')):
        return jsonify({"error": f"Invalid URL: {image_url}"}), 400

    try:
        # Update the image attributes
        if image_url:
            image.url = image_url
        if is_preview is not None:
            image.is_preview = is_preview

        db.session.commit()
        return jsonify({"message": "Image updated successfully", "image": image.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error updating image: {str(e)}"}), 500