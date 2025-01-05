import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';


const ReservationsByRestaurant = ({ restaurantId }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const user = useSelector((store) => store.session.user);

  useEffect(() => {
    // Fetch reservations data from the backend API
    const fetchReservations = async () => {
      try {
        const response = await fetch(`api/reservations/restaurant/${restaurantId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', 
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Restaurant not found');
          }
          if (response.status === 403) {
            throw new Error('Unauthorized access');
          }
          throw new Error('Something went wrong');
        }

        const data = await response.json();
        setReservations(data.reservations || []); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [restaurantId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Reservations for Restaurant {restaurantId}</h2>
      {reservations.length === 0 ? (
        <p>No reservations found. Consider adding one!</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <p><strong>Reservation ID:</strong> {reservation.id}</p>
              <p><strong>Customer Name:</strong> {reservation.user.id || 'Unknown'}</p>
              <p><strong>Time:</strong> {new Date(reservation.date).toLocaleString()}</p>
              <p><strong>Seats:</strong> {reservation.partysize}</p>
              {/* Display other reservation details if necessary */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationsByRestaurant;
