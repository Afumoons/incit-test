import React, { useEffect, useState } from "react";
import { getAllUsers } from "../services/authService";

interface User {
  id: number;
  email: string;
  created_at: Date;
  login_count: number;
  logout_at: Date;
}

const UsersTable: React.FC = () => {
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
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-200">
        <tr className="border border-gray-300">
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Sign Up Timestamp</th>
          <th className="px-4 py-2">Login Count</th>
          <th className="px-4 py-2">Last Logout Timestamp</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {users.map((user) => (
          <tr key={user.id} className="border border-gray-300">
            <td className="px-4 py-2">{user.email}</td>
            <td className="px-4 py-2">
              {new Date(user.created_at).toLocaleString()}
            </td>
            <td className="px-4 py-2">{user.login_count}</td>
            <td className="px-4 py-2">
              {user.logout_at
                ? new Date(user.logout_at).toLocaleString()
                : "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
