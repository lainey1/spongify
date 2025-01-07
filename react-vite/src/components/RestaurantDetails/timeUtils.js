const formatTo12HourTime = (date) => {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date object passed to formatTo12HourTime");
  }

  const hours24 = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const meridiem = hours24 >= 12 ? "PM" : "AM";

  const hours12 = hours24 % 12 || 12; // Convert to 12-hour format
  return `${hours12}:${minutes} ${meridiem}`;
};

export const parseTimeToMinutes = (time) => {
  console.log("Input to parseTimeToMinutes:", time);

  // Convert Date objects to "HH:MM AM/PM"
  if (time instanceof Date) {
    time = formatTo12HourTime(time);
  }

  // Validate time is now a string
  if (typeof time !== "string") {
    throw new Error(
      "Invalid time format. Expected a string in 'HH:MM AM/PM' format."
    );
  }

  // Regex to validate and extract components of the time string
  const timePattern = /^(\d{1,2}):(\d{2}) (AM|PM)$/i;
  const match = time.match(timePattern);

  if (!match) {
    throw new Error("Invalid time format. Expected format: 'HH:MM AM/PM'");
  }

  const [, hoursStr, minutesStr, meridiem] = match;
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    throw new Error(
      "Invalid time values. Hours must be 1-12, and minutes 0-59."
    );
  }

  // Convert to minutes since midnight
  return (
    (hours % 12) * 60 + minutes + (meridiem.toUpperCase() === "PM" ? 720 : 0)
  );
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
