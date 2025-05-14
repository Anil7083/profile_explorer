import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import MapComponent from '../components/MapComponent';
import SearchFilters from '../components/SearchFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProfiles } from '../context/ProfileContext';
import { ArrowDown, ArrowUp, MapPin } from 'lucide-react';

const ProfileList = () => {
  const { profiles, loading } = useProfiles();
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState({});
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    if (profiles.length > 0) {
      applyFiltersAndSearch();
    }
  }, [profiles, searchQuery, currentFilters, sortConfig]);

  const applyFiltersAndSearch = () => {
    let result = [...profiles];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(profile =>
        profile.name.toLowerCase().includes(query) ||
        profile.address.city.toLowerCase().includes(query) ||
        profile.address.country.toLowerCase().includes(query) ||
        profile.description.toLowerCase().includes(query)
      );
    }

    if (currentFilters.country) {
      result = result.filter(profile =>
        profile.address.country.toLowerCase() === currentFilters.country.toLowerCase()
      );
    }

    if (currentFilters.city) {
      result = result.filter(profile =>
        profile.address.city.toLowerCase() === currentFilters.city.toLowerCase()
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        let valueA, valueB;

        if (sortConfig.key.includes('.')) {
          const [parent, child] = sortConfig.key.split('.');
          valueA = a[parent][child];
          valueB = b[parent][child];
        } else {
          valueA = a[sortConfig.key];
          valueB = b[sortConfig.key];
        }

        if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProfiles(result);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
  };

  const handleSort = (key) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const renderSortIcon = (key) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const handleShowOnMap = (profile) => {
    setSelectedProfile(profile);
    if (!showMap) {
      setShowMap(true);
    }

    if (window.innerWidth < 768) {
      const mapElement = document.getElementById('map-container');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading profiles...</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-xl font-medium text-gray-900">No profiles found</h3>
        <p className="mt-1 text-gray-500">Get started by creating your first profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Explorer</h1>

      <SearchFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      <div className="flex flex-col-reverse md:flex-row md:space-x-6">
        <div className="md:w-2/3 space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredProfiles.length} of {profiles.length} profiles
            </div>

            <div className="flex space-x-2">
              <SortButton
                label="Name"
                onClick={() => handleSort('name')}
                active={sortConfig?.key === 'name'}
                icon={renderSortIcon('name')}
              />
              <SortButton
                label="Country"
                onClick={() => handleSort('address.country')}
                active={sortConfig?.key === 'address.country'}
                icon={renderSortIcon('address.country')}
              />
              <SortButton
                label="City"
                onClick={() => handleSort('address.city')}
                active={sortConfig?.key === 'address.city'}
                icon={renderSortIcon('address.city')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map(profile => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onShowOnMap={handleShowOnMap}
                />
              ))
            ) : (
              <div className="sm:col-span-2 py-8 text-center">
                <p className="text-gray-500">No profiles match your search criteria</p>
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/3 mb-6 md:mb-0">
          <div className="sticky top-4" id="map-container">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium text-gray-900">
                {selectedProfile ? `${selectedProfile.name}'s Location` : 'All Locations'}
              </h2>
              <button
                onClick={() => setShowMap(!showMap)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>

            {showMap && (
              <>
                <MapComponent
                  profiles={filteredProfiles}
                  selectedProfile={selectedProfile}
                  height="h-[calc(100vh-280px)]"
                />
                {selectedProfile && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm">
                    <p className="font-medium">{selectedProfile.address.street}</p>
                    <p className="text-gray-600">
                      {selectedProfile.address.city}, {selectedProfile.address.state} {selectedProfile.address.zipCode}
                    </p>
                    <p className="text-gray-600">{selectedProfile.address.country}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SortButton = ({ label, onClick, active, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-2 py-1 text-xs rounded ${
        active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
      {icon && <span className="ml-1">{icon}</span>}
    </button>
  );
};

export default ProfileList;
