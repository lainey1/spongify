export const formatTo12HourTime = (time) => {
  if (time === "Closed") {
    return "Closed"; // If the time is "Closed", just return it as it is
  }

  const [hours24, minutes] = time.split(":").map((x) => parseInt(x, 10));

  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${hours12}:${formattedMinutes} ${meridiem}`;
};

export const parseTimeToMinutes = (time) => {
  if (time === "Closed") {
    return -1; // Return a special value to signify "Closed"
  }

  const timePattern = /^(\d{1,2}):(\d{2}) (AM|PM)$/i;
  const match = time.match(timePattern);

  if (match) {
    const [, hoursStr, minutesStr, meridiem] = match;
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    return (
      (hours % 12) * 60 + minutes + (meridiem.toUpperCase() === "PM" ? 720 : 0)
    );
  }

  throw new Error("Invalid time format. Expected format: 'HH:MM AM/PM'");
};

export const formatTimeAgo = (updatedAt) => {
  const now = new Date();
  const updatedDate = new Date(updatedAt);

  const diffInMilliseconds = now - updatedDate;
  const diffInSeconds = diffInMilliseconds / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;
  const diffInWeeks = diffInDays / 7;
  const diffInMonths = diffInDays / 30;

  if (diffInMonths >= 1)
    return `${Math.floor(diffInMonths)} month${
      diffInMonths > 1 ? "s" : ""
    } ago`;
  if (diffInWeeks >= 1)
    return `${Math.floor(diffInWeeks)} week${diffInWeeks > 1 ? "s" : ""} ago`;
  if (diffInDays >= 1)
    return `${Math.floor(diffInDays)} day${diffInDays > 1 ? "s" : ""} ago`;
  if (diffInHours >= 1)
    return `${Math.floor(diffInHours)} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInMinutes >= 1)
    return `${Math.floor(diffInMinutes)} minute${
      diffInMinutes > 1 ? "s" : ""
    } ago`;
  return "Just now";
};
