import Cookies from "js-cookie";
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component }: any) => {
  const isAuthenticated = !!Cookies.get("token");

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
