import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import SearchBar from "./SearchBar";
import logo from "../../../src/images/logo_eaterverse_transparent.png"; 
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  
  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/" aria-label="Home">
          <img src={logo} alt="Eater-Verse" />
        </NavLink>
      </div>

      <ul>
        <li>
          <SearchBar />
        </li>
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;



