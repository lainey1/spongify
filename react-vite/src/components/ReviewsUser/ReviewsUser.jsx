import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../redux/review';
import { FaStar } from 'react-icons/fa6';
import OpenModalButton from '../OpenModalButton';
import EditReviewModal from './EditReviewModal';
import DeleteReviewModal from './DeleteReviewModal';
import './ReviewsUser.css';

function ReviewsUser() {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.session.user);
    const reviews = useSelector((state) => {
        if (!state.reviews || !currentUser) return [];
        return Object.values(state.reviews).filter(
            (review) => review.user_id === currentUser.id
        );
    });

    // console.log('reviews: ', reviews);
    // console.log('currentUser: ', currentUser);

    useEffect(() => {
        if (currentUser?.id) {
            dispatch(reviewActions.fetchReviewsByUser(currentUser.id));
        }
    }, [dispatch, currentUser?.id]);

    if (!currentUser) {
        return <div>Please log in to view your reviews.</div>;
    }

    return (
        <div className="reviews-section">
            <h3>Your Reviews</h3>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="review-item">
                        <div className="review-top">
                            <span className="restaurant-image">
                                <img src={review.restaurant.image_url} alt="restaurant" />
                            </span>
                            <span className="review-restaurant">
                                <p className="restaurant-name">{review.restaurant.name}</p>
                                <p className="restaurant-location">{review.restaurant.city}, {review.restaurant.state} {review.restaurant.country}</p>
                            </span>
                            <span className="review-buttons">
                                <button className="edit-button">Edit</button>
                                <button className="delete-button">Delete</button>
                                <OpenModalButton
                                    modalComponent={<EditReviewModal 
                                        review={review} 
                                        onClose={() => console.log('Modal closed')}
                                    />}
                                    buttonText="Edit"
                                />
                                <OpenModalButton
                                    modalComponent={<DeleteReviewModal review={review} />}
                                    buttonText="Delete"
                                />
                            </span>
                        </div>
                        <div className="review-star-and-text">
                            {Array.from({ length: review.stars }).map((_, index) => (
                                <FaStar key={index} style={{ color: 'e26d12' }} />
                            ))}
                            <p>{review.review}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>You have no reviews yet.</p>
            )}
        </div>
    );
}

export default ReviewsUser;
