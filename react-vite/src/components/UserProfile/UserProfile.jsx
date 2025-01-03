import { useSelector } from "react-redux";
import "./UserProfile.css";




function UserProfile() {


  const currentUser = useSelector((state) => state.session.user);
  



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
          <p>Location: {currentUser.location}</p>
          <button className="edit-profile-btn">Edit Profile</button>
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
