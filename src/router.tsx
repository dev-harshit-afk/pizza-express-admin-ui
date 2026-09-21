import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/login";
import Dashboard from "./layout/Dashboard";
import AuthLayout from "./layout/AuthLayout";
import Root from "./layout/Root";
import Users from "./pages/users/Users";
import Tenants from "./pages/tenants/Tenants";
import Product from "./pages/products/Product";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
        children: [
          { path: "/", element: <HomePage /> },
          {
            path: "/users",
            element: <Users />,
          },
          {
            path: "/restaurants",
            element: <Tenants />,
          },
          {
            path: "/products",
            element: <Product />,
          },
        ],
      },

      {
        path: "/auth",
        element: <AuthLayout />,
        children: [{ path: "login", element: <LoginPage /> }],
      },
    ],
  },
]);
