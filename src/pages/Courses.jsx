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
  deleteDoc,
  doc 
} from "firebase/firestore";

const Courses = () => {
  const { userData, currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setFetchError("");
      console.log("Kurslarni yuklash boshlandi...");
      const q = query(collection(db, "courses"));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Yuklangan kurslar:", data);
      setCourses(data);
    } catch (err) {
      console.error("Firebase error (Courses fetch):", err);
      setFetchError("Kurslarni yuklashda xatolik yuz berdi: " + err.message);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      setLoading(true);
      console.log("Yangi kurs qo'shilmoqda:", { title, description });
      const docRef = await addDoc(collection(db, "courses"), {
        title,
        description,
        teacherId: currentUser?.uid || "anonymous",
        teacherName: userData?.name || "O'qituvchi",
        createdAt: serverTimestamp()
      });
      console.log("Kurs muvaffaqiyatli qo'shildi, ID:", docRef.id);
      setTitle("");
      setDescription("");
      await fetchCourses(); // Yangi ro'yxatni tortib olamiz
    } catch (err) {
      console.error("Kurs qo'shishda xatolik:", err);
      alert("Xatolik: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">O'quv Kurslari</h1>

      {fetchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {fetchError}
        </div>
      )}

      {(userData?.role === "teacher" || userData?.role === "admin") && (
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 border border-blue-100">
          <h2 className="text-xl font-bold mb-6 text-blue-700">Yangi Kurs yaratish</h2>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <input 
              type="text" placeholder="Kurs nomi" 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={title} onChange={e => setTitle(e.target.value)} required
            />
            <textarea 
              placeholder="Kurs tavsifi" 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={description} onChange={e => setDescription(e.target.value)}
            />
            <button 
              type="submit" disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
            >
              {loading ? "Yaratilmoqda..." : "Kursni yaratish"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-500 mb-6">{course.description}</p>
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm text-indigo-500 font-semibold">O'qituvchi: {course.teacherName}</span>
              <Link 
                to={`/courses/${course.id}`}
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-indigo-100 transition"
              >
                Kursga kirish
              </Link>
            </div>
          </div>
        ))}
        {courses.length === 0 && !loading && !fetchError && (
          <p className="text-gray-400">Kurslar mavjud emas. Yuqoridagi formadan yangi kurs yarating.</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
