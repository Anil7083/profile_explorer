import React, { useState } from 'react';
import { MapPin, ArrowRight, MapIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileCard = ({ profile, onShowOnMap }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={profile.avatar} 
          alt={profile.name} 
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg truncate">{profile.name}</h3>
          <div className="flex items-center text-white/80 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{profile.address.city}, {profile.address.country}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-700 line-clamp-2 mb-4 h-12">
          {profile.description}
        </p>
        
        <div className="flex justify-between items-center">
          <button
            onClick={() => onShowOnMap(profile)}
            className="flex items-center text-sm px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <MapIcon className="h-4 w-4 mr-1" />
            <span>Show on Map</span>
          </button>
          
          <Link
            to={`/profile/${profile.id}`}
            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;