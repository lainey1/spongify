const RestaurantHours = ({ hours }) => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return (
    <table className="hours-table">
      <tbody>
        {daysOfWeek.map((day) => {
          const times = hours[day];
          return (
            <tr key={day}>
              <td className="day-cell">
                <strong>{day}</strong>
              </td>
              <td>{times ? `${times[0]} - ${times[1]}` : "Closed"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RestaurantHours;
