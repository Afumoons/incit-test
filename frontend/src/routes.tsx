import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import GuestRoute from "./components/GuestRoute";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute component={Dashboard} />}
        />
        <Route path="/login" element={<GuestRoute component={Login} />} />
        <Route path="/register" element={<GuestRoute component={Register} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
