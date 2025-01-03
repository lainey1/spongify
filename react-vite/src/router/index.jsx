
import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import UserProfile from '../components/UserProfile/UserProfile';
import EditProfile from '../components/EditProfile';
import Layout from './Layout';
import RestaurantDetails from "../components/RestaurantDetails/RestaurantDetails";
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
        path: "/login",
        element: <LoginFormPage />,
      },
      {
        path: "/signup",
        element: <SignupFormPage />,
      },
      {

        path: "user/:userId",
        element: <UserProfile />,
      },
      {
        path: "user/:userId/edit",
        element: <EditProfile />,
      },


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
