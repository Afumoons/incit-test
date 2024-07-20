import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  const token = Cookies.get("token");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-4xl font-semibold text-center mb-4">
          Welcome to the Home Page
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Your gateway to a seamless experience with INCIT.
        </p>
        <div className="text-center">
          {token ? (
            <Link
              to="/dashboard"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
