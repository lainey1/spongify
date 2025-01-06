// react-vite/src/redux/restaurants.js
// import { normalizer } from "./utils";

// Action Type Constants
const LOAD_RESTAURANT = "/restaurants/LOAD_RESTAURANT";
const LOAD_RESTAURANTS = "/restaurants/LOAD_RESTAURANTS";
const SET_ERRORS = "/restaurants/SET_ERRORS";

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

// Thunk Action Creators handle async logic using redux-thunk middleware to dispatch actions and access the current state.
export const fetchRestaurantThunk = (restaurant_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/restaurants/${restaurant_id}`);
    if (response.ok) {
      const restaurant = await response.json();
      dispatch(loadRestaurant(restaurant));
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
      // console.log(restaurants);
      dispatch(loadRestaurants(restaurants));
    } else {
      const errors = await response.json();
      dispatch(setErrors(errors));
    }
  } catch (err) {
    dispatch(setErrors({ message: "Network error" }));
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
      return { ...state, currentRestaurant: payload, selectedRestaurant: payload };
    case LOAD_RESTAURANTS:
      return {
        currentRestaurant: state.currentRestaurant,
        ...payload,
      };

    default:
      return state;
  }
}
