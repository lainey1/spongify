// Store for Review

// Action Types
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const GET_ALL_REVIEWS = 'reviews/GET_ALL_REVIEWS';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

// Action Creators
export const createReview = (review) => ({ type: CREATE_REVIEW, review });
export const getReviews = (reviews) => ({ type: GET_ALL_REVIEWS, reviews });
export const updateReview = (review) => ({ type: UPDATE_REVIEW, review });
export const deleteReview = (reviewId) => ({ type: DELETE_REVIEW, reviewId });

// Thunks
export const createNewReview = (reviewData) => async (dispatch) => {
    try {
        const response = await fetch('/api/restaurant/:restaurant_id/new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData),
        });
        if (response.ok) {
            const review = await response.json();
            dispatch(createReview(review));
        } else {
            const error = await response.json();
            console.error('Error creating review:', error);
        }
    } catch (err) {
        console.error('Error creating review:', err);
    }
};

export const getAllReviews = () => async (dispatch) => {
    try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
            const reviews = await response.json();
            dispatch(getAllReviews(reviews));
        }
    } catch (err) {
        console.error('Error fetching reviews:', err);
    }
}

export const updateExistingReview = (reviewId, reviewData) => async (dispatch) => {
    try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData),
        });
        if (response.ok) {
            const review = await response.json();
            dispatch(updateReview(review));
        }
    } catch (err) {
        console.error('Error updating review:', err);
    }

};

export const deleteExistingReview = (reviewId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            dispatch(deleteReview(reviewId));
        }
    } catch (err) {
        console.error('Error deleting review:', err);
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