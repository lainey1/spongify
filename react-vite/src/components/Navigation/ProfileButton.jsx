import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  // Toggle the dropdown menu
  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  // Close the dropdown menu
  const closeMenu = () => setShowMenu(false);

  // Log out user
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
    navigate("/");
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  // Navigate to UserProfile with active section
  const navigateToSection = (section) => {
    navigate(`/user/${user.id}?section=${section}`);
    closeMenu();
  };

  return (
    <div className="profile-button-container">
      <button id="profile-dropdown-button" onClick={toggleMenu}>
        <FaUserCircle id="icon-user" />
      </button>
      {showMenu && (
        <ul className="profile-dropdown" ref={ulRef}>
          {user ? (
            <>
              <li
                className="dropdown-item username-email"
                style={{ fontWeight: "bold" }}
              >
                Hi {user.username}! ({user.email})
              </li>
              <button
                className="dropdown-item"
                onClick={() => navigateToSection("profile")}
              >
                Profile Overview
              </button>
              <button
                className="dropdown-item"
                onClick={() => navigateToSection("reservations")}
              >
                My Reservations
              </button>
              <button
                className="dropdown-item"
                onClick={() => navigateToSection("reviews")}
              >
                My Reviews
              </button>
              <button
                className="dropdown-item"
                onClick={() => navigateToSection("restaurants")}
              >
                Manage Restaurants
              </button>
              <li>
                <button className="logout-button" onClick={handleLogout}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
