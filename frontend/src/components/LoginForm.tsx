import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import Cookies from "js-cookie";

const LoginForm: React.FC = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);

      const { token } = response.data;

      // Save the token in localstorage cookies
      Cookies.set("token", token);
      // localStorage.setItem("token", token);

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
    <form onSubmit={handleSubmit}>
      <div>
        <label>email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
      <button onClick={googleLogin}>Login with Google</button>
      <button onClick={facebookLogin}>Login with Facebook</button>
    </form>
  );
};

export default LoginForm;
