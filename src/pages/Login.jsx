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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-8">EduCloud Login</h2>
        
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        
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
            onClick={() => loginWithGoogle().then(() => navigate("/dashboard"))}
            className="w-full border p-3 rounded flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" alt="G" />
            Google orqali kirish
          </button>
          
          <p className="text-center text-gray-500 text-sm">
            Hisobingiz yo'qmi? <Link to="/register" className="text-indigo-600 font-bold">Ro'yxatdan o'tish</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
