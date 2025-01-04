import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as reviewActions from '../../redux/review';
import { useModal } from '../../context/Modal';
import './EditReviewModal.css';

function EditReviewModal({ review, onClose }) {
    const dispatch = useDispatch();
    const [stars, setStars] = useState(review.stars);
    const [reviewText, setReviewText] = useState(review.review);
    const [error, setError] = useState(null);

    const { closeModal } = useModal();

    const handleSave = async () => {
        if (stars < 1 || stars > 5) {
            setError('Stars must be between 1 and 5');
            return;
        }

        if (!reviewText) {
            setError('Review cannot be empty');
            return;
        }

        setError(null);

        try {
            await dispatch(reviewActions.updateExistingReview(review.id, { stars, review: reviewText.trim() }));
            closeModal();
            location.reload();
        } catch (err) {
            console.error('Error updating review:', err);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Edit Review</h3>
                {error && <p className="error">{error}</p>}
                <label>Stars:</label>
                <input
                    type="number"
                    value={stars}
                    onChange={(e) => setStars(Number(e.target.value))}
                    min="1"
                    max="5"
                />
                <label>Review:</label>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default EditReviewModal;
