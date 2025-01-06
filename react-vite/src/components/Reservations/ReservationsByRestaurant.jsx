import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';

const ReservationsByRestaurant = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]); // New state for restaurant data
  const [users, setUsers] = useState([]);

  // Get the list of users from the redux store (ensure it's an array)
  // const users = useSelector((state) => state.users || []); // Assuming state.users is the list of users
  
  const { restaurantId } = useParams();

  // Filter reservations by restaurant ID
  const restaurantReservations = reservations?.filter((reservation) => reservation.restaurant_id === parseInt(restaurantId));

  useEffect(() => {
    // Fetch reservations data
    const fetchReservations = async () => {
      try {
        const response = await fetch(`/api/reservations/restaurant/${restaurantId}`, {
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

    // Fetch restaurants data if necessary
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('/api/restaurants/', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }

        const data = await response.json();
        setRestaurants(data.restaurants || []);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch restaurants data if necessary
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users/', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        console.log("DATA", data);
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReservations();
    fetchRestaurants(); 
    fetchUsers();

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
      {restaurantReservations.length === 0 ? (
        <p>No reservations found. Consider adding one!</p>
      ) : (
        <ul>
          {restaurantReservations.map((reservation) => {
            // Safely find the user who made this reservation
            const user = users.find((user) => user.id === reservation.user_id);
            
            // Safely find the restaurant name
            const restaurant = restaurants.find((restaurant) => restaurant.id === reservation.restaurant_id);

            return (
              <li key={reservation.id}>
                <p><strong>Reservation ID:</strong> {reservation.id}</p>
                <p><strong>Restaurant Name:</strong> {restaurant ? restaurant.name : 'Unknown'}</p>
                <p><strong>Customer Name:</strong> {user ? user.username : 'Unknown'}</p>
                <p><strong>Time:</strong> {new Date(reservation.date).toLocaleString()}</p>
                <p><strong>Party Size:</strong> {reservation.party_size}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ReservationsByRestaurant;




