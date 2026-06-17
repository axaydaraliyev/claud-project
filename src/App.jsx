import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Assignments from "./pages/Assignments";
import AdminPanel from "./pages/AdminPanel";
import "./index.css";

// Login page yo'q qilingani uchun hamma yo'nalishlar ochiq
const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">{children}</div>
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/materials" element={<Layout><Materials /></Layout>} />
          <Route path="/courses" element={<Layout><Courses /></Layout>} />
          <Route path="/courses/:id" element={<Layout><CourseDetails /></Layout>} />
          <Route path="/assignments" element={<Layout><Assignments /></Layout>} />
          <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
          
          {/* Default sahifa - Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
