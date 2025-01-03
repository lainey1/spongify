import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { GoStarFill } from "react-icons/go";

import { fetchRestaurantThunk } from "../../redux/restaurants";

function RestaurantDetails() {
    const dispatch = useDispatch();
    const { restaurant_id } = useParams();

    const [loading, setLoading] = useState(true);
    const restaurant = useSelector((state) => state.restaurants.currentRestaurant);

    useEffect(() => {
        setLoading(true);
        dispatch(fetchRestaurantThunk(restaurant_id))
            .then(() => setLoading(false))
            .catch(() => setLoading(false))
    }, [dispatch, restaurant_id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="restaurant-page">
            <div className="images-container">
                <h2>Placeholder: Restaurant Images Container</h2>
            </div>
            <div>
            <h2 className="restaurant-name">{restaurant?.name}</h2>

            <div>
                <GoStarFill style={{ paddingRight: ".25em" }} />
                {restaurant?.avgStarRating > 0 ? (
                    <span>{Number(restaurant?.avgStarRating).toFixed(1)}</span>
                ) : (
                    <span>New</span>
                )}
                <span style={{ padding: "0 0.5em" }}>•</span>
                {restaurant?.numReviews > 0 && (
                    <>
                    <span style={{ padding: "0 0.5em" }}>•</span>
                    <span>
                        {restaurant.numReviews} {restaurant.numReviews === 1 ? "Review" : "Reviews"}
                    </span>
                    <span style={{ padding: "0 0.5em" }}>•</span>
                    <span>${Number(restaurant.price_point)}</span>
                    <span style={{ padding: "0 0.5em" }}>•</span>
                    <span>{restaurant.cuisine}</span>
                    </>
                )}
            </div>
        </div>

        </div>
    )

}

export default RestaurantDetails;
