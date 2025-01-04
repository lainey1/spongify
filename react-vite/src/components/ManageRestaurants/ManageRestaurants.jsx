import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteRestaurant from "./DeleteRestaurant";
import { fetchAllRestaurantsThunk } from "../../redux/restaurants";
import {
  getAvgStarRating,
  getReviewCount,
  formatStarRating,
  formatReviewCount,
} from "../../utils/restaurantHelpers";
import StarRating from "../StarRating";
import "./ManageRestaurants.css";

function ManageRestaurants() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const restaurants = useSelector((state) => state.restaurants.Restaurants);
  const currentUser = useSelector((state) => state.session.user);
  const [loading, setLoading] = useState(true);

  const userRestaurants = restaurants?.filter(
    (restaurant) => restaurant.owner_id === currentUser.id
  );

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllRestaurantsThunk())
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (!currentUser)
    return <div>You must be logged in to manage restaurants.</div>;

  return (
    <div className="manage-restaurants-page">
      <div className="header">
        <h1>Manage Your Restaurants</h1>
        <p>
          Click a restaurant&apos;s image to view its public listing, or use the
          buttons below to update or delete the restaurant.
        </p>
      </div>

      {!userRestaurants.length ? (
        <button
          id="create-restaurant-button"
          onClick={() => {
            navigate("/restaurants/new");
          }}
        >
          Create a New Restaurant
        </button>
      ) : (
        <div className="restaurants-grid">
          {userRestaurants?.map((restaurant) => {
            const avgStarRating = getAvgStarRating(restaurant?.reviewStats);
            const reviewCount = getReviewCount(restaurant?.reviewStats);

            <div key={restaurant.id} className="restaurant-tile">
              <Link
                to={`/restaurants/${restaurant.id}`}
                className="restaurant-link"
              >
                <div className="restaurant-image-container">
                  {restaurant.previewImage ? (
                    <img
                      src={restaurant.previewImage}
                      alt={restaurant.name}
                      className="restaurant-image"
                    />
                  ) : (
                    <div>No Image Available</div>
                  )}
                </div>
                <div className="restaurant-details">
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  <div className="restaurant-location-rating">
                    <p className="restaurant-location">
                      {restaurant.city}, {restaurant.state}
                    </p>
                    <span className="average-rating">
                      <div className="highlights">
                        <StarRating rating={avgStarRating} />
                        {formatStarRating(avgStarRating)}
                        {formatReviewCount(reviewCount)}
                      </div>
                    </span>
                  </div>
                  <p style={{ textAlign: "left" }}>
                    <strong>${restaurant.price.toFixed(2)}</strong> night
                  </p>
                </div>
              </Link>

              <span className="button-wrapper">
                <button
                  className="update-button"
                  onClick={() => {
                    navigate(`/restaurants/${restaurant.id}/edit`);
                  }}
                >
                  Update
                </button>
                <OpenModalButton
                  buttonText={"Delete"}
                  modalComponent={
                    <DeleteRestaurant restaurantId={restaurant.id} />
                  }
                  className="delete-button"
                />
              </span>
            </div>;
          })}
        </div>
      )}
    </div>
  );
}

export default ManageRestaurants;
