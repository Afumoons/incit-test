// Register.tsx
import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">
          Register INCIT Account
        </h2>
        <p className="text-center text-gray-600">
          Create an account to get started
        </p>
        <RegisterForm />
        <div className="text-center">
          <Link to="/login" className="text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
