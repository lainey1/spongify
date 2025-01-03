import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import RestaurantDetails from "../components/RestaurantDetails/RestaurantDetails";
import Layout from "./Layout";
import AllRestaurants from "../components/AllRestaurantsList/AllRestaurants";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/restaurants/:restaurantId",
        element: <RestaurantDetails />,
      },
      {
        path: "/restaurants",
        element: <AllRestaurants />,
      },
    ],
  },
]);
