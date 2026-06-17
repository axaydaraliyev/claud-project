import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Assignments from "./pages/Assignments";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";

// Tizimga kirmaganlarni Loginga qaytaruvchi himoya
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">{children}</div>
    </>
  ) : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/materials" element={<PrivateRoute><Materials /></PrivateRoute>} />
          <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
          <Route path="/courses/:id" element={<PrivateRoute><CourseDetails /></PrivateRoute>} />
          <Route path="/assignments" element={<PrivateRoute><Assignments /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
