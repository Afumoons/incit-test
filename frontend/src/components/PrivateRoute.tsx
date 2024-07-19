import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ component: Component }: any) => {
  const isAuthenticated = !!Cookies.get("token");

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
