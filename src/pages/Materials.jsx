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
  
  // Form states
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
    const snap = await getDocs(q);
    setMaterials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!driveLink.includes("drive.google.com")) {
      return alert("Iltimos, haqiqiy Google Drive havolasini kiriting!");
    }
    if (!courseId) return alert("Iltimos, kursni tanlang!");

    try {
      setLoading(true);
      await addDoc(collection(db, "materials"), {
        title,
        description,
        driveLink,
        courseId,
        courseName: courses.find(c => c.id === courseId)?.title || "Noma'lum",
        teacherId: currentUser.uid,
        teacherName: userData.name,
        createdAt: serverTimestamp()
      });
      setTitle(""); setDescription(""); setDriveLink(""); setCourseId("");
      fetchMaterials();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (id) => {
    if (window.confirm("Materialni butunlay o'chirmoqchimisiz?")) {
      await deleteDoc(doc(db, "materials", id));
      fetchMaterials();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      
      <div className="flex justify-between items-center border-b-2 border-indigo-100 pb-4">
        <h1 className="text-4xl font-black text-indigo-900 flex items-center gap-3">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          Kutubxona & Materiallar
        </h1>
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold shadow-sm">
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-5" alt="G-Drive" />
          Google Drive Storage
        </div>
      </div>

      {(userData?.role === "teacher" || userData?.role === "admin") && (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-green-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-green-500 text-white font-black text-xs px-8 py-1 rotate-45 translate-x-6 translate-y-4 shadow-md">TEACHER MODE</div>
          
          <h2 className="text-2xl font-bold mb-6 text-green-800">Yangi fayl yuklash (Havola)</h2>
          <form onSubmit={handleAddMaterial} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input 
              type="text" placeholder="Fayl nomi (Ma'ruza, Taqdimot...)" 
              className="p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition font-semibold"
              value={title} onChange={e => setTitle(e.target.value)} required
            />
            <input 
              type="url" placeholder="Google Drive ulashish (share) havolasi" 
              className="p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition font-semibold"
              value={driveLink} onChange={e => setDriveLink(e.target.value)} required
            />
            <textarea 
              placeholder="Fayl haqida qo'shimcha izoh..." 
              className="p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition md:col-span-2 min-h-[100px]"
              value={description} onChange={e => setDescription(e.target.value)}
            />
            <select 
              className="p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-100 outline-none transition md:col-span-2 font-bold text-gray-700 cursor-pointer"
              value={courseId} onChange={e => setCourseId(e.target.value)} required
            >
              <option value="">📁 Qaysi kursga tegishli?</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <button 
              type="submit" disabled={loading}
              className="md:col-span-2 bg-green-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-green-700 hover:shadow-lg transition transform hover:-translate-y-1 disabled:bg-gray-400 mt-2"
            >
              {loading ? "Bulutga ulanmoqda..." : "Bazaga saqlash"}
            </button>
          </form>
        </div>
      )}

      {materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map(mat => (
            <div key={mat.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-green-300 hover:shadow-xl transition flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full truncate max-w-[150px]">
                    {mat.courseName || "Umumiy"}
                  </span>
                  {(userData?.role === "admin" || (userData?.role === "teacher" && currentUser.uid === mat.teacherId)) && (
                    <button onClick={() => deleteMaterial(mat.id)} className="text-gray-300 hover:text-red-500 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition">{mat.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{mat.description}</p>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-50 pt-5 mt-auto">
                <div className="text-xs text-gray-400 font-semibold truncate max-w-[120px]">By: {mat.teacherName}</div>
                <a 
                  href={mat.driveLink} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 bg-gray-50 text-gray-700 hover:text-white hover:bg-green-600 px-5 py-2.5 rounded-xl font-bold transition text-sm shadow-sm"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="drive" className="w-4 h-4 group-hover:brightness-0 group-hover:invert transition"/>
                  Ochish
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-green-50 rounded-3xl border-2 border-dashed border-green-200">
           <svg className="w-16 h-16 mx-auto text-green-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
           <h3 className="text-xl font-bold text-green-800 mb-2">Baza bo'sh</h3>
           <p className="text-green-600">Hozircha birorta ham fayl yuklanmagan.</p>
        </div>
      )}
    </div>
  );
};

export default Materials;
