import { useDispatch } from 'react-redux';
import * as reviewActions from '../../redux/review';
import './DeleteReviewModal.css';

function DeleteReviewModal({ review, onClose }) {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(reviewActions.deleteReview(review.id))
            .then(onClose);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this review?</p>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default DeleteReviewModal;
