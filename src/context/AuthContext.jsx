import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Haqiqiy Ro'yxatdan o'tish (Firebase Auth + Firestore)
  const register = async (email, password, name, role) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      role,
      createdAt: serverTimestamp()
    });
  };

  // Haqiqiy Tizimga kirish
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google bilan kirish
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const user = res.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || "Google Foydalanuvchi",
        email: user.email,
        role: "student", // Google orqali kirganlar avtomatik talaba bo'ladi
        createdAt: serverTimestamp()
      });
    }
  };

  const logout = () => signOut(auth);

  // ZASHTA UCHUN: Ekranda ko'rinayotgan rolni vaqtinchalik o'zgartirish
  const toggleRole = () => {
    if (userData) {
      setUserData(prev => ({
        ...prev,
        role: prev.role === "admin" ? "student" : "admin"
      }));
    }
  };

  // Haqiqiy tizim kuzatuvi (Session)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { 
    currentUser, 
    userData, 
    login, 
    register, 
    logout, 
    loginWithGoogle, 
    toggleRole 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
