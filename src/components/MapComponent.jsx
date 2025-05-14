import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ArrowUpRight } from 'lucide-react';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ 
  profiles, 
  selectedProfile,
  height = 'h-96'
}) => {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [mapZoom, setMapZoom] = useState(2);

  // Set map center based on selected profile
  useEffect(() => {
    if (selectedProfile) {
      setMapCenter([selectedProfile.address.coordinates.lat, selectedProfile.address.coordinates.lng]);
      setMapZoom(13);
    } else if (profiles.length > 0) {
      // Get average location of all profiles
      const totalProfiles = profiles.length;
      const sumLat = profiles.reduce((sum, p) => sum + p.address.coordinates.lat, 0);
      const sumLng = profiles.reduce((sum, p) => sum + p.address.coordinates.lng, 0);
      
      setMapCenter([sumLat / totalProfiles, sumLng / totalProfiles]);
      setMapZoom(2);
    }
  }, [selectedProfile, profiles]);

  // Custom marker component to add animation
  const customIcon = (isSelected) => L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="${isSelected ? 'animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75' : ''}"></div>
           <div class="${isSelected ? 'relative rounded-full h-4 w-4 bg-blue-600' : 'relative rounded-full h-3 w-3 bg-red-500'}"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 24],
  });

  return (
    <div className={`${height} rounded-lg overflow-hidden shadow-md relative z-0`}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {profiles.map(profile => (
          <Marker 
            key={profile.id}
            position={[profile.address.coordinates.lat, profile.address.coordinates.lng]}
            icon={customIcon(selectedProfile?.id === profile.id)}
          >
            <Popup>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-1">
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <strong>{profile.name}</strong>
                </div>
                <p className="text-xs text-gray-600 mb-1">{profile.address.street}, {profile.address.city}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${profile.address.coordinates.lat},${profile.address.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center text-blue-600 hover:underline"
                >
                  Open in Google Maps
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapUpdater center={mapCenter} zoom={mapZoom} />
      </MapContainer>
    </div>
  );
};

// Helper component to update map view when props change
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

export default MapComponent;