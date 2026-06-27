import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
