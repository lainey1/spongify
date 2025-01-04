import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpot, editSpot } from "../../store/spots/thunks";
import "./Form.css";

const UpdateSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();

  // Selector
  const spot = useSelector((state) => state.spots.currentSpot);

  // State Hooks
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    lat: "",
    lng: "",
    name: "",
    description: "",
    price: "",
    SpotImages: [
      { url: "", preview: true },
      { url: "", preview: false },
      { url: "", preview: false },
      { url: "", preview: false },
      { url: "", preview: false },
    ],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLoading(true);
    dispatch(fetchSpot(spotId))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spot) {
      setFormData({
        country: spot.country || "",
        address: spot.address || "",
        city: spot.city || "",
        state: spot.state || "",
        lat: spot.lat || "",
        lng: spot.lng || "",
        name: spot.name || "",
        description: spot.description || "",
        price: spot.price || "",
        SpotImages: ensureSpotImagesLength(spot?.SpotImages || []),
      });
    }
  }, [spot]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.name) newErrors.name = "Name of your spot is required";
    if (!formData.description || formData.description.length < 30)
      newErrors.description = "Description needs 30 or more characters";
    if (!formData.price) newErrors.price = "Price per night is required";
    else if (isNaN(Number(formData.price)))
      newErrors.price = "Price must be a valid number";

    if (!formData.SpotImages[0]?.url.trim())
      newErrors.previewImageUrl =
        "At least one image URL (preview) is required";

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Utility to ensure SpotImages always has exactly 5 slots
  const ensureSpotImagesLength = (images) => {
    const filledImages = [...images];
    while (filledImages.length < 5) {
      filledImages.push({ url: "", preview: false });
    }
    return filledImages.slice(0, 5);
  };

  // Image input change handler
  const handleImageChange = (index, value) => {
    setFormData((prev) => {
      const updatedImages = [...prev.SpotImages];
      updatedImages[index] = {
        url: value,
        preview: index === 0, // First image is preview
      };
      const updatedFormData = {
        ...prev,
        SpotImages: ensureSpotImagesLength(updatedImages),
      };
      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedSpotData = {
      ...formData,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      price: parseFloat(formData.price),
      SpotImages: formData.SpotImages.filter((img) => img.url.trim()),
    };

    try {
      await dispatch(editSpot(spotId, updatedSpotData));
      navigate(`/spots/${spotId}`);
    } catch (error) {
      console.error("Failed to update spot:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <h1>Update Your Spot</h1>
        <section>
          <h2>Where&apos;s your place located?</h2>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>

          <select
            className="select-field"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
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
            className="input-field"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Street Address"
            required
          />
          {errors.address && <p className="error-message">{errors.address}</p>}
          <input
            className="input-field"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
            required
          />
          {errors.city && <p className="error-message">{errors.city}</p>}
          <input
            className="input-field"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="State"
            required
          />
          {errors.state && <p className="error-message">{errors.state}</p>}
          <div id="lat-long">
            <input
              className="lat"
              type="number"
              name="lat"
              value={formData.lat}
              onChange={handleInputChange}
              placeholder="Latitude"
            />
            ,
            <input
              className="long"
              type="number"
              name="lng"
              value={formData.lng}
              onChange={handleInputChange}
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
            className="textarea-field"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Please write at least 30 characters"
            required
          />
          {errors.description && (
            <p className="error-message">{errors.description}</p>
          )}
        </section>
        <section>
          <h2>Create a title for your spot</h2>
          <p>
            Catch guests&apos; attention with a spot title that highlights what
            makes your place special.
          </p>
          <input
            className="input-field"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name of your spot"
            required
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </section>
        <section>
          <h2>Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <input
            className="input-field"
            type="number"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                price: parseFloat(e.target.value) || "",
              }))
            }
            placeholder="Price per night (USD)"
            required
          />

          {errors.price && <p className="error-message">{errors.price}</p>}
        </section>
        {/* Section for photo inputs */}
        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>

          <div className="image-url-container">
            {formData.SpotImages.map((image, index) => (
              <input
                key={index}
                className="input-field"
                value={image?.url || ""}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={`Image URL ${index === 0 ? "Preview" : index}`}
              />
            ))}
          </div>
          {errors.previewImageUrl && (
            <p className="error-message">{errors.previewImageUrl}</p>
          )}
        </section>
        <button type="submit">Update Your Spot</button>
      </form>
    </div>
  );
};

export default UpdateSpot;
