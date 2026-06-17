import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Yuklanmoqda...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-blue-800 text-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold tracking-wider">EduCloud Secure</h1>
        <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
        <Link to="/courses" className="hover:text-blue-200 transition">Kurslar</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="hover:text-blue-200 transition font-bold text-yellow-300">Admin Panel</Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Link to="/profile" className="bg-blue-600 px-3 py-1 rounded-full text-sm shadow-inner hover:bg-blue-500 transition cursor-pointer">
          {user?.name} ({user?.role})
        </Link>
        <button 
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          Chiqish
        </button>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/courses/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
