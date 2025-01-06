import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateReservations = () => {

  const navigate = useNavigate();

  const { reservationId } = useParams();

  console.log('RESERVE ID',reservationId)

  const [reservation, setReservation] = useState({
    date: '',
    partySize: 1,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const user = useSelector((store) => store.session.user);
  const restaurantId = useSelector((state) => state.restaurants.currentRestaurant.id);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          restaurant_id: parseInt(restaurantId),
          user_id: user.id,
          date: reservation.date+':00',
          party_size: parseInt(reservation.partySize),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || 'Failed to update reservation');
      }
    } catch (err) {
      setError('An error occurred while updating the reservation');
    } finally {
      setLoading(false);
    }
    
    navigate(`/reservations/user`);
  };


    useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await fetch(`/api/reservations/${reservationId}`);
        const data = await response.json();


        if (response.ok) {
          setReservation({
            
            date: data.reservation.date,
            partySize: data.reservation.party_size,
          });
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('An error occurred while fetching the reservation');
      }
    };

    fetchReservation();
  }, [reservationId, user.id, restaurantId]);



  return (
    <div>
      <h2>Update Reservation</h2>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={reservation.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="partySize">Party Size:</label>
          <input
            type="number"
            id="partySize"
            name="partySize"
            value={reservation.partySize}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>
        <button type="submit" disabled={loading} >
          {loading ? 'Updating...' : 'Update Reservation'}
        </button>
      </form>
    </div>
  );
};

export default UpdateReservations;

