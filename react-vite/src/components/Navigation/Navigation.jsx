import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import SearchBar from "./SearchBar";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import logo from "../../../src/images/logo_eaterverse_transparent.png"; // Correct logo import
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

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
        {isLoaded && (
          <>
            {sessionUser ? (
              <li>
                <ProfileButton user={sessionUser} />
              </li>
            ) : (
              <li className="menu">
                <button
                  aria-label="Menu"
                  className="menu-button"
                  onClick={toggleDropdown}
                >
                  <FaUserCircle />
                </button>
                {dropdownOpen && (
                  <ul className="dropdown" ref={dropdownRef}>
                    <li>
                      <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal />}
                        aria-label="Log In"
                      />
                    </li>
                    <li>
                      <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal />}
                        aria-label="Sign Up"
                      />
                    </li>
                  </ul>
                )}
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
;


