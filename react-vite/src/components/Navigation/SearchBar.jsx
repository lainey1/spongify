import { useState, useEffect } from "react";
import { FaSearch, FaBars, FaFilter } from "react-icons/fa";
import './SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const cuisines = ["Italian", "Chinese", "Mexican", "Indian", "Japanese"];

    useEffect(() => {
        if (query === "" || cuisine === "" || maxPrice === "") {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/search/?q=${encodeURIComponent(query)}&cuisine=${encodeURIComponent(cuisine)}&max_price=${encodeURIComponent(maxPrice)}&page=1&per_page=10`);
                const data = await response.json();
                setResults(data.response.restaurants);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, cuisine, maxPrice]);

    return (
        <div className="search-container">
            <div className="search-bar">
                {/* Filter Dropdown Button */}
                <div className="filter-dropdown">
                    <button
                        className="filter-toggle"
                        onClick={() => setShowFilters(!showFilters)}
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
                                    onChange={(e) => setCuisine(e.target.value)}
                                >
                                    <option value="">All Cuisines</option>
                                    {cuisines.map((c, index) => (
                                        <option key={index} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter">
                                <label htmlFor="maxPrice">Max Price</label>
                                <input
                                    id="maxPrice"
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="e.g., 50"
                                />
                            </div>

                            <button className="filter-button" aria-label="Apply filters">
                                <FaFilter />
                            </button>
                        </div>
                    )}
                </div>

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

            {/* Loading State */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="results">
                    {results.map((result, index) => (
                        <li key={index}>{result.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;


