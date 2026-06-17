import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data.data);
      } catch (err) {
        console.error('Profilni yuklashda xato', err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="p-8">Yuklanmoqda...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-blue-600">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Mening Profilim</h2>
        <div className="space-y-4 text-lg">
          <p><span className="font-semibold text-gray-600">Ism:</span> {profile.name}</p>
          <p><span className="font-semibold text-gray-600">Email:</span> {profile.email}</p>
          <p><span className="font-semibold text-gray-600">Rol:</span> <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">{profile.role}</span></p>
          <p><span className="font-semibold text-gray-600">Ro'yxatdan o'tgan sana:</span> {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
