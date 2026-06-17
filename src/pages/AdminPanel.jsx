import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ users: 0, courses: 0, materials: 0, assignments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Foydalanuvchilar ro'yxati
      const uSnap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
      const usersData = uSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);

      // 2. Statistika
      const cSnap = await getDocs(collection(db, "courses"));
      const mSnap = await getDocs(collection(db, "materials"));
      const aSnap = await getDocs(collection(db, "assignments"));

      setStats({
        users: usersData.length,
        courses: cSnap.size,
        materials: mSnap.size,
        assignments: aSnap.size
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      alert("Rol muvaffaqiyatli o'zgartirildi!");
      fetchData();
    } catch (err) {
      alert("Xatolik yuz berdi!");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <h1 className="text-4xl font-black text-gray-900">Admin Boshqaruv Paneli</h1>

      {/* Statistika Kartalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Foydalanuvchilar" count={stats.users} color="indigo" />
        <StatCard title="O'quv Kurslari" count={stats.courses} color="green" />
        <StatCard title="Materiallar" count={stats.materials} color="blue" />
        <StatCard title="Topshiriqlar" count={stats.assignments} color="purple" />
      </div>

      {/* Foydalanuvchilar Jadvali */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Foydalanuvchilar bazasi</h2>
          <button onClick={fetchData} className="text-indigo-600 font-bold hover:text-indigo-800">Ma'lumotlarni yangilash ↻</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-gray-400 uppercase text-xs tracking-widest border-b">
              <tr>
                <th className="px-8 py-4">Foydalanuvchi</th>
                <th className="px-8 py-4">Email</th>
                <th className="px-8 py-4">Rol</th>
                <th className="px-8 py-4 text-center">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="px-8 py-5 font-bold text-gray-900">{u.name}</td>
                  <td className="px-8 py-5 text-gray-500">{u.email}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      u.role === 'admin' ? 'bg-red-100 text-red-700' : 
                      u.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <select 
                      className="bg-gray-50 border rounded-xl p-2 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
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
    </div>
  );
};

// Yordamchi Karta komponenti
const StatCard = ({ title, count, color }) => (
  <div className={`bg-white p-8 rounded-3xl shadow-lg border-b-4 border-${color}-500 hover:scale-105 transition duration-300`}>
    <h3 className="text-gray-400 font-bold uppercase text-xs mb-2 tracking-widest">{title}</h3>
    <p className={`text-4xl font-black text-${color}-600`}>{count}</p>
  </div>
);

export default AdminPanel;
