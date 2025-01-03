import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import StarRating from "../StarRating";
import { fetchRestaurantThunk } from "../../redux/restaurants";

function RestaurantDetails() {
  const dispatch = useDispatch();
  const { restaurantId } = useParams();

  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const restaurant = useSelector(
    (state) => state.restaurants.currentRestaurant
  );

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

  if (loading) return <div>Loading...</div>;

  const avgStarRating = restaurant?.reviewStats?.avgStarRating || 0;
  const reviewCount = restaurant?.reviewStats?.reviewCount || 0;

  return (
    <div className="restaurant-page">
      <div className="images-container">
        <h2>Placeholder: Restaurant Images Container</h2>
      </div>
      <div>
        <h2 className="restaurant-name">{restaurant?.name}</h2>

        <div>
          <StarRating rating={avgStarRating} />
          {avgStarRating > 0 ? (
            <span>({Number(avgStarRating).toFixed(1)})</span>
          ) : (
            <span>New</span>
          )}
          <span style={{ padding: "0 0.5em" }}>•</span>
          {reviewCount > 0 && (
            <>
              <span>
                {reviewCount} {reviewCount === 1 ? "Review" : "Reviews"}
              </span>
              <span style={{ padding: "0 0.5em" }}>•</span>
            </>
          )}
          <span>
            {restaurant?.price_point
              ? "$".repeat(restaurant.price_point)
              : "Price not available"}
          </span>
          <span style={{ padding: "0 0.5em" }}>•</span>
          <span>{restaurant?.cuisine}</span>
        </div>
        <div>
          <span className="open-or-closed">
            {isOpen ? "Open Now" : "Closed"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;
