import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import api from '../services/api';

const Profile = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      setError(null);
      const response = await api.get('/auth/me/');
      setProfile(response.data);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to load profile');
      // Fallback to authService
      const fallback = authService.getUserFromToken();
      if (fallback) setProfile({ ...user, ...fallback });
    } finally {
      setLoadingProfile(false);
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={fetchProfile}
            className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const fullProfile = profile || user;

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-500 mt-1">View and manage your account details.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {fullProfile.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-800">{fullProfile.name}</h2>
              <p className="text-gray-500">{fullProfile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <p className="bg-gray-50 px-4 py-2 rounded-lg">{fullProfile.email}</p>
            </div>
         
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Member Since</label>
              <p className="bg-gray-50 px-4 py-2 rounded-lg">
                {fullProfile.created_at ? new Date(fullProfile.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Login</label>
              <p className="bg-gray-50 px-4 py-2 rounded-lg">
                {fullProfile.last_login ? new Date(fullProfile.last_login).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>

          {fullProfile.is_staff && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-800">Staff Account</p>
              <p className="text-sm text-blue-700">You have admin privileges.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

