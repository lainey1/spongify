import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch reservations on mount
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("/api/reservations/user", {
          method: "GET",
          credentials: "include", // Include cookies for authentication (session-based login)
        });
        if (!response.ok) {
          throw new Error("Error fetching reservations");
        }
        const data = await response.json();
        setReservations(data.reservations);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("There was an error fetching your reservations.");
      } finally {
        setLoading(false); // Ensure loading is turned off
      }
    };

    fetchReservations();
  }, []);

  // Handle reservation deletion
  const handleOnClick = async (reservationId) => {
    setLoading(true); // Set loading true while deleting
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error deleting reservation");
      }
      // const data = await response.json();
      // Remove deleted reservation from the list
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.id !== reservationId
        )
      );
    } catch (err) {
      console.error("Error deleting reservation:", err);
      setError("There was an error deleting your reservation.");
    } finally {
      setLoading(false); // Ensure loading is turned off
    }
  };

  // Navigate to the reservation update page
  const updatedOnClick = (reservationId) => {
    navigate(`/reservations/${reservationId}/edit`); // Use backticks to correctly interpolate the reservation ID
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
              <button
                onClick={() => handleOnClick(reservation.id)}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Deleting..." : "Delete Reservation"}
              </button>
              <button
                onClick={() => updatedOnClick(reservation.id)}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Loading..." : "Update Reservation"}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ManageReservations;
