import React, { useState } from "react";
import { register } from "../services/authService";

const RegisterForm: React.FC = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await register(email, password);
      alert("User registered");
    } catch (err) {
      alert("Error registering user");
    }
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
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
