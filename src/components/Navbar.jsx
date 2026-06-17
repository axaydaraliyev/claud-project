import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold tracking-tight">
              EduCloud <span className="text-indigo-200">Secure</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="hover:text-indigo-200 transition">Dashboard</Link>
              <Link to="/courses" className="hover:text-indigo-200 transition">Kurslar</Link>
              <Link to="/materials" className="hover:text-indigo-200 transition">Materiallar</Link>
              <Link to="/assignments" className="hover:text-indigo-200 transition">Topshiriqlar</Link>
              {userData?.role === "admin" && (
                <Link to="/admin" className="text-yellow-300 font-bold hover:text-yellow-400">Admin Panel</Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-medium">{userData?.name}</span>
              <span className="text-xs text-indigo-200 uppercase">{userData?.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-semibold transition"
            >
              Chiqish
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
