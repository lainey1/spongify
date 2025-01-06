import ReviewsUser from "../ReviewsUser";
import "./ProfileOverview.css";

function ProfileOverview({ user }) {
  return (
    <div className="profile-overview">
      <h3 style={{ color: "#8c183e", fontSize: "2em" }}>
        Welcome, {user.username}!
      </h3>

      {/* Favorite Cuisine */}
      <div className="favorite-cuisine">
        <h4 style={{ color: "#8c183e" }}>Favorite Cuisine:</h4>
        <p>{user.favorite_cuisine || "No favorite cuisine added yet."}</p>
      </div>

      {/* Location */}
      <div className="user-location">
        <h4 style={{ color: "#8c183e" }}>Location:</h4>

        <p>{user.location || "Location not specified."}</p>
      </div>
      {/* Review Rating Distribution Graph */}
      {/* <div className="review-distribution">
        <h4>Review Rating Distribution</h4>
        <div className="rating-graph">
          {Object.entries(reviewRatings).map(([rating, count]) => (
            <div key={rating} className="rating-bar">
              <div
                className="bar"
                style={{
                  height: `${count * 2}px`,
                  backgroundColor: "#4caf50",
                }}
              ></div>
              <span className="rating-label">{rating}★</span>
            </div>
          ))}
        </div>
      </div> */}

      {/* Reviews Section */}
      <ReviewsUser />

      {/* Friends Section */}
      {/* <div className="friends-section">
        <h4>Friends (feature coming!)</h4>
        <div className="friends-placeholder">
          <div className="friend-avatar">Avatar</div>
          <div className="friend-avatar">Avatar</div>
          <div className="friend-avatar">Avatar</div>
        </div>
      </div> */}
    </div>
  );
}

export default ProfileOverview;
