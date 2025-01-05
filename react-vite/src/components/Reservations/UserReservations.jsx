import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const UserReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // Initialize navigate function

    useEffect(() => {
        fetch('/api/reservations/user', {
            method: 'GET',
            credentials: 'include', // Include cookies for authentication (session-based login)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching reservations');
            }
            return response.json();
        })
        .then(data => {
            setReservations(data.reservations); 
            setLoading(false); 
        })
        .catch(err => {
            console.error('Error fetching reservations:', err);
            setError('There was an error fetching your reservations.');
            setLoading(false); 
        });
    }, []); 

    const handleOnClick = (reservationId) => {
        navigate(`/reservations/${reservationId}`);
    }

    if (loading) return <div>Loading reservations...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Your Reservations</h1>
            <ul>
                {reservations.length === 0 ? (
                    <p>No reservations found.</p>
                ) : (
                    reservations.map((reservation) => (
                        <li key={reservation.id}>
                            <p>Date: {new Date(reservation.date).toLocaleString()}</p>
                            <p>Party Size: {reservation.party_size}</p>
                            <button onClick={() => handleOnClick(reservation.id)}>
                                View Reservation Details
                            </button>
                            
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default UserReservations;
