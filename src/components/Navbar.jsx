import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { userData, toggleRole } = useAuth();

  return (
    <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold tracking-tight">
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
            {/* Zashta uchun maxsus Switcher */}
            <button 
              onClick={toggleRole}
              className="bg-indigo-500 hover:bg-indigo-400 text-[10px] px-3 py-1 rounded-full border border-indigo-300 transition"
            >
              🔄 Rolni almashtirish ({userData?.role === 'admin' ? 'Student' : 'Admin'}ga)
            </button>

            <div className="flex flex-col items-end border-l pl-4 border-indigo-500">
              <span className="text-sm font-medium">{userData?.name}</span>
              <span className="text-[10px] bg-white text-indigo-700 px-2 rounded-full uppercase font-bold">
                {userData?.role}
              </span>
            </div>

            {/* Chiqish tugmasi */}
            <button 
              onClick={() => {
                useAuth().logout(); // AuthContext-dan logoutni chaqirish
                window.location.href = "/login"; // Login sahifasiga qaytarish
              }}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg font-bold transition shadow-sm"
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
