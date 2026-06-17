import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setError("Parol kamida 6 belgidan iborat bo'lishi kerak");
    try {
      await register(email, password, name, role);
      navigate("/dashboard");
    } catch (err) {
      setError("Email band yoki xato");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-8">Ro'yxatdan o'tish</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Ism sharif" className="w-full p-3 border rounded" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Parol" className="w-full p-3 border rounded" value={password} onChange={e => setPassword(e.target.value)} required />
          <select className="w-full p-3 border rounded" value={role} onChange={e => setRole(e.target.value)}>
            <option value="student">Talaba</option>
            <option value="teacher">O'qituvchi</option>
          </select>
          <button className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700">Ro'yxatdan o'tish</button>
        </form>
        <p className="mt-4 text-center text-gray-500">Hisobingiz bormi? <Link to="/login" className="text-green-600 font-bold">Kirish</Link></p>
      </div>
    </div>
  );
};

export default Register;
