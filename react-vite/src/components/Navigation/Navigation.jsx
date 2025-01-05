import { Link } from "react-router-dom";
import eaterverseLogo from "../../../../app/static/images/logo_eaterverse_transparent.png";
import ProfileButton from "./ProfileButton";
// import SearchBar from "./SearchBar";
import "./Navigation.css";

function Navigation() {
  return (
    <nav id="site-banner">
      {/* Logo Section */}
      <div id="logo-banner">
        <Link to="/" className="logo-link">
          <img src={eaterverseLogo} alt="Eaterverse Logo" />
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
