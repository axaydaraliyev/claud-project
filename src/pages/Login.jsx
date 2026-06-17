import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Email yoki parol noto'g'ri");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Login Error:", err);
      if (err.code === "auth/unauthorized-domain") {
        setError("Xatolik: Sizning saytingiz (Netlify) Firebase 'Authorized Domains' ro'yxatiga qo'shilmagan.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Siz Google oynasini muddatidan oldin yopib qo'ydingiz.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Xatolik: Firebase Console'da Google orqali kirish yoqilmagan!");
      } else {
        setError("Google orqali kirishda xatolik yuz berdi: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-8">EduCloud Login</h2>
        
        {error && <p className="text-red-500 text-sm text-center mb-4 bg-red-50 p-3 rounded">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Parol"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-indigo-600 text-white p-3 rounded font-bold hover:bg-indigo-700">
            Kirish
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border p-3 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" alt="G" />
            Google orqali kirish
          </button>
          
          <p className="text-center text-gray-500 text-sm mt-4">
            Hisobingiz yo'qmi? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Ro'yxatdan o'tish</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
