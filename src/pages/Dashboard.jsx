import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";

const Dashboard = () => {
  const { userData, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      // Simulyatsiya qilingan xavfsizlik loglari
      setLogs([
        { id: 1, action: "Cloud Storage connection established", time: "Hozir", status: "Secure" },
        { id: 2, action: "End-to-end encryption active", time: "2 daqiqa oldin", status: "Active" },
        { id: 3, action: "User session validated via JWT", time: "5 daqiqa oldin", status: "Verified" }
      ]);
    };
    fetchLogs();
  }, []);

  const seedDatabase = async () => {
    try {
      setLoading(true);
      const courseRef = await addDoc(collection(db, "courses"), {
        title: "Bulutli texnologiyalar asoslari",
        description: "Ushbu kursda Google Cloud, Firebase va AWS kabi bulutli platformalar bilan ishlash o'rgatiladi.",
        teacherId: currentUser.uid,
        teacherName: userData.name,
        createdAt: serverTimestamp()
      });

      await addDoc(collection(db, "materials"), {
        title: "1-Ma'ruza: Cloud Computing",
        description: "PaaS, SaaS va IaaS tushunchalari.",
        driveLink: "https://drive.google.com/file/d/1example/view",
        courseId: courseRef.id,
        teacherId: currentUser.uid,
        teacherName: userData.name,
        createdAt: serverTimestamp()
      });

      alert("Namunaviy ma'lumotlar yuklandi!");
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salom, {userData?.name}!</h1>
          <p className="text-indigo-600 font-medium">Xavfsiz bulutli tizimga xush kelibsiz.</p>
        </div>
        {(userData?.role === "teacher" || userData?.role === "admin") && (
          <button onClick={seedDatabase} disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition">
            {loading ? "Yuklanmoqda..." : "🚀 Kurslarni to'ldirish"}
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-indigo-500">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tizim holati</h3>
          <p className="text-2xl font-black text-green-600 mt-2">HIMOYALANGAN</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-500">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Bulutli xotira</h3>
          <p className="text-2xl font-black text-blue-600 mt-2">Google Drive Connected</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-purple-500">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Sizning rolingiz</h3>
          <p className="text-2xl font-black text-purple-600 mt-2 uppercase">{userData?.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Xavfsizlik Auditi (Cloud Security Logs)
          </h2>
          <div className="space-y-4">
            {logs.map(log => (
              <div key={log.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="text-sm font-bold text-gray-700">{log.action}</p>
                  <p className="text-xs text-gray-400">{log.time}</p>
                </div>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">{log.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-indigo-900 p-8 rounded-3xl text-white">
          <h2 className="text-2xl font-bold mb-4">Loyihaning maqsadi</h2>
          <p className="text-indigo-100 leading-relaxed">
            Ushbu tizim ta'lim jarayonida ma'lumotlarni bulutli texnologiyalar (Firebase va Google Drive) yordamida markazlashgan holda saqlash 
            va foydalanuvchi rollari (RBAC) orqali xavfsizlikni ta'minlashni ko'zda tutadi.
          </p>
          <div className="mt-6 flex gap-4">
             <div className="bg-indigo-800 p-4 rounded-xl flex-1">
               <p className="text-xs font-bold text-indigo-300">Shifrlash</p>
               <p className="text-lg font-bold">AES-256 (Simulated)</p>
             </div>
             <div className="bg-indigo-800 p-4 rounded-xl flex-1">
               <p className="text-xs font-bold text-indigo-300">Protokol</p>
               <p className="text-lg font-bold">HTTPS / TLS</p>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
