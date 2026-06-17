import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data);
    } catch (err) {
      console.error('Kurslarni yuklashda xatolik:', err);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', { title, description });
      setTitle('');
      setDescription('');
      fetchCourses();
    } catch (err) {
      console.error('Kurs yaratishda xatolik:', err);
    }
  };

  const handleDeleteCourse = async (id) => {
    if(window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
      try {
        await api.delete(`/courses/${id}`);
        fetchCourses();
      } catch (err) {
        console.error('O\'chirishda xatolik', err);
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Barcha Kurslar</h2>

      {/* Faqat o'qituvchi va admin kurs yarata oladi */}
      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Yangi Kurs Yaratish</h3>
          <form onSubmit={handleCreateCourse} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Kurs nomi" 
              className="border p-2 rounded focus:outline-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea 
              placeholder="Kurs haqida qisqacha" 
              className="border p-2 rounded focus:outline-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 w-48">
              Yaratish
            </button>
          </form>
        </div>
      )}

      {/* Kurslar ro'yxati */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{course.description}</p>
              <p className="text-sm font-semibold text-blue-600 mb-4">O'qituvchi: {course.teacher_name}</p>
            </div>
            
            <div className="flex justify-between items-center mt-4 border-t pt-4">
              <button 
                onClick={() => navigate(`/courses/${course.id}`)}
                className="text-blue-600 hover:underline font-semibold"
              >
                Kursga kirish &rarr;
              </button>
              
              {(user?.role === 'admin' || (user?.role === 'teacher' && user?.name === course.teacher_name)) && (
                <button 
                  onClick={() => handleDeleteCourse(course.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-bold"
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

export default Courses;
