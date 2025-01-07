// react-vite/src/redux/restaurants.js
// import { normalizer } from "./utils";

// Action Type Constants
const LOAD_RESTAURANT = "/restaurants/LOAD_RESTAURANT";
const LOAD_RESTAURANTS = "/restaurants/LOAD_RESTAURANTS";
const SET_ERRORS = "/restaurants/SET_ERRORS";
const ADD_RESTAURANT = "/restaurants/ADD_RESTAURANT";
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

const addRestaurant = (restaurant) => ({
  type: ADD_RESTAURANT,
  payload: restaurant,
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

export const addRestaurantThunk = (restaurantData) => async (dispatch) => {
  try {
    const response = await fetch("/api/restaurants/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurantData),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(addRestaurant(data)); // Dispatch action to update store with new restaurant
      console.log("Restaurant created:", data);
      return data;
    } else {
      const errors = await response.json();
      dispatch(setErrors(errors)); // Dispatch errors if creation failed
    }
  } catch (err) {
    console.error("Error creating restaurant:", err);
    dispatch(setErrors({ message: "Error submitting form" }));
  }
};

export const editRestaurantThunk =
  (restaurantId, restaurantData) => async (dispatch) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurantData),
      });
      if (response.ok) {
        const restaurant = await response.json();
        dispatch(updateRestaurant(restaurant));

        return restaurant;
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
  selectedRestaurant: {},
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

    case ADD_RESTAURANT:
      return {
        ...state,
        currentRestaurant: payload, // Add the newly created restaurant to the state
      };

    case UPDATE_RESTAURANT: {
      return {
        ...state,
        currentRestaurant: {
          ...state.currentRestaurant,
          ...payload,
          hours: payload.hours || state.currentRestaurant.hours, // Ensure hours are fully replaced
        },
      };
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
