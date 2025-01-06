import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    thunkFetchAllImages,
    thunkFetchRestaurantImages,
    thunkUploadImage,
    thunkDeleteImage,
    thunkUpdateImage
} from '../../redux/restaurantImages';

import "./RestaurantImages.css";

import { useParams } from 'react-router-dom';

const RestaurantImages = () => {

    const dispatch = useDispatch();

    const { restaurantId } = useParams();

    const restaurant = useSelector((state) => state.restaurants.currentRestaurant.id)

    const images = useSelector((state) => state.restaurantImages.images);

    console.log("IMAGES", images)
    console.log("RESTAURANT-ID====",restaurant)

    // const filteredImages = images.filter((image) => image.restaurant_id === restaurantId);

    // console.log("Filtered Images",filteredImages)


    const [imageUrl, setImageUrl] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [editImageId, setEditImageId] = useState(null);


    // Upload Image
    const handleUpload = async (e) => {
        e.preventDefault();
        await dispatch(thunkUploadImage({ restaurantId, imageUrl, isPreview }));
        setImageUrl('');
        setIsPreview(false);
    };

    // Delete Image
    const handleDelete = async (imageId) => {
        await dispatch(thunkDeleteImage(imageId));
    };

    // Edit Image
    const handleEdit = async (e) => {
        e.preventDefault();
        await dispatch(thunkUpdateImage({ imageId: editImageId, imageUrl, isPreview }));
        setEditImageId(null);
        setImageUrl('');
        setIsPreview(false);
    };


    const startEdit = (image) => {
        setEditImageId(image.id);
        setImageUrl(image.url);
        setIsPreview(image.is_preview);
    };

    useEffect(() => {
        if (restaurantId) {
            dispatch(thunkFetchRestaurantImages(restaurantId));
        } else {
            dispatch(thunkFetchAllImages());
        }
    }, [dispatch, restaurantId]);


    return (
       <div className="restaurant-images-container">
    <h1>Restaurant Images</h1>
    <div>
        <h2>Upload Image</h2>
        <form onSubmit={editImageId ? handleEdit : handleUpload} className="image-form">
            <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL"
                required
            />
            <label>
                <input
                    type="checkbox"
                    checked={isPreview}
                    onChange={(e) => setIsPreview(e.target.checked)}
                />
                Is Preview
            </label>
            <button type="submit">{editImageId ? 'Update Image' : 'Upload Image'}</button>
            {editImageId && (
                <button
                    type="button"
                    className="cancel-edit"
                    onClick={() => setEditImageId(null)}
                >
                    Cancel Edit
                </button>
            )}
        </form>
    </div>

    <div>
        <h2>Image List</h2>
        {images.length > 0 ? (
            <ul className="image-list">
                {images.map((image) => (
                    <li key={image.id}>
                        <img src={image.url} alt="Restaurant" />
                        <p>{image.is_preview ? 'Preview' : 'Regular'}</p>
                        <button onClick={() => startEdit(image)}>Edit</button>
                        <button className="delete" onClick={() => handleDelete(image.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No images available</p>
        )}
    </div>
</div>
    );
};

export default RestaurantImages;
