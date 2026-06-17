import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  serverTimestamp,
  orderBy,
  deleteDoc,
  doc
} from "firebase/firestore";

const Assignments = () => {
  const { userData, currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [courseId, setCourseId] = useState("");
  const [answerLink, setAnswerLink] = useState("");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null); // Javob yuborilayotgan topshiriq

  useEffect(() => {
    fetchCourses();
    fetchAssignments();
    fetchSubmissions();
  }, []);

  const fetchCourses = async () => {
    const q = query(collection(db, "courses"));
    const snap = await getDocs(q);
    setCourses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchAssignments = async () => {
    const q = query(collection(db, "assignments"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setAssignments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchSubmissions = async () => {
    const q = query(collection(db, "submissions"), orderBy("submittedAt", "desc"));
    const snap = await getDocs(q);
    setSubmissions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // O'QITUVCHI: Topshiriq yaratish
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!courseId) return alert("Iltimos, kursni tanlang!");
    try {
      setLoading(true);
      await addDoc(collection(db, "assignments"), {
        title,
        description,
        deadline,
        courseId,
        courseName: courses.find(c => c.id === courseId)?.title || "Noma'lum",
        teacherId: currentUser.uid,
        teacherName: userData.name,
        createdAt: serverTimestamp()
      });
      setTitle(""); setDescription(""); setDeadline(""); setCourseId("");
      fetchAssignments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // O'QITUVCHI: Topshiriqni o'chirish
  const handleDeleteAssignment = async (id) => {
    if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
      await deleteDoc(doc(db, "assignments", id));
      fetchAssignments();
    }
  };

  // TALABA: Javob yuborish
  const handleSubmitAnswer = async (e, assignmentId) => {
    e.preventDefault();
    if (!answerLink.includes("drive.google.com")) {
      return alert("Faqat Google Drive linki qabul qilinadi!");
    }
    try {
      setLoading(true);
      await addDoc(collection(db, "submissions"), {
        assignmentId,
        studentId: currentUser.uid,
        studentName: userData.name,
        answerLink,
        submittedAt: serverTimestamp()
      });
      setAnswerLink("");
      setSelectedAssignmentId(null);
      fetchSubmissions();
      alert("Javobingiz muvaffaqiyatli yuborildi!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper funksiya: Talaba javob yuborganmi yoki yo'qmi tekshirish
  const hasStudentSubmitted = (assignmentId) => {
    return submissions.find(sub => sub.assignmentId === assignmentId && sub.studentId === currentUser.uid);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-4xl font-black text-gray-900 mb-8 border-b-4 border-purple-500 inline-block pb-2">Topshiriqlar Markazi</h1>

      {/* ========================================================
          ADMIN / TEACHER PANELI (Topshiriq berish va tekshirish)
      ======================================================== */}
      {(userData?.role === "teacher" || userData?.role === "admin") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Yaratish Formasi */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-xl border border-purple-100">
            <h2 className="text-xl font-bold mb-6 text-purple-700">Yangi Topshiriq berish</h2>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <input 
                type="text" placeholder="Topshiriq nomi" 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                value={title} onChange={e => setTitle(e.target.value)} required
              />
              <textarea 
                placeholder="Vazifa va ko'rsatmalar..." 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-32"
                value={description} onChange={e => setDescription(e.target.value)} required
              />
              <div className="space-y-4">
                <input 
                  type="date" 
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  value={deadline} onChange={e => setDeadline(e.target.value)} required
                />
                <select 
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  value={courseId} onChange={e => setCourseId(e.target.value)} required
                >
                  <option value="">Kursni tanlang</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <button 
                type="submit" disabled={loading}
                className="bg-purple-600 text-white w-full py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg"
              >
                {loading ? "E'lon qilinmoqda..." : "E'lon qilish"}
              </button>
            </form>
          </div>

          {/* O'qituvchi bergan topshiriqlar va kelgan javoblar ro'yxati */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Berilgan Topshiriqlar va Kelgan Javoblar</h2>
            {assignments.length > 0 ? assignments.map(ass => {
              const assSubmissions = submissions.filter(sub => sub.assignmentId === ass.id);
              return (
                <div key={ass.id} className="bg-white rounded-3xl shadow-md border overflow-hidden">
                  {/* Topshiriq Header */}
                  <div className="p-6 bg-purple-50 flex justify-between items-center border-b">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{ass.title}</h3>
                      <p className="text-sm font-semibold text-purple-600 mt-1">Kurs: {ass.courseName}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="bg-white text-red-500 font-bold px-3 py-1 rounded-full text-xs shadow-sm mb-2 border border-red-100">Muddat: {ass.deadline}</span>
                      <button onClick={() => handleDeleteAssignment(ass.id)} className="text-xs text-gray-500 hover:text-red-500 underline">O'chirish</button>
                    </div>
                  </div>
                  
                  {/* Yuborilgan javoblar */}
                  <div className="p-6">
                    <h4 className="font-bold text-gray-700 mb-4 flex items-center">
                      Talabalar yuborgan javoblar 
                      <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{assSubmissions.length} ta</span>
                    </h4>
                    {assSubmissions.length > 0 ? (
                      <ul className="space-y-3">
                        {assSubmissions.map(sub => (
                          <li key={sub.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border">
                            <span className="font-semibold text-gray-800">{sub.studentName}</span>
                            <a href={sub.answerLink} target="_blank" rel="noreferrer" className="text-sm bg-green-100 text-green-700 font-bold px-4 py-2 rounded-lg hover:bg-green-200">
                              Faylni ko'rish (Drive)
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm italic">Hali hech kim javob yubormagan.</p>
                    )}
                  </div>
                </div>
              );
            }) : <p className="text-gray-500">Siz hali topshiriq bermagansiz.</p>}
          </div>

        </div>
      )}

      {/* ========================================================
          STUDENT PANELI (Topshiriqlarni ko'rish va javob yuborish)
      ======================================================== */}
      {userData?.role === "student" && (
        <div className="space-y-6">
          {assignments.length > 0 ? assignments.map(ass => {
            const submissionInfo = hasStudentSubmitted(ass.id);

            return (
              <div key={ass.id} className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-purple-500 hover:shadow-xl transition">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{ass.title}</h3>
                      {submissionInfo && (
                         <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                           ✓ Yuborilgan
                         </span>
                      )}
                    </div>
                    <p className="text-sm text-purple-600 font-bold mb-3">{ass.courseName} kursi</p>
                    <p className="text-gray-600 mb-4">{ass.description}</p>
                    <p className="text-sm font-bold text-red-500 mb-4 md:mb-0">Oxirgi muddat: {ass.deadline}</p>
                  </div>

                  {/* Agar javob yuborgan bo'lsa: */}
                  {submissionInfo ? (
                    <div className="bg-gray-50 p-4 rounded-xl border text-sm w-full md:w-auto text-right">
                      <p className="text-gray-500 mb-2">Siz yuborgan havola:</p>
                      <a href={submissionInfo.answerLink} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">
                        Drive faylini ko'rish
                      </a>
                    </div>
                  ) : (
                    /* Agar javob yubormagan bo'lsa: */
                    <div className="w-full md:w-auto">
                      {selectedAssignmentId === ass.id ? (
                        <form onSubmit={(e) => handleSubmitAnswer(e, ass.id)} className="flex flex-col gap-2">
                          <input 
                            type="url" 
                            placeholder="Google Drive linkini qo'ying..." 
                            className="p-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 w-full md:w-80 text-sm"
                            value={answerLink}
                            onChange={e => setAnswerLink(e.target.value)}
                            required
                          />
                          <div className="flex gap-2">
                            <button type="submit" disabled={loading} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-xl flex-1 hover:bg-purple-700">Yuborish</button>
                            <button type="button" onClick={() => setSelectedAssignmentId(null)} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-xl hover:bg-gray-300">Bekor qilish</button>
                          </div>
                        </form>
                      ) : (
                        <button 
                          onClick={() => { setSelectedAssignmentId(ass.id); setAnswerLink(""); }}
                          className="bg-purple-100 text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-200 transition w-full md:w-auto"
                        >
                          Vazifani yuklash
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
               <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
               <p className="text-gray-500 text-lg font-medium">Hozircha sizga topshiriq berilmagan.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Assignments;
