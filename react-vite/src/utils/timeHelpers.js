export const parseTimeToMinutes = (time) => {
  const [hourMinute, meridiem] = time.split(" ");
  const [hours, minutes] = hourMinute.split(":").map(Number);
  return (hours % 12) * 60 + minutes + (meridiem === "PM" ? 720 : 0);
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
