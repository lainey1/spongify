import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const CreateReservations = () => {
    const { restaurantId } = useParams(); // Get the restaurantId from the URL
    const [date, setDate] = useState('');
    const [partySize, setPartySize] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    // const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const users = useSelector((store) => store.session.user);

  // const currentUserId = users ? users.id : null; 
  const currentUserId = users.id;
  console.log("User", currentUserId, restaurantId);
    // Fetch logged-in user (assuming you're getting user data from an API or local storage)
   

   
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!restaurantId) {
            setError('Invalid restaurant ID');
            setLoading(false);
            return;
        }

        
        if (!currentUserId) {
            setError('User is not logged in');
            setLoading(false);
            return;
        }

        const reservationData = {
            restaurant_id: parseInt(restaurantId),
            user_id: currentUserId, 
            date: date,
            party_size: parseInt(partySize),
        };
 console.log("DATA", reservationData);
      

        const fetchCreate = async () => {
            try {
                const response = await fetch(`/api/reservations/restaurant/${restaurantId}/new`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                  body: JSON.stringify(reservationData),                 
                });
 console.log("DATA", reservationData);
                if (!response.ok) {
                    throw new Error('Failed to create reservation');
                }

              const data = await response.json();
              
                setLoading(false);
                setSuccess(data.message);
                setError(null);
                if (data.reservation) {
                    navigate(`/reservations/${data.reservation.id}`);
                }
            } catch (err) {
                setLoading(false);
                setSuccess(null);
                setError('There was an error creating your reservation');
                console.error('Error:', err);
            }
        };

        fetchCreate();
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






