import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">EduCloud Secure Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="bg-blue-800 px-3 py-1 rounded-full text-sm">
            Rol: {user?.role}
          </span>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition"
          >
            Chiqish
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-2xl font-semibold mb-2">Xush kelibsiz, {user?.name}!</h2>
          <p className="text-gray-600">Sizning tizimdagi joriy huquqlaringiz: <strong>{user?.role}</strong>.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* O'qituvchi va Admin uchun */}
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition">
              <h3 className="text-lg font-bold text-blue-700 mb-2">Kurslar yaratish</h3>
              <p className="text-gray-600 mb-4">Yangi kurslar yaratish va materiallarni Firebase bulutiga yuklash.</p>
              <button className="text-blue-600 font-semibold hover:underline">Boshqarish &rarr;</button>
            </div>
          )}

          {/* Hamma uchun */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition">
            <h3 className="text-lg font-bold text-green-700 mb-2">Mening Kurslarim</h3>
            <p className="text-gray-600 mb-4">O'zingiz a'zo bo'lgan kurslarni ko'rish va materiallarni yuklab olish.</p>
            <button className="text-green-600 font-semibold hover:underline">Kirish &rarr;</button>
          </div>

          {/* Talaba uchun */}
          {user?.role === 'student' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition">
              <h3 className="text-lg font-bold text-purple-700 mb-2">Topshiriqlar</h3>
              <p className="text-gray-600 mb-4">Faol topshiriqlarni ko'rish va fayllarni (javoblarni) yuborish.</p>
              <button className="text-purple-600 font-semibold hover:underline">Ko'rish &rarr;</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
