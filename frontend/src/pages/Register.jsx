import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password, role_name: role });
      alert('Muvaffaqiyatli ro\'yxatdan o\'tdingiz! Endi tizimga kiring.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Ro'yxatdan O'tish</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">To'liq ism</label>
            <input 
              type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-blue-500"
              value={name} onChange={(e) => setName(e.target.value)} required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Email</label>
            <input 
              type="email" className="w-full px-3 py-2 border rounded-lg focus:outline-blue-500"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Parol</label>
            <input 
              type="password" className="w-full px-3 py-2 border rounded-lg focus:outline-blue-500"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Kim sifatida kirasiz?</label>
            <select 
              className="w-full px-3 py-2 border rounded-lg focus:outline-blue-500"
              value={role} onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Talaba</option>
              <option value="teacher">O'qituvchi</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 mt-2 rounded-lg hover:bg-blue-700 transition">
            Ro'yxatdan o'tish
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Hisobingiz bormi? <Link to="/login" className="text-blue-600 font-bold hover:underline">Kirish</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
