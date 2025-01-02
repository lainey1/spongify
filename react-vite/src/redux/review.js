// Store for Review

// Action Types
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const GET_REVIEWS_BY_RESTAURANT = 'reviews/GET_REVIEWS_BY_RESTAURANT';
const GET_REVIEWS_BY_USER = 'reviews/GET_REVIEWS_BY_USER';
const GET_REVIEW_BY_ID = 'reviews/GET_REVIEW_BY_ID';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';



// Action Creators
export const createReview = (review) => ({ type: CREATE_REVIEW, review });
export const getReviewsByRestaurant = (reviews) => ({ type: GET_REVIEWS_BY_RESTAURANT, reviews });
export const getReviewsByUser = (reviews) => ({ type: GET_REVIEWS_BY_USER, reviews });
export const getReviewById = (review) => ({ type: GET_REVIEW_BY_ID, review });
export const updateReview = (review) => ({ type: UPDATE_REVIEW, review });
export const deleteReview = (reviewId) => ({ type: DELETE_REVIEW, reviewId });


// Thunks
export const createNewReview = (reviewData) => async (dispatch) => {
    const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    });
    if (response.ok) {
        const review = await response.json();
        dispatch(createReview(review));
    }
};

export const fetchReviewsByRestaurant = (restaurantId) => async (dispatch) => {
    const response = await fetch(`/api/restaurants/${restaurantId}/reviews`);
    if (response.ok) {
        const reviews = await response.json();
        dispatch(getReviewsByRestaurant(reviews));
    }
};

export const fetchReviewsByUser = (userId) => async (dispatch) => {
    const response = await fetch(`/api/users/${userId}/reviews`);
    if (response.ok) {
        const reviews = await response.json();
        dispatch(getReviewsByUser(reviews));
    }
};

export const fetchReviewById = (reviewId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`);
    if (response.ok) {
        const review = await response.json();
        dispatch(getReviewById(review));
    }
};

export const updateExistingReview = (reviewId, reviewData) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    });
    if (response.ok) {
        const review = await response.json();
        dispatch(updateReview(review));
    }
};

export const deleteExistingReview = (reviewId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        dispatch(deleteReview(reviewId));
    }
};

// Reducer
const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_REVIEW:
        case GET_REVIEW_BY_ID:
            return { ...state, [action.review.id]: action.review };
        case GET_REVIEWS_BY_RESTAURANT:
        case GET_REVIEWS_BY_USER:
            const reviews = {};
            action.reviews.forEach(review => {
                reviews[review.id] = review;
            });
            return { ...state, ...reviews };
        case UPDATE_REVIEW:
        case DELETE_REVIEW:
            const newState = { ...state };
            delete newState[action.reviewId];
            return newState;
        default:
            return state;
    }
};

export default reviewsReducer;
