import React, { useState } from 'react';
import { Trash2, Edit, Plus, MapPin, Search } from 'lucide-react';
import { useProfiles } from '../context/ProfileContext';
import ProfileForm from '../components/ProfileForm';
import LoadingSpinner from '../components/LoadingSpinner';

const FORM_MODE = {
  NONE: 'NONE',
  CREATE: 'CREATE',
  EDIT: 'EDIT'
};

const AdminDashboard = () => {
  const { profiles, loading, addProfile, updateProfile, deleteProfile } = useProfiles();
  const [formMode, setFormMode] = useState(FORM_MODE.NONE);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.address.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProfile = () => {
    setSelectedProfile(null);
    setFormMode(FORM_MODE.CREATE);
  };

  const handleEditProfile = (profile) => {
    setSelectedProfile(profile);
    setFormMode(FORM_MODE.EDIT);
  };

  const handleDeleteProfile = (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      deleteProfile(profileId);
    }
  };

  const handleFormSubmit = (profileData) => {
    if (formMode === FORM_MODE.CREATE) {
      addProfile(profileData);
    } else if (formMode === FORM_MODE.EDIT && selectedProfile) {
      updateProfile({ ...profileData, id: selectedProfile.id });
    }
    setFormMode(FORM_MODE.NONE);
    setSelectedProfile(null);
  };

  const handleFormCancel = () => {
    setFormMode(FORM_MODE.NONE);
    setSelectedProfile(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading profiles...</p>
      </div>
    );
  }

  if (formMode !== FORM_MODE.NONE) {
    return (
      <ProfileForm
        profile={selectedProfile || undefined}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={handleAddProfile}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add New Profile
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search profiles..."
          className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-xl font-medium text-gray-900">No profiles yet</h3>
          <p className="mt-1 text-gray-500">Get started by creating your first profile.</p>
          <button
            onClick={handleAddProfile}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Profile
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map(profile => (
                    <tr key={profile.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={profile.avatar} alt={profile.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{profile.email}</div>
                        <div className="text-sm text-gray-500">{profile.phone || 'No phone number'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{profile.address.city}</div>
                        <div className="text-sm text-gray-500">{profile.address.country}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditProfile(profile)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(profile.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No profiles match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
