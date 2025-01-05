import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateReservations = () => {
    const { restaurantId } = useParams(); // Get the restaurantId from the URL
    const [date, setDate] = useState('');
    const [partySize, setPartySize] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const user = useSelector((store) => store.session.user);

    // const getCSRFTokenFromCookie = () => {
    //     // Extract CSRF token from cookies (assuming it's set by Flask)
    //     return document.cookie.match(/csrf_token=([^;]+)/)?.[1] || '';
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Ensure restaurantId is valid before making the API request
        if (!restaurantId) {
            setError('Invalid restaurant ID');
            setLoading(false);
            return;
        }

        const reservationData = {
            restaurant_id: restaurantId,
            user_id: user.id,
            date,
            party_size: partySize,
        };

        // const csrfToken = getCSRFTokenFromCookie(); // Get the CSRF token from the cookie

        fetch(`/api/restaurant/${restaurantId}/new`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 


                // 'X-CSRF-TOKEN': csrfToken, // Add CSRF token to the request header
            },
            // credentials: 'include', // To include cookies with the request (for CSRF token)
            body: JSON.stringify(reservationData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create reservation');
                }
                return response.json();
            })
            .then(data => {
                setLoading(false);
                setSuccess(data.message);
                setError(null);
                if (data.reservation) {
                    navigate(`/reservations/${data.reservation.id}`);
                }
            })
            .catch(err => {
                setLoading(false);
                setSuccess(null);
                setError('There was an error creating your reservation');
                console.error('Error:', err);
            });
    };

    return (
        <div>
            <h1>Create Reservation</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="date">Date and Time</label>
                    <input
                        type="datetime-local"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="party_size">Party Size</label>
                    <input
                        type="number"
                        id="party_size"
                        min="1"
                        value={partySize}
                        onChange={(e) => setPartySize(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Reservation...' : 'Create Reservation'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default CreateReservations;




