import { useState } from 'react';

const CreateReservation = ({ restaurantId }) => {
    const [date, setDate] = useState('');
    const [partySize, setPartySize] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);  // Set loading state to true while waiting for the API response

        // Create the reservation data object
        const reservationData = {
            date,
            party_size: partySize,
        };

        // Send a POST request to the API to create a reservation
        fetch(`/api/restaurant/${restaurantId}/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Assuming CSRF token is available in the cookies
                'X-CSRF-TOKEN': document.cookie.match(/csrf_token=([^;]+)/)[1], 
            },
            credentials: 'include',  // Send cookies (authentication tokens)
            body: JSON.stringify(reservationData),  // Stringify the reservation data to send as request body
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
            setError(null);  // Clear any previous errors
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

export default CreateReservation;
