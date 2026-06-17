import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const { userData } = useAuth();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseDoc = await getDoc(doc(db, "courses", id));
        if (courseDoc.exists()) setCourse(courseDoc.data());

        const matQuery = query(collection(db, "materials"), where("courseId", "==", id));
        const matSnap = await getDocs(matQuery);
        setMaterials(matSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const assQuery = query(collection(db, "assignments"), where("courseId", "==", id));
        const assSnap = await getDocs(assQuery);
        setAssignments(assSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-indigo-500">Kutib turing, kurs yuklanmoqda...</div>;
  if (!course) return <div className="p-20 text-center text-2xl font-bold text-red-500">Xatolik: Bunday kurs bazadan topilmadi.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <nav className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500">
        <Link to="/courses" className="hover:text-indigo-600 transition">Kurslar</Link>
        <span>/</span>
        <span className="text-indigo-600">{course.title}</span>
      </nav>

      <header className="bg-gradient-to-r from-indigo-900 to-purple-900 p-12 rounded-[2.5rem] shadow-2xl mb-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"></div>
        <div className="relative z-10">
          <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-4 inline-block">Active Course</span>
          <h1 className="text-5xl font-black mb-6 leading-tight">{course.title}</h1>
          <p className="text-indigo-100 text-xl leading-relaxed max-w-3xl mb-8">{course.description}</p>
          <div className="flex items-center space-x-3 bg-white/10 w-fit px-6 py-3 rounded-2xl backdrop-blur-sm">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-900 font-black text-lg">
              {course.teacherName?.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-indigo-200">Kurs muallifi</p>
              <p className="font-bold">{course.teacherName}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Chap tomon: Materiallar (8 qator) */}
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <span className="bg-blue-100 p-3 rounded-2xl text-blue-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </span>
            O'quv Materiallari
          </h2>
          
          <div className="space-y-4">
            {materials.length > 0 ? materials.map((m, index) => (
              <div key={m.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition group flex gap-5">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-blue-600 group-hover:text-white transition">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl text-gray-800 mb-2">{m.title}</h4>
                  <p className="text-gray-500 mb-4">{m.description}</p>
                  <a href={m.driveLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-xl transition">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="drive" className="w-4 h-4"/>
                    Faylni ko'rish
                  </a>
                </div>
              </div>
            )) : (
              <div className="bg-blue-50 p-8 rounded-3xl text-center border-2 border-dashed border-blue-200">
                 <p className="text-blue-500 font-bold">Ushbu kurs uchun hali materiallar yuklanmagan.</p>
              </div>
            )}
          </div>
        </div>

        {/* O'ng tomon: Topshiriqlar (4 qator) */}
        <div className="lg:col-span-5 space-y-8">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <span className="bg-purple-100 p-3 rounded-2xl text-purple-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </span>
            Topshiriqlar
          </h2>
          
          <div className="space-y-4">
            {assignments.length > 0 ? assignments.map(a => (
              <div key={a.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-purple-300 transition relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-xs font-black px-4 py-1 rounded-bl-xl border-b border-l border-red-200">
                  Muddat: {a.deadline}
                </div>
                <h4 className="font-bold text-lg text-gray-900 mt-4 mb-2 pr-20">{a.title}</h4>
                <p className="text-sm text-gray-600 mb-6">{a.description}</p>
                
                {userData?.role === "student" && (
                  <Link to={`/assignments`} className="block text-center bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition shadow-md">
                    Bajarishga o'tish →
                  </Link>
                )}
                {(userData?.role === "teacher" || userData?.role === "admin") && (
                  <Link to={`/assignments`} className="block text-center bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                    Javoblarni tekshirish →
                  </Link>
                )}
              </div>
            )) : (
               <div className="bg-purple-50 p-8 rounded-3xl text-center border-2 border-dashed border-purple-200">
                 <p className="text-purple-500 font-bold">Joriy kurs uchun aktiv topshiriqlar yo'q.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseDetails;
