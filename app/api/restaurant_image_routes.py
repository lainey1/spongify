from flask import Blueprint, jsonify, request
from app.forms import RestaurantForm
from app.models import Restaurant, db, RestaurantImage
import os, random, string
from werkzeug.utils import secure_filename
from flask_login import current_user, login_required


restaurant_images = Blueprint('restaurant_images', __name__)  

@restaurant_images.route('/')
def all_images():
    """
    Query for all restaurant images and return them in a list of image dictionaries.
    """
    images = RestaurantImage.query.all()
    return {'restaurant_images': [image.to_dict() for image in images]}  


UPLOAD_FOLDER = '/static/uploaded/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

import random
import string

def generate_random_string(length=8):
    """Generate a random string of specified length."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(image):
    """Save the image to the upload folder and return the URL path."""
    filename = secure_filename(image.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    # Save the image to the specified folder
    image.save(filepath)
    return f"/static/uploaded/images/{filename}" 

@restaurant_images.route('/restaurant/<int:restaurant_id>/Images', methods=['POST'])
@login_required
def upload_image(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)

    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404

    images = request.files.getlist('images')

    if not images:
        return jsonify({'error': 'No image provided'}), 400

    uploaded_images = []
    for image in images:
        # Check if the file is a valid image
        if image and allowed_file(image.filename):
            try:
                # Save the image and get the URL
                image_url = save_image(image)
                
                # new RestaurantImage record
                restaurant_image = RestaurantImage(
                    restaurant_id=restaurant.id,
                    user_id=current_user.id,  
                    url=image_url
                )
                db.session.add(restaurant_image)
                uploaded_images.append(restaurant_image.to_dict())
            except Exception as e:
                db.session.rollback()  # Rollback in case of an error
                return jsonify({"error": f"Error saving image: {str(e)}"}), 500
        else:
            return jsonify({"error": "Invalid file type. Only images are allowed."}), 400
    
    # Commit after all images are processed
    db.session.commit()
    
    return jsonify({"message": "Images uploaded successfully", "images": uploaded_images}), 200



@restaurant_images.route('/restaurant/<int:restaurant_id>/Images', methods=['GET'])
def images_by_restaurant(restaurant_id):
    
    images_by_restaurant = RestaurantImage.query.filter_by(restaurant_id=restaurant_id).all()

    # Check if no images are found
    if len(images_by_restaurant) == 0:
        return jsonify({'message': 'Restaurant Images not found'}), 404

    images_list = [image.to_dict() for image in images_by_restaurant]  
    return jsonify({'restaurant_images': images_list}), 200
  


@restaurant_images.route('/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):

    userid = request.user.id  
        
    image = RestaurantImage.query.filter_by(id=image_id).first()

    
    if not image:
        return jsonify({'error': 'Image not found'}), 404

    if image.user_id != userid or image.restaurant.owner_id != user_id:
        return jsonify({'error': 'User Unauthorized'}), 403

    
    db.session.delete(image)
    db.session.commit()

    return jsonify({'message': 'Image Deleted Successfully!'}), 200

