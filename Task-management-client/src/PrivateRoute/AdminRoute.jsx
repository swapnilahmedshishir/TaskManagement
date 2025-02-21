import { useContext } from "react";
import { AppContext } from "../../Context/ContextProvider";
import useAdmin from "../../Hook/useAdmin";
import { Navigate, useLocation } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  const [isAdmin, isAdminLoading] = useAdmin();
  const loaction = useLocation();

  if (isAdminLoading || !user) {
    return (
      <div>
        <span className="loading loading-bars loading-lg"></span>Loading...
      </div>
    );
  }

  if (user && isAdmin) {
    return children;
  }
  return <Navigate to="/login" state={{ from: loaction.pathname }} replace />;
};

export default AdminRoute;
