import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RestaurantForm.css";

function RestaurantForm() {
  const navigate = useNavigate();
  const [formSchema, setFormSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});

  useEffect(() => {
    fetch("/api/restaurants/form-schema")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch form schema.");
        }
        return res.json();
      })
      .then((data) => {
        setFormSchema(data);
        const initialData = {};
        Object.keys(data).forEach((field) => {
          initialData[field] = data[field].default || "";
        });
        setFormData(initialData);
        setLoading(false);
      })
      .catch((err) => {
        setError({ form: err.message });
        setLoading(false);
      });
  }, []);

  const validateField = (name, value) => {
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
          error = `${
            name.charAt(0).toUpperCase() + name.slice(1)
          } is required.`;
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
          error = `${
            name.charAt(0).toUpperCase() + name.slice(1)
          } is required.`;
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field immediately after change
    const fieldError = validateField(name, value);
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log form data before submitting
    console.log("Submitting form data: ", formData);

    // Transform the hours data into the expected format
    const transformedData = { ...formData };

    const daysOfWeek = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    const hours = {};

    daysOfWeek.forEach((day) => {
      const open = transformedData[`${day}_open`];
      const close = transformedData[`${day}_close`];

      if (open && close) {
        hours[day.charAt(0).toUpperCase() + day.slice(1)] = [open, close];
        // Remove the open/close fields from the data to prevent sending them separately
        delete transformedData[`${day}_open`];
        delete transformedData[`${day}_close`];
      }
    });

    // Add the transformed hours object to the form data
    transformedData["hours"] = hours;

    // Log the transformed data
    console.log("Transformed form data: ", transformedData);

    // Send the transformed formData to the backend
    fetch("/api/restaurants/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData), // Send the transformed data as JSON
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // Handle successful form submission (e.g., redirect or show a success message)
          console.log("Restaurant created:", data);
          navigate(`/restaurants/${data.id}`);
        }
      })
      .catch((err) => {
        setError("Error submitting form");
        console.error(err);
      });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error.form) return <div className="error">Error: {error.form}</div>;

  return (
    <form className="restaurant-form" onSubmit={handleSubmit}>
      <h1 className="form-title">Create Restaurant</h1>
      <p>
        All fields are a must! Once you hit "Submit," we'll whisk you away to
        your freshly minted restaurant page in Eaterverse, where you can show
        off your new restaurant and add some delicious images.
      </p>

      {/* Basic Information Section */}
      <div className="form-section">
        <h2>Basic Information</h2>

        {/* Name Field */}
        <div className="form-group">
          <label className="form-label">{formSchema["name"]?.label}</label>
          <input
            className="form-input"
            type="text"
            name="name"
            value={formData["name"]}
            onChange={handleChange}
          />
          {error["name"] && (
            <span className="error-message">{error["name"]}</span>
          )}
        </div>

        {/* Address Field */}
        <div className="form-group">
          <label className="form-label">{formSchema["address"]?.label}</label>
          <input
            className="form-input"
            type="text"
            name="address"
            value={formData["address"]}
            onChange={handleChange}
          />
          {error["address"] && (
            <span className="error-message">{error["address"]}</span>
          )}
        </div>

        {/* City Field */}
        <div className="form-group">
          <label className="form-label">{formSchema["city"]?.label}</label>
          <input
            className="form-input"
            type="text"
            name="city"
            value={formData["city"]}
            onChange={handleChange}
          />
          {error["city"] && (
            <span className="error-message">{error["city"]}</span>
          )}
        </div>

        {/* State Field */}
        <div className="form-group">
          <label className="form-label">{formSchema["state"]?.label}</label>
          <input
            className="form-input"
            type="text"
            name="state"
            value={formData["state"]}
            onChange={handleChange}
          />
          {error["state"] && (
            <span className="error-message">{error["state"]}</span>
          )}
        </div>

        {/* Country Field */}
        <div className="form-group">
          <label className="form-label">{formSchema["country"]?.label}</label>
          <input
            className="form-input"
            type="text"
            name="country"
            value={formData["country"]}
            onChange={handleChange}
          />
          {error["country"] && (
            <span className="error-message">{error["country"]}</span>
          )}
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="form-section">
        <h2>Contact Details</h2>
        {["phone_number", "email", "website"].map((field) => (
          <div className="form-group" key={field}>
            <label className="form-label">{formSchema[field]?.label}</label>
            <input
              className="form-input"
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
            {error[field] && (
              <span className="error-message">{error[field]}</span>
            )}
          </div>
        ))}
      </div>

      {/* Operating Hours Section */}
      <div className="form-section">
        <h2>Operating Hours</h2>
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <div className="form-group" key={day}>
            <label className="form-label">{day}</label>
            <div className="form-hours">
              <select
                className="form-input"
                name={`${day.toLowerCase()}_open`}
                value={formData[`${day.toLowerCase()}_open`]}
                onChange={handleChange}
              >
                {formSchema[`${day.toLowerCase()}_open`]?.choices.map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
              <span>to</span>
              <select
                className="form-input"
                name={`${day.toLowerCase()}_close`}
                value={formData[`${day.toLowerCase()}_close`]}
                onChange={handleChange}
              >
                {formSchema[`${day.toLowerCase()}_close`]?.choices.map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>
            {error[`${day.toLowerCase()}_open`] && (
              <span className="error-message">
                {error[`${day.toLowerCase()}_open`]}
              </span>
            )}
            {error[`${day.toLowerCase()}_close`] && (
              <span className="error-message">
                {error[`${day.toLowerCase()}_close`]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Additional Information Section */}
      <div className="form-section">
        <h2>Additional Information</h2>
        {["cuisine", "price_point", "description"].map((field) => (
          <div className="form-group" key={field}>
            <label className="form-label">{formSchema[field]?.label}</label>
            {field === "description" ? (
              <textarea
                className="form-input"
                name="description"
                value={formData["description"]}
                onChange={handleChange}
              />
            ) : (
              <select
                className="form-input"
                name={field}
                value={formData[field]}
                onChange={handleChange}
              >
                {formSchema[field]?.choices.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            )}
            {error[field] && (
              <span className="error-message">{error[field]}</span>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button className="submit-btn" type="submit">
        Submit
      </button>
    </form>
  );
}

export default RestaurantForm;
