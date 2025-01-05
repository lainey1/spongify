import { useDispatch } from 'react-redux';
import * as reviewActions from '../../redux/review';
import { useModal } from '../../context/Modal';
import './DeleteReviewModal.css';

function DeleteReviewModal({ review }) {
    const dispatch = useDispatch();

    const { closeModal } = useModal();

    const handleDelete = async () => {
        try {
            await dispatch(reviewActions.deleteReview(review.id))
            closeModal();
        } catch (err) {
            console.error('Error deleting review:', err);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this review?</p>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={closeModal}>Cancel</button>
            </div>
        </div>
    );
}

export default DeleteReviewModal;
