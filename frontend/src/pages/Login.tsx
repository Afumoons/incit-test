import React from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  return (
    <>
      <h1>Login</h1>
      <LoginForm />
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
    </>
  );
};

export default Login;
