import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as reviewActions from '../../redux/review';
import { FaStar } from 'react-icons/fa6';
import './ReviewForm.css';

function ReviewFormPage({ disabled, onChange }) {
    const dispatch = useDispatch();

    const [reviewBody, setReviewBody] = useState('');
    const [rating, setRating] = useState(0);
    const [activeRating, setActiveRating] = useState(rating);
    const [errors, setErrors] = useState({});

    const handleMouseEnter = (index) => {
        if (!disabled) {
            setActiveRating(index);
        }
    }

    const handleMouseLeave = () => {    
        if (!disabled) {
            setActiveRating(rating);
        }
    }

    const handleClick = (index) => {
        if (!disabled && onChange) {
            // console.log('Clicked rating:', index);
            setRating(index);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const newReview = {
            review: reviewBody,
            stars: parseInt(rating),
        }

        const validationErrors = {};

        if (!reviewBody) {
            validationErrors.reviewBody = "Review is required";
        }
        if(!rating) {
            validationErrors.rating = "Rating is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // console.log("validationErrors: ", validationErrors);
        // console.log("newReview: ", newReview);

        return dispatch(
            reviewActions.createReview(newReview)
        )
            .catch(async (res) => {
                const data = await res.json();
                if (data?.errors) {
                    setErrors(data.errors);
                }
            }
        )
    }

    return (
        <div className="review-form">
            <h1>Review Form</h1>
            <form onSubmit={handleSubmit}>
                <div className="review-body">
                    <label htmlFor="review">Review</label>
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
                    <label htmlFor="rating">Rating</label>
                    <input type="number" id="rating" name="rating" min="1" max="5" />
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
                >Submit Your Review</button>
            </form>
        </div>
    );
}

export default ReviewFormPage;