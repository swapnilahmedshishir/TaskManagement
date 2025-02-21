import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Auth/Login";
import Registration from "./Auth/Registration";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import TaskBoard from "./Component/Dashboard/TaskBoard";
import Projects from "./Component/Dashboard/Projects";
import Team from "./Component/Dashboard/Team";
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
            <TaskBoard />
          </PrivateRoute>
        }
      />
      <Route path="projects" element={<Projects />} />
      <Route path="team" element={<Team />} />
    </Routes>
  );
}

export default App;
