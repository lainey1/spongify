import { useState, useEffect } from 'react';

const ManageReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setLoading(false);  // Update loading state once data is fetched
        })
        .catch(err => {
            console.error('Error fetching reservations:', err);
            setError('There was an error fetching your reservations.');
            setLoading(false); // Ensure loading is turned off even on error
        });
    }, []); 

    const handleOnClick = (reservationId) => {
        setLoading(true);  // Set loading true while deleting
        fetch(`/api/reservations/${reservationId}`, { 
            method: 'DELETE',
            credentials: 'include', 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting reservation');
            }
            return response.json();
        })
        .then(data => {
            setReservations(data.reservations); 
            setLoading(false);  // Update after deletion
        })
        .catch(err => {
            console.error('Error deleting reservation:', err);
            setError('There was an error deleting your reservation.');
            setLoading(false); // Ensure loading is turned off even on error
        });
    };

    const updatedOnClick = (reservationId) => {
        setLoading(true);  // Set loading true while updating
        fetch(`/api/reservations/${reservationId}`, { 
            method: 'PUT',
            credentials: 'include', 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error updating reservation');
            }
            return response.json();
        })
        .then(data => {
            setReservations(data.reservations); 
            setLoading(false); 
        })
        .catch(err => {
            console.error('Error updating reservation:', err);
            setError('There was an error updating your reservation.');
            setLoading(false); 
        });
    };

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
                                Delete Reservation 
                            </button>
                            <button onClick={() => updatedOnClick(reservation.id)}>
                                Update Reservation
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ManageReservations;
