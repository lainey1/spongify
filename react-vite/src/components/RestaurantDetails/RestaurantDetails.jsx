import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IoIosStarOutline } from "react-icons/io";
import { MdAddAPhoto } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import { fetchRestaurantThunk } from "../../redux/restaurants";
import StarRating from "../StarRating";
import ReviewsRestaurant from "../ReviewsRestaurant";
import "./RestaurantDetails.css";

function RestaurantDetails() {
  const dispatch = useDispatch();
  const { restaurantId } = useParams();

  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = useSelector((state) => state.session.user);
  const restaurant = useSelector(
    (state) => state.restaurants.currentRestaurant
  );

  const isOwner = currentUser?.id === restaurant?.owner_id;

  useEffect(() => {
    setLoading(true);
    dispatch(fetchRestaurantThunk(restaurantId))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch, restaurantId]);

  useEffect(() => {
    if (restaurant?.hours) {
      checkIfOpen(restaurant.hours);
    }
  }, [restaurant]);

  const checkIfOpen = (hours) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDay = daysOfWeek[new Date().getDay()];
    const currentTime = new Date();
    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();

    const todayHours = hours[currentDay];
    if (todayHours) {
      const [openTime, closeTime] = todayHours.map((time) =>
        parseTimeToMinutes(time)
      );
      if (currentMinutes >= openTime && currentMinutes <= closeTime) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  const parseTimeToMinutes = (time) => {
    const [hourMinute, meridiem] = time.split(" ");
    const [hours, minutes] = hourMinute.split(":").map(Number);
    const totalMinutes =
      (hours % 12) * 60 + minutes + (meridiem === "PM" ? 720 : 0);
    return totalMinutes;
  };

  const avgStarRating = restaurant?.reviewStats?.avgStarRating || 0;
  const reviewCount = restaurant?.reviewStats?.reviewCount || 0;

  function formatHours(hours) {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return (
      <table className="hours-table">
        <tbody>
          {daysOfWeek.map((day) => {
            const times = hours[day];

            if (!times || times.length === 0) {
              return (
                <tr key={day}>
                  <td className="day-cell">
                    <strong>{day}</strong>
                  </td>
                  <td>Closed</td>
                </tr>
              );
            }

            const [open, close] = times;
            return (
              <tr key={day}>
                <td className="day-cell">
                  <strong>{day}</strong>
                </td>
                <td>
                  {open} - {close}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  function formatTimeAgo(updatedAt) {
    const now = new Date();
    const updatedDate = new Date(updatedAt);

    const diffInMilliseconds = now - updatedDate;
    const diffInSeconds = diffInMilliseconds / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    const diffInWeeks = diffInDays / 7;
    const diffInMonths = diffInDays / 30; // Approximation

    // Return a human-readable time ago format
    if (diffInMonths >= 1) {
      return `${Math.floor(diffInMonths)} month${
        Math.floor(diffInMonths) > 1 ? "s" : ""
      } ago`;
    } else if (diffInWeeks >= 1) {
      return `${Math.floor(diffInWeeks)} week${
        Math.floor(diffInWeeks) > 1 ? "s" : ""
      } ago`;
    } else if (diffInDays >= 1) {
      return `${Math.floor(diffInDays)} day${
        Math.floor(diffInDays) > 1 ? "s" : ""
      } ago`;
    } else if (diffInHours >= 1) {
      return `${Math.floor(diffInHours)} hour${
        Math.floor(diffInHours) > 1 ? "s" : ""
      } ago`;
    } else if (diffInMinutes >= 1) {
      return `${Math.floor(diffInMinutes)} minute${
        Math.floor(diffInMinutes) > 1 ? "s" : ""
      } ago`;
    } else {
      return `Just now`;
    }
  }

  const handleReserveClick = () => {
    alert("Feature coming soon...");
  };

  const handleManageClick = () => {
    alert("Manage your restaurant settings...");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="restaurant-page">
      <div className="sub-panel">
        <h2>[PLACEHOLDER: Restaurant Images Container]</h2>
      </div>
      <div className="restaurant-page-banner">
        <h2 className="restaurant-name">{restaurant?.name}</h2>
        <span>
          <div className="highlights">
            <StarRating rating={avgStarRating} />
            {avgStarRating > 0 ? (
              <span>{Number(avgStarRating).toFixed(1)}</span>
            ) : (
              <span>New</span>
            )}
            <span style={{ padding: "0 0.5em" }}></span>
            {reviewCount > 0 && (
              <>
                <span>
                  ({reviewCount} {reviewCount === 1 ? "Review" : "Reviews"})
                </span>
              </>
            )}
          </div>
          <div className="highlights">
            <span
              className="open-or-closed"
              style={{
                color: isOpen ? "green" : "red",
                fontWeight: "bold", // Optional for emphasis
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
            <button className="menu-button" onClick={handleReserveClick}>
              <IoIosStarOutline className="button-icon" />
              Write a Review
            </button>
            <button className="menu-button" onClick={handleReserveClick}>
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
            <div>{formatHours(restaurant.hours)}</div>
          </div>
          <div className="sub-panel">
            <h2>[PLACEHOLDER: Restaurant Review Section]</h2>
            {/* <ReviewsRestaurant /> */}
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
              <button onClick={handleManageClick}>Manage Restaurant</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;
