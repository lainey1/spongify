import { useDispatch, useSelector } from "react-redux";
import "./UserProfile.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { thunkAuthenticate } from "../../redux/session";
import ReviewsUser from "../ReviewsUser";

function UserProfile() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

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
          <button>Profile Overview</button>
          <button>Reviews</button>
          <button>Restaurants</button>
          <button>Reservations</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
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

        <div className="review-section">
          <ReviewsUser />
        </div>

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
