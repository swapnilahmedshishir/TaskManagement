import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../Context/ContextProvider";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  const location = useLocation();

  if (user) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default PrivateRoute;
