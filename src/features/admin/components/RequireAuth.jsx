import { useAuth } from "../../../context/AdminContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return allowedRoles?.includes(auth?.user.role) ? (
    <Outlet />
  ) : auth?.user.role ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/admin/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
