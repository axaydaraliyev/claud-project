import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp 
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const { userData, currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // 1. Kurs ma'lumotlarini olish
        const courseDoc = await getDoc(doc(db, "courses", id));
        if (courseDoc.exists()) setCourse(courseDoc.data());

        // 2. Shu kursga tegishli materiallarni olish
        const matQuery = query(collection(db, "materials"), where("courseId", "==", id));
        const matSnap = await getDocs(matQuery);
        setMaterials(matSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // 3. Shu kursga tegishli topshiriqlarni olish
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

  if (loading) return <div className="p-10 text-center">Yuklanmoqda...</div>;
  if (!course) return <div className="p-10 text-center">Kurs topilmadi.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <nav className="mb-6">
        <Link to="/courses" className="text-indigo-600 hover:underline">← Kurslarga qaytish</Link>
      </nav>

      <header className="bg-white p-10 rounded-3xl shadow-xl mb-10 border-b-8 border-indigo-600">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-gray-600 text-lg leading-relaxed">{course.description}</p>
        <div className="mt-6 flex items-center space-x-4">
          <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-bold text-sm">
            O'qituvchi: {course.teacherName}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Materiallar */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            Dars Materiallari
          </h2>
          <div className="space-y-4">
            {materials.length > 0 ? materials.map(m => (
              <div key={m.id} className="bg-white p-5 rounded-2xl shadow border hover:border-indigo-300 transition flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-800">{m.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-1">{m.description}</p>
                </div>
                <a href={m.driveLink} target="_blank" rel="noreferrer" className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-100">
                  Ochish
                </a>
              </div>
            )) : (
              <p className="text-gray-400 italic bg-gray-50 p-6 rounded-2xl text-center border-2 border-dashed">Ushbu kursda hali materiallar yo'q.</p>
            )}
          </div>
        </section>

        {/* Topshiriqlar */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            Topshiriqlar
          </h2>
          <div className="space-y-4">
            {assignments.length > 0 ? assignments.map(a => (
              <div key={a.id} className="bg-white p-5 rounded-2xl shadow border border-l-8 border-purple-500">
                <h4 className="font-bold text-gray-800">{a.title}</h4>
                <p className="text-sm text-gray-500 mb-3">{a.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-red-500">Muddat: {a.deadline}</span>
                  {userData?.role === "student" && (
                    <Link to={`/assignments`} className="text-purple-600 font-bold text-sm hover:underline">
                      Javob yuborish →
                    </Link>
                  )}
                </div>
              </div>
            )) : (
              <p className="text-gray-400 italic bg-gray-50 p-6 rounded-2xl text-center border-2 border-dashed">Hozircha topshiriqlar yo'q.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CourseDetails;
