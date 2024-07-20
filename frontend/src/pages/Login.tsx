import React from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-center mb-4">Login</h1>
        <p className="text-center mb-6 text-gray-600">
          Welcome back! Please login to your account.
        </p>
        <LoginForm />
        <div className="flex justify-between mt-4">
          <Link to="/" className="text-blue-500 hover:underline">
            Home
          </Link>
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
