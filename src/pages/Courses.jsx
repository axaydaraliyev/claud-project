import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  serverTimestamp,
  orderBy
} from "firebase/firestore";

const Courses = () => {
  const { userData, currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(data);
    } catch (err) {
      console.error("Firebase error:", err);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      setLoading(true);
      await addDoc(collection(db, "courses"), {
        title,
        description,
        teacherId: currentUser?.uid || "anonymous",
        teacherName: userData?.name || "O'qituvchi",
        createdAt: serverTimestamp()
      });
      setTitle("");
      setDescription("");
      await fetchCourses(); 
    } catch (err) {
      console.error(err);
      alert("Xatolik: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex justify-between items-center border-b-2 border-indigo-100 pb-4">
        <h1 className="text-4xl font-black text-indigo-900 flex items-center gap-3">
          <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          O'quv Kurslari
        </h1>
        <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-bold text-sm shadow-sm">
          Jami: {courses.length} ta kurs
        </span>
      </div>

      {(userData?.role === "teacher" || userData?.role === "admin") && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-3xl shadow-md border border-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-200 rounded-full opacity-50 blur-3xl"></div>
          <h2 className="text-2xl font-bold mb-6 text-indigo-800 relative z-10">🎓 Yangi Kurs Yaratish</h2>
          <form onSubmit={handleAddCourse} className="space-y-5 relative z-10">
            <input 
              type="text" placeholder="Kurs nomini kiriting (Masalan: React asoslari)" 
              className="w-full p-4 bg-white border border-indigo-200 rounded-2xl focus:ring-4 focus:ring-indigo-300 outline-none transition font-semibold text-gray-700"
              value={title} onChange={e => setTitle(e.target.value)} required
            />
            <textarea 
              placeholder="Kurs haqida qisqacha ma'lumot va uning maqsadlari..." 
              className="w-full p-4 bg-white border border-indigo-200 rounded-2xl focus:ring-4 focus:ring-indigo-300 outline-none transition text-gray-600 min-h-[120px]"
              value={description} onChange={e => setDescription(e.target.value)}
            />
            <div className="flex justify-end">
              <button 
                type="submit" disabled={loading}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-lg transition transform hover:-translate-y-1"
              >
                {loading ? "Kurs yaratilmoqda..." : "+ Kursni saqlash"}
              </button>
            </div>
          </form>
        </div>
      )}

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition transform hover:-translate-y-2 flex flex-col justify-between overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 w-full"></div>
              <div className="p-8 flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition">{course.title}</h3>
                <p className="text-gray-500 mb-6 line-clamp-3 leading-relaxed">{course.description}</p>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                    {course.teacherName?.charAt(0) || "U"}
                  </div>
                  <span className="text-xs text-gray-500 font-bold truncate max-w-[100px]">{course.teacherName}</span>
                </div>
                <Link 
                  to={`/courses/${course.id}`}
                  className="bg-white text-indigo-600 border-2 border-indigo-100 px-5 py-2 rounded-xl font-bold hover:bg-indigo-50 hover:border-indigo-300 transition text-sm"
                >
                  Darsni boshlash →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border-2 border-dashed border-indigo-100">
           <svg className="w-20 h-20 mx-auto text-indigo-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
           <h3 className="text-2xl font-bold text-gray-700 mb-2">Hali kurslar yaratilmagan</h3>
           <p className="text-gray-500 text-lg">Tizimda ma'lumot yo'q. Iltimos, "Dashboard" orqali namunaviy ma'lumotlarni yuklang yoki o'zingiz kurs yarating.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
