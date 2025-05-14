import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProfiles } from '../context/ProfileContext';

const ProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profiles, loading } = useProfiles();
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    if (!loading && profiles.length > 0 && id) {
      const foundProfile = profiles.find(p => p.id === id);
      
      if (foundProfile) {
        setProfile(foundProfile);
      } else {
        navigate('/');
      }
    }
  }, [id, profiles, loading, navigate]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading profile details...</p>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-900">Profile not found</h3>
        <p className="mt-2 text-gray-500">The profile you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Profiles
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to all profiles
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/3">
            <div className="h-64 md:h-full w-full relative">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="p-6 md:p-8 md:w-2/3">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h1>
            
            <div className="flex flex-col space-y-3 mb-6">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                    {profile.email}
                  </a>
                </div>
              </div>
              
              {profile.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <a href={`tel:${profile.phone}`} className="text-gray-900">
                      {profile.phone}
                    </a>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <address className="not-italic text-gray-900">
                    {profile.address.street}<br />
                    {profile.address.city}, {profile.address.state} {profile.address.zipCode}<br />
                    {profile.address.country}
                  </address>
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none mb-6">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-gray-700">{profile.description}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          <MapComponent 
            profiles={[profile]} 
            selectedProfile={profile}
            height="h-80"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
