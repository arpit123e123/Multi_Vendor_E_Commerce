import { Navigate, useLocation } from "react-router-dom";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const getRoleHome = (role) => {
  if (role === "admin") return "/admin";
  if (role === "vendor") return "/vendor";

  return "/";
};

const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = getUser();

  // No login session
  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Role protected route
  if (role && user.role !== role) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;