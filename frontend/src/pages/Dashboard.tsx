import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import Cookies from "js-cookie";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      Cookies.remove("token");
      navigate("/login"); // Redirect to login page or home page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <h1>Welcome to the Dashboard Page</h1>
      <Link to="/">Home</Link>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Dashboard;
