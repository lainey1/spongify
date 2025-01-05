// Store for Review

// Action Types
const CREATE_REVIEW = "/reviews/CREATE_REVIEW";
const GET_ALL_REVIEWS = "reviews/GET_ALL_REVIEWS";
const GET_REVIEWS_BY_RESTAURANT = "reviews/GET_REVIEWS_BY_RESTAURANT";
const GET_REVIEWS_BY_USER = "reviews/GET_REVIEWS_BY_USER";
const UPDATE_REVIEW = "/reviews/UPDATE_REVIEW";
const DELETE_REVIEW = "/reviews/DELETE_REVIEW";

// Action Creators
export const createReview = (review) => ({ type: CREATE_REVIEW, review });
export const getReviews = (reviews) => ({ type: GET_ALL_REVIEWS, reviews });
export const getReviewsByRestaurant = (restaurantId, reviews) => ({
  type: GET_REVIEWS_BY_RESTAURANT,
  restaurantId,
  reviews,
});
export const getReviewsByUser = (userId, reviews) => ({
  type: GET_REVIEWS_BY_USER,
  userId,
  reviews,
});
export const updateReview = (review) => ({ type: UPDATE_REVIEW, review });
export const deleteReview = (reviewId) => ({ type: DELETE_REVIEW, reviewId });

// Thunks
export const createNewReview =
  (reviewData, restaurant_id) => async (dispatch) => {
    try {
      const response = await fetch(
        `/api/reviews/restaurant/${restaurant_id}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        }
      );
      if (response.ok) {
        const review = await response.json();
        dispatch(createReview(review));
      } else {
        const error = await response.json();
        console.error("Error creating review:", error);
      }
    } catch (err) {
      console.error("Error creating review:", err);
    }
  };

export const fetchReviewsByRestaurant = (restaurantId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reviews/restaurant/${restaurantId}`);
    if (response.ok) {
      const { reviews } = await response.json();
      dispatch(getReviewsByRestaurant(restaurantId, reviews));
    } else {
      const error = await response.json();
      console.error("Error fetching restaurant reviews:", error);
    }
  } catch (err) {
    console.error("Error fetching restaurant reviews:", err);
  }
};

export const fetchReviewsByUser = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reviews/user/${userId}`);
    if (response.ok) {
      const { reviews } = await response.json();
      dispatch(getReviewsByUser(userId, reviews));
    } else {
      const error = await response.json();
      console.error("Error fetching user reviews:", error);
    }
  } catch (err) {
    console.error("Error fetching user reviews:", err);
  }
};

export const fetchAllReviews = () => async (dispatch) => {
  try {
    const response = await fetch("/api/reviews");
    if (response.ok) {
      const reviews = await response.json();
      dispatch(getReviews(reviews));
    } else {
      const error = await response.json();
      console.error("Error fetching reviews:", error);
    }
  } catch (err) {
    console.error("Error fetching reviews:", err);
  }
};

export const updateExistingReview =
  (reviewId, reviewData) => async (dispatch) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });
      if (response.ok) {
        const review = await response.json();
        dispatch(updateReview(review));
      }
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

export const deleteExistingReview = (reviewId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(deleteReview(reviewId));
    }
  } catch (err) {
    console.error("Error deleting review:", err);
  }
};

// Reducer
const initialState = {};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REVIEW: {
      return { ...state, [action.review.id]: action.review };
    }

    case GET_ALL_REVIEWS: {
      const allReviews = {};
      action.reviews.forEach((review) => {
        allReviews[review.id] = review;
      });
      return allReviews;
    }

    case GET_REVIEWS_BY_RESTAURANT: {
      const reviewsByRestaurant = {};
      action.reviews.forEach((review) => {
        reviewsByRestaurant[review.id] = review;
      });
      return reviewsByRestaurant;
    }

    case GET_REVIEWS_BY_USER: {
      const reviewsByUser = {};
      action.reviews.forEach((review) => {
        reviewsByUser[review.id] = review;
      });
      return reviewsByUser;
    }

    case UPDATE_REVIEW: {
      return { ...state, [action.review.id]: action.review };
    }

    case DELETE_REVIEW: {
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;
    }

    default:
      return state;
  }
};

export default reviewsReducer;
