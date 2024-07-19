import React from "react";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  return (
    <>
      <h1>Register</h1>
      <RegisterForm />
      <Link to="/login">Login</Link>
    </>
  );
};

export default Register;
