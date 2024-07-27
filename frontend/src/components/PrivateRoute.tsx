import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { protectedData } from "../services/authService";

const PrivateRoute = ({ component: Component }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const getProtectedData = async () => {
    try {
      const response = await protectedData();
      Cookies.set("token", response.data.token);
      console.log("token", response.data.token, Cookies.get("token"));

      Cookies.set("email", response.data.user.email);

      setIsAuthenticated(!!response.data.token);
    } catch (error) {
      console.error("Error fetching protected data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProtectedData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // or any loading indicator
  }

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
