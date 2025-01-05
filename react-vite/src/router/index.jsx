import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import AllRestaurants from "../components/AllRestaurantsList/AllRestaurants";
import RestaurantDetails from "../components/RestaurantDetails";
import ReviewFormPage from "../components/ReviewFormPage";
import UserProfile from "../components/UserProfile";
import EditProfile from "../components/EditProfile";
import Layout from "./Layout";
import About from "../components/About/About";
import RestaurantForm from "../components/ManageRestaurants/RestaurantForm";
import UpdateRestaurant from "../components/ManageRestaurants/UpdateRestaurant";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <AllRestaurants />,
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
        path: "/restaurants",
        element: <AllRestaurants />,
      },
      {
        path: "/restaurants/new",
        element: <RestaurantForm />,
      },
      {
        path: "/restaurants/:restaurantId",
        element: <RestaurantDetails />,
      },
      {
        path: "/restaurants/:restaurantId/review",
        element: <ReviewFormPage />,
      },
      {
        path: "user/:userId",
        element: <UserProfile />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "user/:userId/edit",
        element: <EditProfile />,
      },
      {
        path: "restaurants/:restaurantId/edit",
        element: <UpdateRestaurant />,
      },
    ],
  },
]);
