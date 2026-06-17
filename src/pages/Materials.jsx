import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  deleteDoc,
  doc
} from "firebase/firestore";

const Materials = () => {
  const { userData, currentUser } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const q = query(collection(db, "courses"));
    const snap = await getDocs(q);
    setCourses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchMaterials = async () => {
    const q = query(collection(db, "materials"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMaterials(data);
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!driveLink.includes("drive.google.com")) {
      return alert("Iltimos, haqiqiy Google Drive havolasini kiriting!");
    }
    if (!courseId) {
      return alert("Iltimos, kursni tanlang!");
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "materials"), {
        title,
        description,
        driveLink,
        courseId,
        teacherId: currentUser.uid,
        teacherName: userData.name,
        createdAt: serverTimestamp()
      });
      setTitle("");
      setDescription("");
      setDriveLink("");
      setCourseId("");
      fetchMaterials();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (id) => {
    if (window.confirm("Materialni o'chirmoqchimisiz?")) {
      await deleteDoc(doc(db, "materials", id));
      fetchMaterials();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">O'quv Materiallari (Google Drive)</h1>

      {(userData?.role === "teacher" || userData?.role === "admin") ? (
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 border border-indigo-100">
          <h2 className="text-xl font-bold mb-6 text-indigo-700">Yangi Material qo'shish</h2>
          <form onSubmit={handleAddMaterial} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              type="text" placeholder="Sarlavha" 
              className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={title} onChange={e => setTitle(e.target.value)} required
            />
            <input 
              type="text" placeholder="Google Drive Link" 
              className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={driveLink} onChange={e => setDriveLink(e.target.value)} required
            />
            <textarea 
              placeholder="Tavsif" 
              className="p-3 border rounded-xl md:col-span-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={description} onChange={e => setDescription(e.target.value)}
            />
            <select 
              className="p-3 border rounded-xl md:col-span-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={courseId} onChange={e => setCourseId(e.target.value)} required
            >
              <option value="">Qaysi kursga tegishli?</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <button 
              type="submit" disabled={loading}
              className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:bg-gray-400 shadow-md"
            >
              {loading ? "Saqlanmoqda..." : "Materialni saqlash"}
            </button>
          </form>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {materials.map(mat => (
          <div key={mat.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{mat.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{mat.description}</p>
              <div className="flex items-center text-xs text-gray-400 mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                O'qituvchi: {mat.teacherName}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <a 
                href={mat.driveLink} target="_blank" rel="noreferrer"
                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-200 transition text-sm"
              >
                Drive-da ko'rish
              </a>
              {(userData?.role === "admin" || (userData?.role === "teacher" && currentUser.uid === mat.teacherId)) && (
                <button 
                  onClick={() => deleteMaterial(mat.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-sm"
                >
                  O'chirish
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Materials;
