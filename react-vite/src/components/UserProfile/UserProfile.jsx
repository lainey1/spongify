import ProfileOverview from "./ProfileOverview";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ReviewsUser from "../ReviewsUser";
import ManageRestaurants from "../ManageRestaurants/ManageRestaurants";
import ManageReservations from "./ManageReservations/ManageReservations";
import { thunkAuthenticate } from "../../redux/session";
import "./UserProfile.css";

function UserProfile() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session.user);

  // Extract the 'section' query parameter
  const queryParams = new URLSearchParams(location.search);
  const activeSection = queryParams.get("section") || "profile";

  useEffect(() => {
    dispatch(thunkAuthenticate()); // Load current user data
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
          <h4>{currentUser.location}</h4>
          <p>{currentUser.headline}</p>

          {/* user/:userId/edit */}
          <div>
            <Link
              to={`/user/${currentUser.id}/edit`}
              className="edit-profile-link"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        <nav className="menu">
          <button
            onClick={() => navigate(`/user/${currentUser.id}?section=profile`)}
          >
            Profile Overview
          </button>
          <button
            onClick={() => navigate(`/user/${currentUser.id}?section=reviews`)}
          >
            Reviews
          </button>
          <button
            onClick={() =>
              navigate(`/user/${currentUser.id}?section=restaurants`)
            }
          >
            Restaurants
          </button>
          <button
            onClick={() =>
              navigate(`/user/${currentUser.id}?section=reservations`)
            }
          >
            Reservations
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* {activeSection === "profile" && (
          <ProfileOverview user={currentUser} reviewRatings={reviewRatings} />
        )} */}
        {activeSection === "profile" && <ProfileOverview user={currentUser} />}
        {activeSection === "reviews" && <ReviewsUser />}
        {activeSection === "restaurants" && <ManageRestaurants />}
        {activeSection === "reservations" && <ManageReservations />}
      </div>
    </div>
  );
}

export default UserProfile;
