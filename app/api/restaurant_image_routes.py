from flask import Blueprint, jsonify, request
from app.forms import RestaurantForm, ImageForm
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



@restaurant_images.route('/restaurant/<int:restaurant_id>/Images', methods=['GET','POST'])
@login_required
def upload_image(restaurant_id):
    form = ImageForm()
    restaurant = Restaurant.query.get(restaurant_id)

    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404

    if not form.images.data:
        return jsonify({"error": "No images uploaded"}), 400

    image_urls = form.images.data  

    uploaded_images = []
    for image_url in image_urls:
        
        if not image_url.startswith(('http://', 'https://')):
            return jsonify({"error": f"Invalid URL: {image_url}"}), 400

        try:
            # New RestaurantImage record with the URL
            restaurant_image = RestaurantImage(
                restaurant_id=restaurant.id,
                user_id=current_user.id,  
                url=image_url
            )
            db.session.add(restaurant_image)
            uploaded_images.append(image_url)
            
        except Exception as e:
            db.session.rollback()  
            return jsonify({"error": f"Error saving image: {str(e)}"}), 500

    
    db.session.commit()

    return jsonify({"message": "Images uploaded successfully", "uploaded_images": uploaded_images}), 200




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

