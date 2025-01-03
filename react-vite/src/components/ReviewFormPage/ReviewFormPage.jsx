import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as reviewActions from '../../redux/review';
import { FaStar } from 'react-icons/fa6';
import './ReviewForm.css';

function ReviewFormPage() {
    const dispatch = useDispatch();
    const restaurantId = parseInt(useParams().restaurantId);
    const currentUser = useSelector((state) => state.session.user);

    // console.log("currentUser: ", currentUser);
    // console.log("restaurantId: ", restaurantId);

    const [reviewBody, setReviewBody] = useState('');
    const [rating, setRating] = useState(0);
    const [activeRating, setActiveRating] = useState(rating);
    const [errors, setErrors] = useState({});

    const handleMouseEnter = (index) => {
        setActiveRating(index);
    }

    const handleMouseLeave = () => {    
        setActiveRating(rating);
    }

    const handleClick = (index) => {
        setRating(index);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const newReview = {
            user_id: currentUser.id,
            restaurant_id: restaurantId,
            review: reviewBody,
            stars: parseInt(rating),
        }

        // console.log("newReview: ", newReview);

        const validationErrors = {};

        if (!reviewBody) {
            validationErrors.reviewBody = "Review is required";
        }
        if (reviewBody.length < 10) {
            validationErrors.reviewBody = "Review must be at least 10 characters";
        }
        if (!rating) {
            validationErrors.rating = "Rating is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // console.log("validationErrors: ", validationErrors);
        // console.log("newReview: ", newReview);

        return dispatch(
            reviewActions.createNewReview(newReview, restaurantId)
        )
            .catch(async (res) => {
                if (res.json) {
                    const data = await res.json();
                    if (data?.errors) {
                        setErrors(data.errors);
                    }
                } else {
                    setErrors({ Error: "An unexpected error occured" });
                }
            }
        )
    }

    return (
        <div className="review-form">
            <h1>Review Form</h1>
            <div className="review-body">
                <form onSubmit={handleSubmit}>
                    <div className="review-text">
                        {/* <label htmlFor="review">Review</label> */}
                        <textarea 
                            placeholder="Leave your review here..."
                            value={reviewBody}
                            rows="4"
                            onChange={(e) => setReviewBody(e.target.value)}
                            required
                        ></textarea>
                        {errors.reviewBody && <p>{errors.reviewBody}</p>}
                    </div>
                    <div className="stars">
                        {/* <label htmlFor="rating">Rating</label> */}
                        {[1, 2, 3, 4, 5].map((index) => (
                            <div
                                key={index}
                                className={index <= activeRating ? 'filled' : 'empty'}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleClick(index)}
                            >
                                <FaStar />
                            </div>
                        ))}
                        {errors.rating && <p>{errors.rating}</p>}
                    </div>
                    <button
                        className="submit-button"
                        type="submit"
                        disabled={reviewBody.length < 10 || rating === 0}
                        title={reviewBody.length < 10 ? "Review must be at least 10 characters." : "Rating is required."}
                    >Submit Your Review</button>
                </form>
            </div>
        </div>
    );
}

export default ReviewFormPage;