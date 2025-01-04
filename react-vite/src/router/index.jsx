
import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import RestaurantDetails from '../components/RestaurantDetails';
import ReviewFormPage from '../components/ReviewFormPage';
import UserProfile from '../components/UserProfile';
import EditProfile from '../components/EditProfile';
import Layout from './Layout';



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
        path: "/restaurants",
        element: <AllRestaurants />,
      },
      {
        path: "/restaurants/:restaurantId",
        element: <RestaurantDetails />,
      },
      {

        path: '/restaurants/:restaurantId/review',
        element: <ReviewFormPage />
      },
      {
        path: "user/:userId",
        element: <UserProfile />,
      },
      {
        path: "user/:userId/edit",
        element: <EditProfile />,

      },
    ],
  },
]);
