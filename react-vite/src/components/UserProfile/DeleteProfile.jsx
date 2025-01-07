import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProfileThunk } from "../../redux/session";
import { useModal } from "../../context/Modal";
import "./DeleteProfile.css";
import { useNavigate } from "react-router-dom";

const DeleteProfile = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const currentUser = useSelector((state) => state.session.user);

  const formRef = useRef(null); // Reference to the form

  const confirmDelete = (e) => {
    e.preventDefault();

    if (!currentUser) {
      console.log("User is not logged in or loading...");
      return; // Exit early if currentUser is not available
    }

    console.log("currentUser", currentUser);
    if (currentUser.email === "demo@aa.io") {
      alert(
        "demo@aa.io is not able to delete profiles. Please log in as another demo user - e.g. marnie@aa.io."
      );
      return; // Stop the delete action if it's the demo user
    }

    // Proceed with deleting the profile if not demo user
    dispatch(deleteProfileThunk(user))
      .then(() => {
        closeModal();
        navigate(); // Replace `navigate` with the appropriate navigation function and arguments
      })
      .catch((error) => {
        console.error("Failed to delete profile:", error);
      });
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    closeModal(); // Close modal if user cancels
  };

  // Close the modal when clicking outside the form
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  return (
    <div id="delete-user-form">
      <h1>Confirm Deletion of Your Profile</h1>
      <p>
        Are you sure you want to delete your profile? Deletion will remove your
        profile, reviews, reservation, and image data and is not reversible.{" "}
      </p>
      <button onClick={confirmDelete} className="confirm-delete">
        Yes (Delete Profile)
      </button>
      <button onClick={cancelDelete} className="cancel-delete">
        No (Keep Profile)
      </button>
    </div>
  );
};

export default DeleteProfile;
