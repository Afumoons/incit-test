import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { logout } from "../services/authService";

const Header: React.FC = () => {
  const token = Cookies.get("token");

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          INCIT
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {token ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-blue-500 hover:underline"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={async () => {
                      await logout();
                      Cookies.remove("token");
                      window.location.href = "/login"; // Redirect to login page
                    }}
                    className="text-red-500 hover:underline"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;