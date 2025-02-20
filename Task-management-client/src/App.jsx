import { Route, Routes } from "react-router";
import "./App.css";
import Login from "./Auth/Login";
import Registration from "./Auth/Registration";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/register" element={<Registration />} />
        {/* <Route path="about" element={<About />} /> */}

        {/* <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route> */}
      </Routes>
    </>
  );
}

export default App;
