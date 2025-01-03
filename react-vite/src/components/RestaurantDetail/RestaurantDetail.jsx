import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import { fetchRestaurantThunk } from "../../redux/restaurants";

function RestaurantDetail() {
    const dispatch = useDispatch();
    const { restaurant_id } = useParams();

    const [loading, setLoading] = useState(true);
    const restaurant = useSelector((state) => state.restaurants.currentRestaurant);

    useEffect(() => {
        setLoading(true);
        dispatch(fetchRestaurantThunk(restaurant_id))
    })

}
