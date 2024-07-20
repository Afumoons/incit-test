import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { getAllUsers } from "../services/authService";

interface User {
  id: number;
  email: string;
  created_at: Date;
  login_count: number;
  logout_at: Date;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

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
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="border border-gray-300">
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Sign Up Timestamp</th>
              <th className="px-4 py-2">Login Count</th>
              <th className="px-4 py-2">Last Logout Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>{user.login_count}</td>
                <td>
                  {user.logout_at
                    ? new Date(user.logout_at).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
