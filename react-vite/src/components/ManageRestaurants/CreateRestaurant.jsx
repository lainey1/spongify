import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createNewRestaurant } from "../../store/restaurants/thunks";
import "./Form.css";

const CreateRestaurant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { restaurantId } = useParams();

  // State Hooks for each field
  // const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);

  const [errors, setErrors] = useState({});

  // Validation helper functions

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "country":
      case "address":
      case "city":
      case "state":
      case "name":
        if (!value)
          error = `${
            name.charAt(0).toUpperCase() + name.slice(1)
          } is required.`;
        break;
      case "description":
        if (!value || value.length < 30)
          error = "Description needs 30 or more characters.";
        break;
      case "price":
        if (!value) error = "Price per night is required.";
        else if (isNaN(Number(value))) error = "Price must be a valid number.";
        break;
      case "previewImageUrl":
        if (!value.trim()) error = "Preview Image URL is required.";
        break;
      default:
        break;
    }
    return error;
  };

  // Handle input changes and validate immediately after input
  const handleInputChange = (setter, fieldName, value) => {
    setter(value);
    const error = validateField(fieldName, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalErrors = validateAllFields();
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    const newRestaurantData = {
      country,
      address,
      city,
      state,
      lat: parseFloat(lat) || null,
      lng: parseFloat(lng) || null,
      name,
      description,
      price: parseFloat(price),
      imageUrls: [previewImageUrl, ...imageUrls]
        .filter(Boolean)
        .filter((url) => url.trim()),
    };

    try {
      // Await the dispatch to get the restaurantId returned from createNewRestaurant
      const restaurantId = await dispatch(
        createNewRestaurant(newRestaurantData)
      ); // Ensure this returns the ID
      // await dispatch(addImagesToRestaurant(restaurantId, newRestaurantData.imageUrls));
      navigate(`/restaurants/${restaurantId}`); // Use the returned restaurantId for navigation
    } catch (error) {
      console.error("Failed to create restaurant:", error);
    }
  };

  const validateAllFields = () => {
    const finalErrors = {};
    [
      "country",
      "address",
      "city",
      "state",
      "name",
      "description",
      "price",
      "previewImageUrl",
    ].forEach((field) => {
      const error = validateField(field, eval(field));
      if (error) finalErrors[field] = error;
    });
    return finalErrors;
  };

  const errorMessages = Object.values(errors);

  // useEffect(() => {
  //   setLoading(true);
  //   dispatch(fetchRestaurant(restaurantId))
  //     .then(() => setLoading(false))
  //     .catch(() => setLoading(false));
  // }, [dispatch, restaurantId]);

  // if (loading) return <div>Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <h1>Create a New Restaurant</h1>

        <section>
          <h2>Where&apos;s your place located?</h2>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>

          <select
            className="select-field"
            name="country"
            value={country}
            aria-describedby="country-error"
            onChange={(e) =>
              handleInputChange(setCountry, "country", e.target.value)
            }
            placeholder="Country"
            required
          >
            <option value="" disabled>
              Select a Country
            </option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Australia">Australia</option>
            <option value="Japan">Japan</option>
            <option value="Mexico">Mexico</option>
            <option value="Italy">Italy</option>
            <option value="Spain">Spain</option>
          </select>
          {errors.country && <p className="error-message">{errors.country}</p>}

          <input
            className={errors.address ? "error" : ""}
            aria-describedby="address-error"
            onChange={(e) =>
              handleInputChange(setAddress, "address", e.target.value)
            }
            value={address}
            placeholder="Street Address"
          />
          {errors.address && (
            <p id="address-error" className="error">
              {errors.address}
            </p>
          )}

          <input
            className={errors.city ? "error" : ""}
            aria-describedby="city-error"
            onChange={(e) => handleInputChange(setCity, "city", e.target.value)}
            value={city}
            placeholder="City"
          />
          {errors.city && (
            <p id="city-error" className="error">
              {errors.city}
            </p>
          )}

          <input
            value={state}
            className={errors.state ? "error" : ""}
            aria-describedby="state-error"
            onChange={(e) =>
              handleInputChange(setState, "state", e.target.value)
            }
            placeholder="State"
          />
          {errors.state && (
            <p id="state-error" className="error">
              {errors.state}
            </p>
          )}

          <div id="lat-long">
            <input
              className="lat"
              type="number"
              name="lat"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Latitude"
            />
            ,
            <input
              className="long"
              type="number"
              name="lng"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="Longitude"
            />{" "}
          </div>
          <div
            style={{
              fontSize: "0.8em",
              fontStyle: "italic",
              textAlign: "right",
              marginRight: "1em",
              paddingBottom: "1em",
            }}
          >
            *Optional
          </div>
        </section>

        <section>
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>

          <textarea
            value={description}
            className={errors.description ? "error" : ""}
            aria-describedby="description-error"
            onChange={(e) =>
              handleInputChange(setDescription, "description", e.target.value)
            }
            placeholder="Please write at least 30 characters"
          />
          {errors.description && (
            <p id="description-error" className="error">
              {errors.description}
            </p>
          )}
        </section>

        <section>
          <h2>Create a title for your restaurant</h2>
          <p>
            Catch guests&apos; attention with a restaurant title that highlights
            what makes your place special.
          </p>

          <input
            value={name}
            className={errors.name ? "error" : ""}
            aria-describedby="name-error"
            onChange={(e) => handleInputChange(setName, "name", e.target.value)}
            placeholder="Name of your restaurant"
          />
          {errors.name && (
            <p id="name-error" className="error">
              {errors.name}
            </p>
          )}
        </section>

        <section>
          <h2>Set a base price for your restaurant</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <input
            type="number"
            name="price"
            step="0.01"
            value={price}
            className={errors.price ? "error" : ""}
            aria-describedby="price-error"
            onChange={(e) =>
              handleInputChange(setPrice, "price", e.target.value)
            }
            placeholder="Price per night (USD)"
            required
          />
          {errors.price && (
            <p id="price-error" className="error">
              {errors.price}
            </p>
          )}
        </section>

        <section>
          <h2>Liven up your restaurant with photos</h2>
          <p>Submit a link to at least one photo to publish your restaurant.</p>

          <div className="image-url-container">
            <input
              className={errors.password ? "error" : ""}
              aria-describedby="password-error"
              name="previewImageUrl"
              value={previewImageUrl}
              onChange={(e) =>
                handleInputChange(
                  setPreviewImageUrl,
                  "previewImageUrl",
                  e.target.value
                )
              }
              placeholder="Required: Preview Image URL"
            />

            {errors.previewImageUrl && (
              <p id="previewImageUrl-error" className="error">
                {errors.previewImageUrl}
              </p>
            )}

            {imageUrls.map((url, index) => (
              <input
                key={index}
                className={errors.url ? "error" : ""}
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={`Image URL ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <button type="submit">Create Restaurant</button>
      </form>

      {errorMessages.length > 0 && (
        <div className="error-messages">
          {errorMessages.map((error, index) => (
            <p key={index} className="error">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateRestaurant;
