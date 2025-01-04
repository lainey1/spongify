import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../redux/review';
import './ReviewsRestaurant.css';

function ReviewsRestaurant() {
    const dispatch = useDispatch();

    const restaurant_id = useSelector((state) => state.restaurants.currentRestaurant?.id);
    // const currentUser = useSelector((state) => state.session.user);

    const reviews = useSelector((state) => 
        Object.values(state.reviews).filter((review) => review.restaurant_id === restaurant_id)
    );

    useEffect(() => {
        if (restaurant_id) {
            dispatch(reviewActions.fetchReviewsByRestaurant(restaurant_id));
        }
    }, [dispatch, restaurant_id]);

    console.log("reviews: ", reviews);
    // console.log("restaurant_id: ", restaurant_id);
    // console.log("currentUser: ", currentUser);

    return (
        <div className="reviews-container">
            <h2>Reviews</h2>
            {reviews.length > 0 ? (
                <ul>
                    {reviews.map((review) => (
                        <li key={review.id} className="review-item">
                            <p>{review.user.username}</p>
                            <p>{review.review}</p>
                            <p>{review.updated_at}</p>
                            <p><strong>Rating:</strong> {review.stars}</p>
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
