import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Auth/Login";
import Registration from "./Auth/Registration";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import Home from "./Component/Dashboard/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      {/* Protected Route */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
