import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import Cookies from "js-cookie";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-4xl font-semibold text-center mb-4">
          Welcome to the Dashboard Page
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Here is your dashboard content.
        </p>
        <div className="text-center">
          <Link
            to="/"
            className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 mr-4"
          >
            Home
          </Link>
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
