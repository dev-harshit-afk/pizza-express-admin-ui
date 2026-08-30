import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

const AuthLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  if (user !== null) {
    const returnTo =
      new URLSearchParams(location.search).get("returnTo") || "/";
    return <Navigate to={returnTo} replace={true} />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
