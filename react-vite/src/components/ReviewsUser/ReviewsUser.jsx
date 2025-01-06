import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as reviewActions from "../../redux/review";
import { thunkFetchRestaurantImages } from "../../redux/restaurantImages";
import { FaStar } from "react-icons/fa6";
import OpenModalButton from "../OpenModalButton";
import EditReviewModal from "./EditReviewModal";
import DeleteReviewModal from "./DeleteReviewModal";
import "./ReviewsUser.css";

function ReviewsUser() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => {
    if (!state.reviews || !currentUser) return [];
    return Object.values(state.reviews).filter(
      (review) => review.user_id === currentUser.id
    );
  });

  const images = useSelector((state) => state.restaurantImages.images);

  useEffect(() => {
    if (currentUser?.id) {
      console.log("Dispatching fetch reviews and images");
      dispatch(reviewActions.fetchReviewsByUser(currentUser.id));
      dispatch(thunkFetchRestaurantImages());
    }
  }, [dispatch, currentUser?.id]);

  if (!currentUser) {
    return <div>Please log in to view your reviews.</div>;
  }

  return (
    <div className="reviews-section">
      <h3>Your Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => {
          // Get the image URL for this restaurant from the restaurantImages state
          const restaurantImage = images.find(
            (image) =>
              image.restaurant_id === review.restaurant_id && image.is_preview
          );

          return (
            <div key={review.id} className="review-item">
              <div className="review-top">
                <div className="image-reviews">
                  <span className="restaurant-image-tile">
                    {restaurantImage ? (
                      <img
                        src={restaurantImage.url}
                        alt="restaurant"
                        className="restaurant-image"
                      />
                    ) : (
                      <p>No image found</p>
                    )}
                  </span>
                  <div className="review-star-and-text">
                    {Array.from({ length: review.stars }).map((_, index) => (
                      <FaStar key={index} style={{ color: "#e26d12" }} />
                    ))}
                  </div>
                </div>
                <span className="review-restaurant">
                  <p className="restaurant-name">{review.restaurant.name}</p>
                  <p className="restaurant-location">
                    {review.restaurant.city}, {review.restaurant.state}{" "}
                    {review.restaurant.country}
                  </p>
                  <p>{review.review}</p>
                </span>
                <span className="review-buttons">
                  <OpenModalButton
                    modalComponent={<EditReviewModal review={review} />}
                    buttonText="Edit"
                  />
                  <OpenModalButton
                    modalComponent={<DeleteReviewModal review={review} />}
                    buttonText="Delete"
                  />
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <p>You have no reviews yet.</p>
      )}
    </div>
  );
}

export default ReviewsUser;
