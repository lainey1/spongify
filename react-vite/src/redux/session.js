const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const UPDATE_USER = "session/updateUser";
const DELETE_USER = "session/deleteUser";

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: user,
});

const deleteUser = (user) => ({
  type: DELETE_USER,
  payload: user,
});

// export const thunkGetCurrentUser = () => async (dispatch) => {
//     const response = await fetch("/api/auth/");
//     const data = await response.json();
//     dispatch(setUser(data));

// }

export const thunkAuthenticate = () => async (dispatch) => {
  const response = await fetch("/api/auth/");
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(setUser(data));
  }
};

export const thunkLogin = (credentials) => async (dispatch) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

export const thunkUpdateProfile = (userId, userData) => async (dispatch) => {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const updatedProfile = await res.json();
  dispatch(updateUser(updatedProfile));
  return updatedProfile;
};

export const deleteProfileThunk = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(deleteUser(userId));
    }
  } catch (err) {
    console.error("Error deleting restaurant:", err);
  }
};

const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };

    case UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };

    case DELETE_USER:
      return { ...state, user: null };

    default:
      return state;
  }
}

export default sessionReducer;
