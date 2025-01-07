import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoIosStarOutline, IoIosInformationCircle } from "react-icons/io";
import { MdAddAPhoto } from "react-icons/md";
import { fetchRestaurantThunk } from "../../redux/restaurants";
import {
  getAvgStarRating,
  getReviewCount,
  formatStarRating,
  formatReviewCount,
} from "../../utils/restaurantHelpers";
import { parseTimeToMinutes, formatTimeAgo } from "../../utils/timeHelpers";
import RestaurantHours from "./RestaurantHours";
import ReviewsRestaurant from "../ReviewsRestaurant";
import StarRating from "../StarRating";
import "./RestaurantDetails.css";

function RestaurantDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = useSelector((state) => state.session.user);
  const restaurant = useSelector(
    (state) => state.restaurants.currentRestaurant
  );
  const isOwner = currentUser?.id === restaurant?.owner_id;
  const avgStarRating = getAvgStarRating(restaurant?.reviewStats);
  const reviewCount = getReviewCount(restaurant?.reviewStats);

  useEffect(() => {
    // Set loading to true while fetching data
    setLoading(true);

    // Fetch restaurant data
    dispatch(fetchRestaurantThunk(restaurantId))
      .then(() => {
        setLoading(false); // Set loading to false when the fetch is complete
      })
      .catch(() => setLoading(false)); // In case of error, stop loading

    // Handle restaurant hours logic
    if (restaurant?.hours) {
      const today = new Date();
      const todayDay = today.toLocaleString("en-US", { weekday: "long" });
      const todayHours = restaurant.hours[todayDay]; // { open: "9:00 AM", close: "9:00 PM" }

      if (todayHours && todayHours.length === 2) {
        const openTime = todayHours[0];
        const closeTime = todayHours[1];

        // Check if times are valid
        if (typeof openTime === "string" && typeof closeTime === "string") {
          try {
            const openTimeInMinutes = parseTimeToMinutes(openTime); // Convert "open" time
            const closeTimeInMinutes = parseTimeToMinutes(closeTime); // Convert "close" time
            const nowMinutes = parseTimeToMinutes(
              `${today.getHours()}:${today.getMinutes()}`
            ); // Current time

            // Determine if the restaurant is open
            setIsOpen(
              openTimeInMinutes <= nowMinutes && nowMinutes < closeTimeInMinutes
            );
          } catch (err) {
            console.error("Error parsing times:", err);
          }
        } else {
          console.error("Invalid time format for open or close time");
        }
      }
    }
  }, [dispatch, restaurantId, restaurant]); // Added restaurant as a dependency

  // useEffect(() => {
  //   setLoading(true);
  //   dispatch(fetchRestaurantThunk(restaurantId))
  //     .then(() => setLoading(false))
  //     .catch(() => setLoading(false));
  // }, [dispatch, restaurantId]);

  useEffect(() => {
    if (restaurant?.hours) {
      const today = new Date();
      const todayDay = today.toLocaleString("en-US", { weekday: "long" });
      const todayHours = restaurant.hours[todayDay]; // { open: "9:00 AM", close: "9:00 PM" }

      if (todayHours && todayHours.length === 2) {
        const openTime = todayHours[0];
        const closeTime = todayHours[1];

        // Check if times are valid
        if (typeof openTime === "string" && typeof closeTime === "string") {
          console.log("=======> Open time:", openTime);
          console.log("=======> Close time:", closeTime);

          try {
            const openTimeInMinutes = parseTimeToMinutes(openTime); // Convert "open" time
            const closeTimeInMinutes = parseTimeToMinutes(closeTime); // Convert "close" time
            const nowMinutes = parseTimeToMinutes(
              `${today.getHours()}:${today.getMinutes()}`
            ); // Current time

            // Determine if the restaurant is open
            setIsOpen(
              openTimeInMinutes <= nowMinutes && nowMinutes < closeTimeInMinutes
            );
          } catch (err) {
            console.error("Error parsing times:", err);
          }
        } else {
          console.error("Invalid time format for open or close time");
        }
      }
    }
  }, [restaurant]);

  const handleWriteReviewClick = () => {
    navigate(`/restaurants/${restaurantId}/review`);
  };

  const handleReserveClick = () => {
    navigate(`/restaurant/${restaurantId}/new`);
  };

  const handleNavigateToImages = () => {
    navigate("images");
  };

  // Navigate to UserProfile with active section
  const navigateToSection = (section) => {
    navigate(`/user/${currentUser.id}?section=${section}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="restaurant-page">
      <div className="carousel-container">
        <Carousel>
          {restaurant.images.map((image, idx) => (
            <div key={idx}>
              <img src={image.url} alt={`Restaurant image ${idx + 1}`} />
              <p className="legend">{image.caption || `Image ${idx + 1}`}</p>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="restaurant-page-banner">
        <h2 className="restaurant-name">{restaurant?.name}</h2>
        <span>
          <div className="highlights">
            <StarRating rating={avgStarRating} />
            <span style={{ padding: "0 0.5em" }}></span>
            {formatStarRating(avgStarRating)}
            <span style={{ padding: "0 0.5em" }}></span>
            {formatReviewCount(reviewCount)}
          </div>
          <div className="highlights">
            <span
              className="open-or-closed"
              style={{
                color: isOpen ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {isOpen ? "Open Now" : "Closed"}
            </span>

            <span style={{ padding: "0 0.5em" }}></span>
            {restaurant?.price_point
              ? "$".repeat(restaurant.price_point)
              : "Price not available"}

            <span style={{ padding: "0 0.5em" }}>•</span>
            <span>{restaurant?.cuisine}</span>
            <span style={{ padding: "0 0.15em 0 0.5em" }}>
              <IoIosInformationCircle style={{ color: "navy" }} />
            </span>

            <span style={{ color: "navy" }}>
              Last updated {formatTimeAgo(restaurant.updated_at)}
            </span>
          </div>
        </span>
      </div>

      <div id="restaurant-layout">
        <div id="restaurant-main-panel">
          <div id="restaurant-menu">
            <button className="menu-button" onClick={handleWriteReviewClick}>
              <IoIosStarOutline className="button-icon" />
              Write a Review
            </button>

            <button className="menu-button" onClick={handleNavigateToImages}>
              <MdAddAPhoto className="button-icon" />
              Add Photo
            </button>
          </div>
          <div className="sub-panel">
            <h2>Location & Hours</h2>
            <p>
              {restaurant.address}, {restaurant.city}, {restaurant.state},{" "}
              {restaurant.country}
            </p>
            <RestaurantHours hours={restaurant?.hours} />
          </div>
          <div className="sub-panel">
            <ReviewsRestaurant />
          </div>
        </div>
        <div id="restaurant-side-panel">
          <h3>Make a Reservation</h3>
          <button onClick={handleReserveClick}>Book a Table</button>
          <div className="restaurant-info">
            <div className="profile-text">
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Website
              </a>
              <p>{restaurant.phone_number}</p>
              <p>
                {restaurant.address}, {restaurant.city}, {restaurant.state},{" "}
                {restaurant.country}
              </p>
            </div>
            {isOwner && (
              <button onClick={() => navigateToSection("restaurants")}>
                Manage Restaurant
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;
