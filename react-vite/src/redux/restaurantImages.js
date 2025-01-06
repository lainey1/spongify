const SET_IMAGES = "restaurantImages/setImages";
const ADD_IMAGE = "restaurantImages/addImage";
const REMOVE_IMAGE = "restaurantImages/removeImage";
const UPDATE_IMAGE = "restaurantImages/updateImage";

// Action Creators
const setImages = (images) => ({
  type: SET_IMAGES,
  payload: images,
});

const addImage = (image) => ({
  type: ADD_IMAGE,
  payload: image,
});

const removeImage = (imageId) => ({
  type: REMOVE_IMAGE,
  payload: imageId,
});

const updateImage = (image) => ({
  type: UPDATE_IMAGE,
  payload: image,
});

// Fetch all images
export const thunkFetchAllImages = () => async (dispatch) => {
  const response = await fetch("/api/restaurant_images/");
  if (response.ok) {
    const data = await response.json();
    dispatch(setImages(data.restaurant_images)); // Assumed data structure
  }
};

// Fetch restaurant images based on restaurantId
export const thunkFetchRestaurantImages =
  (restaurantId) => async (dispatch) => {
    const response = await fetch(
      `/api/restaurant_images/restaurant/${restaurantId}/images`
    );
    if (response.ok) {
      const data = await response.json();
      dispatch(setImages(data.images));
    } else if (response.status === 404) {
      const error = await response.json();
      console.error(error.message);
    }
  };

// Upload new image
export const thunkUploadImage =
  ({ restaurantId, imageUrl, isPreview }) =>
  async (dispatch) => {
    const response = await fetch(
      `/api/restaurant_images/restaurant/${restaurantId}/images`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl, is_preview: isPreview }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      dispatch(addImage(data)); // Assuming the API returns the image object
    } else {
      const error = await response.json();
      console.error(error.error);
    }
  };

// Delete an image
export const thunkDeleteImage = (imageId) => async (dispatch) => {
  const response = await fetch(`/api/restaurant_images/${imageId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(removeImage(imageId));
  } else {
    const error = await response.json();
    console.error(error.error);
  }
};

// Update an image
export const thunkUpdateImage =
  ({ imageId, imageUrl, isPreview }) =>
  async (dispatch) => {
    const response = await fetch(`/api/restaurant_images/${imageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl, is_preview: isPreview }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(updateImage(data.image)); // Assuming the API returns the updated image
    } else {
      const error = await response.json();
      console.error(error.error);
    }
  };

// Initial State
const initialState = { images: [] };

// Reducer
function restaurantImagesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_IMAGES:
      return { ...state, images: action.payload };

    case ADD_IMAGE:
      return { ...state, images: [...state.images, action.payload] };

    case REMOVE_IMAGE:
      return {
        ...state,
        images: state.images.filter((image) => image.id !== action.payload),
      };

    case UPDATE_IMAGE:
      return {
        ...state,
        images: state.images.map((image) =>
          image.id === action.payload.id ? action.payload : image
        ),
      };

    default:
      return state;
  }
}

export default restaurantImagesReducer;
