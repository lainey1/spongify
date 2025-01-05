import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import StarRating from "../StarRating";
import { fetchAllRestaurantsThunk } from "../../redux/restaurants";
import eaterverse_banner from "../../../../app/static/images/eaterverse_banner.png";
import "./AllRestaurants.css";

function AllRestaurants() {
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.restaurants);

  useEffect(() => {
    dispatch(fetchAllRestaurantsThunk());
  }, [dispatch]);

  return (
    <div className="all-restaurants-page">
      <img
        src={eaterverse_banner}
        alt="Eaterverse banner"
        id="eaterverse-banner"
      />
      <div className="restaurants-grid">
        {restaurants?.map((restaurant) => {
          // Calculate the average star rating for each restaurant
          const avgStarRating = restaurant?.reviewStats?.avgStarRating || 0;
          const reviewCount = restaurant?.reviewStats?.reviewCount || 0;

          return (
            <div key={restaurant.id} className="restaurant-tile">
              <Link
                to={`/restaurants/${restaurant.id}`}
                className="restaurant-link"
              >
                <div className="restaurant-image-container">
                  {restaurant?.previewImage ? (
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
                  <span className="rating-line">
                    {/* Pass the avgStarRating to the StarRating component */}
                    <StarRating rating={avgStarRating} />
                    {avgStarRating > 0 ? (
                      <span>{Number(avgStarRating).toFixed(1)}</span>
                    ) : (
                      <span>New</span>
                    )}
                    <p style={{ fontWeight: "normal", color: "4c5b61" }}>
                      ({reviewCount} Reviews)
                    </p>
                  </span>

                  <div id="restaurant-price-location">
                    <span>
                      {restaurant?.price_point
                        ? "$".repeat(restaurant.price_point)
                        : "Price not available"}
                    </span>
                    <span style={{ padding: "0 0.5em" }}>•</span>
                    <p className="restaurant-location">
                      <IoLocationOutline />
                      {restaurant.city}
                    </p>
                    <span style={{ padding: "0 0.5em" }}>•</span>
                    <span>{restaurant?.cuisine}</span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllRestaurants;
