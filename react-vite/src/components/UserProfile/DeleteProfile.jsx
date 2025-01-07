import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteProfileThunk } from "../../redux/session";
import { useModal } from "../../context/Modal";
import "./DeleteProfile.css";

const DeleteProfile = ({ user }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const formRef = useRef(null); // Reference to the form

  const confirmDelete = (e) => {
    e.preventDefault();
    dispatch(deleteProfileThunk(user)).then(() => closeModal());
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
        profile, reviews, reservation, and image data and is not reversable.{" "}
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
