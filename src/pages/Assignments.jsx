import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  serverTimestamp,
  where
} from "firebase/firestore";

const Assignments = () => {
  const { userData, currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const q = query(collection(db, "courses"));
    const snap = await getDocs(q);
    setCourses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchAssignments = async () => {
    const q = query(collection(db, "assignments"));
    const snap = await getDocs(q);
    setAssignments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!courseId) return alert("Iltimos, kursni tanlang!");
    
    try {
      setLoading(true);
      await addDoc(collection(db, "assignments"), {
        title,
        description,
        deadline,
        courseId,
        teacherId: currentUser.uid,
        createdAt: serverTimestamp()
      });
      setTitle("");
      setDescription("");
      setDeadline("");
      setCourseId("");
      fetchAssignments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Topshiriqlar</h1>

      {userData?.role === "teacher" && (
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 border border-purple-100">
          <h2 className="text-xl font-bold mb-6 text-purple-700">Yangi Topshiriq berish</h2>
          <form onSubmit={handleAddAssignment} className="space-y-4">
            <input 
              type="text" placeholder="Topshiriq nomi" 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              value={title} onChange={e => setTitle(e.target.value)} required
            />
            <textarea 
              placeholder="Topshiriq tavsifi va ko'rsatmalar" 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              value={description} onChange={e => setDescription(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="date" 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                value={deadline} onChange={e => setDeadline(e.target.value)} required
              />
              <select 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                value={courseId} onChange={e => setCourseId(e.target.value)} required
              >
                <option value="">Qaysi kurs uchun?</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <button 
              type="submit" disabled={loading}
              className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg w-full"
            >
              {loading ? "E'lon qilinmoqda..." : "Topshiriqni e'lon qilish"}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {assignments.length > 0 ? assignments.map(ass => (
          <div key={ass.id} className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-purple-500 hover:shadow-2xl transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{ass.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{ass.description}</p>
                <div className="flex items-center space-x-4">
                   <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">Muddat: {ass.deadline}</span>
                   <span className="text-sm text-gray-400">Holat: Faol</span>
                </div>
              </div>
              {userData?.role === "student" && (
                <button className="bg-purple-100 text-purple-700 px-6 py-2 rounded-xl font-bold hover:bg-purple-200 transition">
                  Javob yuborish (Link)
                </button>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
             <p className="text-gray-400 text-lg">Hali birorta ham topshiriq berilmagan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
