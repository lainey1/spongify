import { useDispatch, useSelector } from "react-redux";
import "./UserProfile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { thunkAuthenticate } from "../../redux/session";
import ReviewsUser from "../ReviewsUser";
import ManageRestaurants from "../ManageRestaurants/ManageRestaurants";
// import ManageReservations from "../ManageReservations";

function UserProfile() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  // State to track the active module
  const [activeModule, setActiveModule] = useState("overview");

  useEffect(() => {
    dispatch(thunkAuthenticate); // make GetCurrentUser thunk
  }, [dispatch]);

  return (
    <div className="profile-page">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="user-info">
          <img
            src="https://via.placeholder.com/150"
            alt="user-avatar"
            className="user-avatar"
          />
          <h2>{currentUser.username}</h2>
          <h4>Location: {currentUser.location}</h4>
          <p>{currentUser.headline}</p>

          <button
            key={currentUser.id}
            className="edit-profile-btn"
            onClick={() => navigate(`/user/${currentUser.id}/edit`)}
          >
            Edit Profile
          </button>
        </div>

        <nav className="menu">
          <button onClick={() => setActiveModule("overview")}>
            Profile Overview
          </button>
          <button onClick={() => setActiveModule("reviews")}>Reviews</button>
          <button onClick={() => setActiveModule("restaurants")}>
            Restaurants
          </button>
          <button onClick={() => setActiveModule("reservations")}>
            Reservations
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeModule === "overview" && (
          <div className="overview-section">
            <div className="next-reservation">
              <h3>Next Reservation</h3>
              <button className="view-all-btn">View all reservations</button>
            </div>

            <div className="stats-section">
              <div className="top-cuisines">
                <h4>Top 3 Cuisines</h4>
                <p>{currentUser.favorite_cuisine}</p>
              </div>
              <div className="review-stars">
                <h4>Review Stars Distribution</h4>
                <p>-</p>
              </div>
            </div>
          </div>
        )}

        {activeModule === "reviews" && (
          <div className="review-section">
            <ReviewsUser />
          </div>
        )}

        {activeModule === "restaurants" && (
          <div className="restaurant-section">
            <ManageRestaurants />
          </div>
        )}

        {/* {activeModule === "reservations" && (
          <div className="reservation-section">
            <ManageReservations />
          </div>
        )} */}

        <div className="friends-section">
          <h4>Friends (feature coming!)</h4>
          <div className="friends-placeholder">
            <div className="friend-avatar">Avatar</div>
            <div className="friend-avatar">Avatar</div>
            <div className="friend-avatar">Avatar</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
