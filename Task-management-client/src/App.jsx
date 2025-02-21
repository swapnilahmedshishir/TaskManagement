import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Auth/Login";
import Registration from "./Auth/Registration";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import Home from "./Component/Dashboard/Home";
import TaskBoard from "./Component/Dashboard/TaskBoard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      {/* <Route path="/dashboard" element={<TaskBoard />} /> */}

      {/* Protected Route */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <TaskBoard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
