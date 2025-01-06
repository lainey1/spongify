export const validateField = (name, value) => {
  let error = "";

  // Regular expressions for email, phone, and website validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/; // Example: 111-111-1111
  const websiteRegex =
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-_.]*)*$/;

  switch (name) {
    case "name":
    case "address":
    case "city":
    case "state":
    case "country":
      if (!value) {
        error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
      }
      break;
    case "description":
      if (!value || value.length < 30) {
        error = "Description needs 30 or more characters.";
      }
      break;
    case "price_point":
      if (!value) error = "Price point is required.";
      else if (isNaN(Number(value))) error = "Price must be a valid number.";
      break;
    case "email":
      if (value && !emailRegex.test(value)) {
        error = "Invalid email format.";
      }
      break;
    case "phone_number":
      if (value && !phoneRegex.test(value)) {
        error = "Phone number must be in the format 111-111-1111.";
      }
      break;
    case "website":
      if (value && !websiteRegex.test(value)) {
        error = "Invalid website URL.";
      }
      break;
    case "monday_open":
    case "monday_close":
    case "tuesday_open":
    case "tuesday_close":
    case "wednesday_open":
    case "wednesday_close":
    case "thursday_open":
    case "thursday_close":
    case "friday_open":
    case "friday_close":
    case "saturday_open":
    case "saturday_close":
    case "sunday_open":
    case "sunday_close":
      if (!value)
        error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
      break;
    default:
      break;
  }

  return error;
};
