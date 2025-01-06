// react-vite/src/redux/restaurants.js
// import { normalizer } from "./utils";

// Action Type Constants
const LOAD_RESTAURANT = "/restaurants/LOAD_RESTAURANT";
const LOAD_RESTAURANTS = "/restaurants/LOAD_RESTAURANTS";
const SET_ERRORS = "/restaurants/SET_ERRORS";
const UPDATE_RESTAURANT = "/restaurants/UPDATE_RESTAURANT";
const DELETE_RESTAURANT = "/restaurants/DELETE_RESTAURANT";

// Action Creators encapsulate the creation of action objects (POJOs) to describe events or changes in app state.
const loadRestaurant = (restaurant) => ({
  type: LOAD_RESTAURANT,
  payload: restaurant,
});

const loadRestaurants = (restaurants) => ({
  type: LOAD_RESTAURANTS,
  payload: restaurants,
});

const setErrors = (errors) => ({
  type: SET_ERRORS,
  errors,
});

export const updateRestaurant = (restaurant) => ({
  type: UPDATE_RESTAURANT,
  payload: restaurant,
});
export const deleteRestaurant = (restaurantId) => ({
  type: DELETE_RESTAURANT,
  payload: restaurantId,
});

// Thunk Action Creators handle async logic using redux-thunk middleware to dispatch actions and access the current state.
export const fetchRestaurantThunk = (restaurant_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/restaurants/${restaurant_id}`);

    if (response.ok) {
      const restaurant = await response.json();
      dispatch(loadRestaurant(restaurant));
      console.log(restaurant); // Check the structure of the restaurant object
    } else {
      const errors = await response.json();
      dispatch(setErrors(errors));
    }
  } catch (err) {
    dispatch(setErrors({ message: "Network error" }));
  }
};

export const fetchAllRestaurantsThunk = () => async (dispatch) => {
  try {
    const response = await fetch("/api/restaurants");
    if (response.ok) {
      const restaurants = await response.json();
      dispatch(loadRestaurants(restaurants));
    } else {
      const errors = await response.json();
      dispatch(setErrors(errors));
    }
  } catch (err) {
    dispatch(setErrors({ message: "Network error" }));
  }
};

export const editRestaurantThunk =
  (restaurantId, restaurantData) => async (dispatch) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurantData),
      });
      if (response.ok) {
        const restaurant = await response.json();
        dispatch(updateRestaurant(restaurant));
      }
    } catch (err) {
      console.error("Error updating restaurant:", err);
    }
  };

export const deleteRestaurantThunk = (restaurantId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/restaurants/${restaurantId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(deleteRestaurant(restaurantId));
    }
  } catch (err) {
    console.error("Error deleting restaurant:", err);
  }
};

// Reducer handles state updates based on dispatch actions. They take current state as inputs and return a new state.

const initialState = {
  currentRestaurant: {},
};

export default function restaurantsReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case LOAD_RESTAURANT:
      return { ...state, currentRestaurant: payload };
    case LOAD_RESTAURANTS:
      return {
        currentRestaurant: state.currentRestaurant,
        ...payload,
      };

    case UPDATE_RESTAURANT: {
      return { ...state, [payload.id]: payload };
    }

    case DELETE_RESTAURANT: {
      const newState = { ...state };
      delete newState[payload];
      return newState;
    }

    default:
      return state;
  }
}
