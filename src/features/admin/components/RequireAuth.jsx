import { useAuth } from "../../../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return allowedRoles?.includes(auth?.role) ? (
    <Outlet />
  ) : auth?.role ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/admin/login" state={{ from: location }} replace />
  );
  // return <Outlet />
};

export default RequireAuth;
