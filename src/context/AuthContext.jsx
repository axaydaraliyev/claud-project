import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Test uchun doimiy login bo'lgan foydalanuvchi ma'lumotlari
  const [currentUser, setCurrentUser] = useState({ uid: "test-user-123" });
  const [userData, setUserData] = useState({
    name: "Admin / O'qituvchi (Test Rejimi)",
    email: "test@educloud.uz",
    role: "admin", // Barcha imkoniyatlar ochilishi uchun
  });

  const value = {
    currentUser,
    userData,
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
