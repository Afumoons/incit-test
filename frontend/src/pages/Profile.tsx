import React, { useState, useEffect } from "react";
import NameChangeForm from "../components/NameChangeForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getProfileData } from "../services/authService";
import Cookies from "js-cookie";

const ProfilePage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      const response = await getProfileData(Cookies.get("email"));

      setEmail(response.data[0].email);
      setName(response.data[0].name);
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <div className="mb-4">
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Name:</strong> {name}
          </p>
        </div>
        <NameChangeForm currentName={name} setName={setName} />
        <PasswordChangeForm />
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
