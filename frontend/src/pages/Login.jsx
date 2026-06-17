import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Tizimga kirishda xatolik yuz berdi');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">EduCloud Secure</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Parol</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-2 mt-2 rounded-lg hover:bg-blue-700 transition"
          >
            Tizimga kirish
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Hisobingiz yo'qmi? <Link to="/register" className="text-blue-600 font-bold hover:underline">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
