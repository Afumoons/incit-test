import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const { token, user } = response.data;
      Cookies.set("token", token);
      Cookies.set("email", user.email);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const googleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const facebookLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/facebook";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-2">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Login
      </button>
      <hr />
      <div className="flex items-center justify-center space-x-4">
        <button
          type="button"
          onClick={googleLogin}
          className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
        >
          Google
        </button>
        <button
          type="button"
          onClick={facebookLogin}
          className="w-full px-4 py-2 font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800"
        >
          Facebook
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
