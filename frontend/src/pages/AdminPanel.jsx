import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, logsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/users'),
        api.get('/admin/audit-logs')
      ]);
      setStats(statsRes.data.data);
      setUsersList(usersRes.data.data);
      setLogs(logsRes.data.data);
    } catch (err) {
      console.error('Admin datani yuklashda xatolik', err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role_name: newRole });
      fetchAdminData(); // refresh list
    } catch (err) {
      alert("Rol o'zgartirishda xatolik!");
    }
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Admin Panel</h2>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-600 text-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Foydalanuvchilar</h3>
            <p className="text-4xl font-bold">{stats.users}</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Kurslar</h3>
            <p className="text-4xl font-bold">{stats.courses}</p>
          </div>
          <div className="bg-purple-600 text-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Materiallar</h3>
            <p className="text-4xl font-bold">{stats.materials}</p>
          </div>
          <div className="bg-orange-600 text-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Topshiriqlar</h3>
            <p className="text-4xl font-bold">{stats.submissions}</p>
          </div>
        </div>
      )}

      {/* Users Management */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-xl font-bold mb-4">Foydalanuvchilarni boshqarish</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b">Ism</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Rol</th>
                <th className="p-3 border-b">Harakat</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{u.name}</td>
                  <td className="p-3 border-b">{u.email}</td>
                  <td className="p-3 border-b capitalize">{u.role}</td>
                  <td className="p-3 border-b">
                    <select 
                      className="border rounded p-1"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-xl font-bold mb-4">Audit Loglar (Tizim kuzatuvi)</h3>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border-b">Vaqt</th>
                <th className="p-2 border-b">Foydalanuvchi</th>
                <th className="p-2 border-b">Harakat</th>
                <th className="p-2 border-b">Endpoint</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-2 border-b font-semibold">{log.user_name || 'Noma\'lum'}</td>
                  <td className="p-2 border-b text-blue-600">{log.action}</td>
                  <td className="p-2 border-b text-gray-500">{log.endpoint || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminPanel;
