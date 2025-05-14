import React, { createContext, useContext, useState, useEffect } from 'react';
import { sampleProfiles } from '../data/sampleProfiles';

const ProfileContext = createContext(undefined);

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfiles must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));

        const savedProfiles = localStorage.getItem('profiles');
        if (savedProfiles) {
          setProfiles(JSON.parse(savedProfiles));
        } else {
          setProfiles(sampleProfiles);
          localStorage.setItem('profiles', JSON.stringify(sampleProfiles));
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setProfiles(sampleProfiles);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const saveProfiles = (updatedProfiles) => {
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
    setProfiles(updatedProfiles);
  };

  const addProfile = (profileData) => {
    const newProfile = {
      ...profileData,
      id: crypto.randomUUID(),
    };

    const updatedProfiles = [...profiles, newProfile];
    saveProfiles(updatedProfiles);
  };

  const updateProfile = (updatedProfile) => {
    const updatedProfiles = profiles.map(profile =>
      profile.id === updatedProfile.id ? updatedProfile : profile
    );

    saveProfiles(updatedProfiles);
  };

  const deleteProfile = (id) => {
    const updatedProfiles = profiles.filter(profile => profile.id !== id);
    saveProfiles(updatedProfiles);
  };

  return (
    <ProfileContext.Provider value={{
      profiles,
      loading,
      addProfile,
      updateProfile,
      deleteProfile,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};
