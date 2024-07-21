import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { verifyEmail } from "../services/authService";

const VerifyEmail: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      verifyEmail(token)
        .then((response) => {
          setMessage(response.data.message);
        })
        .catch((error) => {
          setMessage(error.response.data.error);
        });
    }
  }, [location]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
