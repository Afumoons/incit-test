import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UsersTable from "../components/UsersTable";
import DashboardStatistic from "../components/DashboardStatistic";
import { getProfileData } from "../services/authService";
import Cookies from "js-cookie";
import ResendVerification from "../components/ResendVerification";

const Dashboard: React.FC = () => {
  const [isVerified, setIsVerified] = useState("");

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      const response = await getProfileData(Cookies.get("email"));

      setIsVerified(response.data[0].is_verified);
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-4xl font-semibold text-center mb-4">
          Welcome to the Dashboard Page
        </h1>
        {isVerified ? (
          <>
            <p className="text-center text-gray-600 mb-8">
              Here is your dashboard content.
            </p>
            <div className="space-y-4 bg-white p-4 rounded shadow">
              <DashboardStatistic />
              <UsersTable />
            </div>
          </>
        ) : (
          <>
            <p className="text-center text-gray-600 mb-8">
              Please verify the email address before accessing the dashboard.
            </p>
            <ResendVerification />{" "}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
