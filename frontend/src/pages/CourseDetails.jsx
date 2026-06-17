import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [file, setFile] = useState(null);
  const [materialTitle, setMaterialTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [matsRes, assignsRes] = await Promise.all([
        api.get(`/materials/course/${id}`),
        api.get(`/assignments/course/${id}`)
      ]);
      setMaterials(matsRes.data.data);
      setAssignments(assignsRes.data.data);
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik", err);
    }
  };

  const handleMaterialUpload = async (e) => {
    e.preventDefault();
    if (!file || !materialTitle) return alert('Barcha maydonlarni to\'ldiring');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_id', id);
    formData.append('title', materialTitle);

    try {
      setUploading(true);
      await api.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMaterialTitle('');
      setFile(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Yuklashda xatolik');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Materiallar qismi */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">O'quv Materiallari</h2>
        
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <form onSubmit={handleMaterialUpload} className="bg-white p-4 rounded-lg shadow mb-6 border">
            <h4 className="font-semibold mb-2">Material yuklash</h4>
            <input 
              type="text" placeholder="Material nomi" 
              className="border p-2 w-full mb-2 rounded"
              value={materialTitle} onChange={e => setMaterialTitle(e.target.value)}
            />
            <input 
              type="file" 
              className="border p-2 w-full mb-2 rounded"
              onChange={e => setFile(e.target.files[0])}
            />
            <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full disabled:bg-gray-400">
              {uploading ? 'Yuklanmoqda...' : 'Yuklash (Firebase)'}
            </button>
          </form>
        )}

        <ul className="bg-white rounded-lg shadow border divide-y">
          {materials.map(mat => (
            <li key={mat.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{mat.title}</p>
                <p className="text-xs text-gray-500">Turi: {mat.file_type}</p>
              </div>
              <a href={mat.file_url} target="_blank" rel="noreferrer" className="text-green-600 hover:underline">
                Yuklab olish
              </a>
            </li>
          ))}
          {materials.length === 0 && <li className="p-4 text-gray-500">Hozircha materiallar yo'q.</li>}
        </ul>
      </div>

      {/* Topshiriqlar qismi */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Topshiriqlar</h2>
        
        <ul className="bg-white rounded-lg shadow border divide-y">
          {assignments.map(ass => (
            <li key={ass.id} className="p-4">
              <h4 className="font-bold text-lg">{ass.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{ass.description}</p>
              <p className="text-xs text-red-500 font-semibold">Muddat: {new Date(ass.deadline).toLocaleDateString()}</p>
              
              {user?.role === 'student' && (
                 <button className="mt-2 text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200">
                   Javob yuborish
                 </button>
              )}
            </li>
          ))}
          {assignments.length === 0 && <li className="p-4 text-gray-500">Hozircha topshiriqlar yo'q.</li>}
        </ul>
      </div>

    </div>
  );
};

export default CourseDetails;
