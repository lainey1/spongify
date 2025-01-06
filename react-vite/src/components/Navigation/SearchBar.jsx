import { useState, useEffect } from "react";
import { FaSearch, FaBars, FaFilter } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

// Constants
const CUISINES = [
  "Italian",
  "Chinese",
  "Mexican",
  "Indian",
  "Japanese",
  "American",
  "French",
];
const MAX_PRICE_POINTS = ["$", "$$", "$$$", "$$$$", "$$$$$"];

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ cuisine: "", maxPrice: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { cuisine, maxPrice } = filters;

  useEffect(() => {
    const fetchResults = async () => {
      if (!query && !cuisine && !maxPrice) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search/?q=${encodeURIComponent(
            query
          )}&cuisine=${encodeURIComponent(
            cuisine
          )}&max_price=${encodeURIComponent(maxPrice)}&page=1&per_page=10`
        );
        const data = await response.json();
        setResults(data.response.restaurants || []);
      } catch (err) {
        setError("Error fetching results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, cuisine, maxPrice]);

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const handleApplyFilters = () => setShowFilters(false);

  return (
    <div className="search-container">
      <div className="search-bar">
        {/* Search Input */}
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants..."
            aria-label="Search restaurants"
          />
          <button className="search-button" aria-label="Search">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="filter-dropdown">
        <button
          className="filter-toggle"
          onClick={() => setShowFilters((prev) => !prev)}
          aria-label="Toggle filters"
        >
          <FaBars />
        </button>

        {showFilters && (
          <div className="filters">
            <div className="filter">
              <label htmlFor="cuisine">Cuisine</label>
              <select
                id="cuisine"
                value={cuisine}
                onChange={handleFilterChange}
              >
                <option value="">All Cuisines</option>
                {CUISINES.map((c, index) => (
                  <option key={index} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter">
              <label htmlFor="maxPrice">Max Price</label>
              <select
                id="maxPrice"
                value={maxPrice}
                onChange={handleFilterChange}
              >
                <option value="">Price Point</option>
                {MAX_PRICE_POINTS.map((m, index) => (
                  <option key={index} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="filter-button"
              aria-label="Apply filters"
              onClick={handleApplyFilters}
            >
              <FaFilter />
            </button>
          </div>
        )}
      </div>

      {/* Feedback for Loading or Errors */}
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Search Results */}
      <ul className="results">
        {results.map((result) => (
          <li key={result.id}>
            <NavLink
              to={`/restaurant/${result.id}`}
              className="result-link"
              activeClassName="active-link"
            >
              {result.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
