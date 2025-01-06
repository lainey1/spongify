import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import AllRestaurants from "../components/AllRestaurantsList/AllRestaurants";
import RestaurantDetails from "../components/RestaurantDetails";
import ReviewFormPage from "../components/ReviewFormPage";
import UserProfile from "../components/UserProfile";
import EditProfile from "../components/EditProfile";
import Layout from "./Layout";
import UserReservations from "../components/Reservations/UserReservations";
import ManageReservations from "../components/Reservations/ManageReservations";
import CreateReservations from "../components/Reservations/CreateReservations";
import ReservationsByRestaurant from "../components/Reservations/ReservationsByRestaurant"
import UpdateReservations from "../components/Reservations/UpdateReservations";
import NotFound from "../components/NotFound/NotFound";



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
        path: "user/:userId/edit",
        element: <EditProfile />,
      },


      {
        path: "reservations/:userId",
        element: <UserReservations />,
      },


      {
        path: "/reservations/:reservationId",
        element: <ManageReservations />,
      },
      {
        path: "/restaurant/:restaurantId/new",
        element: <CreateReservations />,
      },
      {
        path: "/reservations/restaurant/:restaurantId",
        element: <ReservationsByRestaurant />,
      },
      {
        path: "/reservations/:reservationsId/edit",
        element: <UpdateReservations />,
      },


      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
