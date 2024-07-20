import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UsersTable from "../components/UsersTable";
import DashboardStatistic from "../components/DashboardStatistic";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-4xl font-semibold text-center mb-4">
          Welcome to the Dashboard Page
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Here is your dashboard content.
        </p>
        <div className="space-y-4 bg-white p-4 rounded shadow">
          <DashboardStatistic />
          <UsersTable />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
