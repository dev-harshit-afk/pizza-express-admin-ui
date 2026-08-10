import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/login";
import Dashboard from "./layout/Dashboard";
import AuthLayout from "./layout/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [{ path: "/", element: <HomePage /> }],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [{ path: "login", element: <LoginPage /> }],
  },
]);
