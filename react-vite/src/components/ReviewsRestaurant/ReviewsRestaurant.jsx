import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../redux/review';
import { FaStar } from 'react-icons/fa6';
import './ReviewsRestaurant.css';

function ReviewsRestaurant() {
    const dispatch = useDispatch();

    const restaurant_id = useSelector((state) => 
        state.restaurants.currentRestaurant.id
    );

    const reviews = useSelector((state) => 
        Object.values(state.reviews).filter((review) => review.restaurant_id === restaurant_id)
    );

    useEffect(() => {
        if (restaurant_id) {
            dispatch(reviewActions.fetchReviewsByRestaurant(restaurant_id));
        }
    }, [dispatch, restaurant_id]);

    // console.log("reviews: ", reviews);
    // console.log("restaurant_id: ", restaurant_id);
    // console.log("currentUser: ", currentUser);

    return (
        <div className="reviews-container">
            <h2>Reviews</h2>
            {reviews.length > 0 ? (
                <ul className="reviews-list">
                    {reviews.map((review) => (
                        <li key={review.id} className="review-item">
                            <p className="review-username">{review.user.username}</p>
                            <p className="review-text">{review.review}</p>
                            <p className="review-time">{new Date(review.updated_at).toDateString()}</p>
                            <div className="review-rating">
                                {Array.from({ length: review.stars }).map((_, index) => (
                                    <FaStar key={index} style={{ color: 'e26d12' }} />
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reviews yet for this restaurant.</p>
            )}
        </div>
    );
}

export default ReviewsRestaurant;
