import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  thunkFetchAllImages,
  thunkFetchRestaurantImages,
  thunkUploadImage,
  thunkDeleteImage,
  thunkUpdateImage,
} from "../../redux/restaurantImages";

import "./RestaurantImages.css";

import { useParams } from "react-router-dom";

const RestaurantImages = () => {
  const dispatch = useDispatch();
  const { restaurantId } = useParams();
  // const restaurant = useSelector((state) => state.restaurants.currentRestaurant.id);
  const images = useSelector((state) => state.restaurantImages.images);

  const [imageUrl, setImageUrl] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [editImageId, setEditImageId] = useState(null);
  const [error, setError] = useState("");
  const validateUrl = (url) => {
    return url.startsWith("https://");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!validateUrl(imageUrl)) {
      setError("Image URL must start with 'https://'.");
      return;
    }
    setError(""); // Clear any existing errors
    await dispatch(thunkUploadImage({ restaurantId, imageUrl, isPreview }));

    // After upload, re-fetch the images to ensure the new image is included
    if (restaurantId) {
      dispatch(thunkFetchRestaurantImages(restaurantId));
    } else {
      dispatch(thunkFetchAllImages());
    }

    // Reset form fields
    setImageUrl("");
    setIsPreview(false);
  };

  // Delete Image
  const handleDelete = async (image) => {
    await dispatch(thunkDeleteImage(image));
  };

  // Edit Image
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validateUrl(imageUrl)) {
      setError("Image URL must start with 'https://'.");
      return;
    }
    setError(""); // Clear any existing errors

    await dispatch(
      thunkUpdateImage({ imageId: editImageId, imageUrl, isPreview })
    );
    setEditImageId(null);
    setImageUrl("");
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
        <form
          onSubmit={editImageId ? handleEdit : handleUpload}
          className="image-form"
        >
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
          <button type="submit">
            {editImageId ? "Update Image" : "Upload Image"}
          </button>
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
        {error && <p className="error-message">{error}</p>}
      </div>

      <div>
        <h2>Image List</h2>
        {images?.length > 0 ? (
          <ul className="image-list">
            {images?.map((image) => (
              <li key={image.id}>
                <img src={image.url} alt="Restaurant" />
                {/* <p>{image.is_preview ? "Preview" : "Regular"}</p> */}
                <button onClick={() => startEdit(image)}>Edit</button>
                <button
                  className="delete"
                  onClick={() => handleDelete(image.id)}
                >
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
