import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Boshlang'ich holat - Admin
  const [userData, setUserData] = useState({
    name: "Haydaraliyev Akbarali",
    email: "admin@educloud.uz",
    role: "admin",
  });

  // Rolni almashtirish funksiyasi (Zashta uchun maxsus)
  const toggleRole = () => {
    setUserData(prev => ({
      ...prev,
      role: prev.role === "admin" ? "student" : "admin",
      name: prev.role === "admin" ? "Talaba (Test Rejimi)" : "Haydaraliyev Akbarali",
    }));
  };

  const value = {
    currentUser: { uid: "test-user-123" },
    userData,
    toggleRole, // Navbarda ishlatish uchun
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    loginWithGoogle: () => Promise.resolve()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
