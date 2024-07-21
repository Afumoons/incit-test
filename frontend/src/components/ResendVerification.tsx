import React, { useState } from "react";
import { resendVerificationEmail } from "../services/authService";
import Cookies from "js-cookie";

const ResendVerification: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    try {
      const response = await resendVerificationEmail(Cookies.get("email"));
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Resend Email Verification</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleResend}
      >
        Resend Verification Email
      </button>
      <p>{message}</p>
    </div>
  );
};

export default ResendVerification;
