import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  deleteRestaurantThunk,
  fetchAllRestaurantsThunk,
} from "../../redux/restaurants";
import { useModal } from "../../context/Modal";
import "./deleteRestaurant.css";

const DeleteRestaurant = ({ restaurantId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const formRef = useRef(null); // Reference to the form

  const confirmDelete = (e) => {
    e.preventDefault();
    dispatch(deleteRestaurantThunk(restaurantId))
      .then(() => dispatch(fetchAllRestaurantsThunk()))
      .then(() => closeModal());
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
    <div id="delete-restaurant-form">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this restaurant?</p>
      <button onClick={confirmDelete} className="confirm-delete">
        Yes (Delete Restaurant)
      </button>
      <button onClick={cancelDelete} className="cancel-delete">
        No (Keep Restaurant)
      </button>
    </div>
  );
};

export default DeleteRestaurant;
