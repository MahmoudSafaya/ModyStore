import { useAuth } from "../../../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth) {
    // If auth state is still loading or unavailable, prevent rendering
    return null;
  }

  return allowedRoles?.includes(auth?.role) ? (
    <Outlet />
  ) : auth?.role ? (
    auth?.role === 'user' ?
    <Navigate to="/admin/place-order" state={{ from: location }} replace />
    :
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
