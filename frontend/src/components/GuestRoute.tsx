import Cookies from "js-cookie";
import React from "react";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ component: Component }: any) => {
  const isAuthenticated = !!Cookies.get("token");

  return !isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default GuestRoute;
