import { Link } from "react-router-dom";
import eaterverseBanner from "../../../../app/static/images/eaterverse_banner.png";
import ProfileButton from "./ProfileButton";
// import SearchBar from "./SearchBar";
import "./Navigation.css";

function Navigation() {
  return (
    <nav id="site-banner">
      {/* Logo Section */}
      <div id="logo-banner">
        <Link to="/" className="logo-link">
          <img src={eaterverseBanner} alt="Eaterverse Banner" />
        </Link>
      </div>

      {/* Search Bar */}
      {/* <div id="search-bar-container">
        <SearchBar />
      </div> */}

      {/* Navigation Actions */}
      <div id="actions-container">
        <Link to="/about" className="nav-link">
          About
        </Link>
        {/* <Link to="/restaurants" className="nav-link">
          Restaurants
        </Link> */}
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
