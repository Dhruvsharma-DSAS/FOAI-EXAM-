import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../context/ThemeContext';
import { useEffect, useRef } from 'react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Red glowing dot marker
const issIcon = L.divIcon({
  className: 'iss-marker',
  html: `<div style="
    width: 20px; height: 20px; 
    background: #EF4444; 
    border: 3px solid white; 
    border-radius: 50%; 
    box-shadow: 0 0 12px rgba(239,68,68,0.6), 0 0 24px rgba(239,68,68,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
});

// Only center the map ONCE on first valid position
function InitialCenter({ center }) {
  const map = useMap();
  const hasCentered = useRef(false);
  
  useEffect(() => {
    if (!hasCentered.current && center[0] !== 0 && center[0] !== 20) {
      map.flyTo(center, 4, { animate: true, duration: 1.5 });
      hasCentered.current = true;
    }
  }, [center, map]);
  
  return null;
}

export default function ISSMap({ position, positions, nearestPlace, onRecenter }) {
  const { theme } = useTheme();
  const center = position.lat ? [position.lat, position.lng] : [20, 0];
  
  const tileUrl = theme === 'dark' 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div 
      className="relative rounded-2xl overflow-hidden border border-[var(--border-default)]"
      style={{ height: '100%', minHeight: '400px' }}
    >
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={true}
        zoomControl={true}
        dragging={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer 
          url={tileUrl} 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
        />
        
        {/* Trajectory trail */}
        {positions.length > 1 && (
          <Polyline
            positions={positions.map(p => [p.lat, p.lng])}
            pathOptions={{ color: '#6366f1', weight: 3, opacity: 0.7, dashArray: '8, 8' }}
          />
        )}

        {/* ISS Marker — clickable popup, map freely pannable */}
        {position.lat && (
          <>
            <Marker position={[position.lat, position.lng]} icon={issIcon}>
              <Popup>
                <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '180px' }}>
                  <strong style={{ fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                    🛰️ ISS Current Position
                  </strong>
                  <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                    <div><strong>Lat:</strong> {position.lat?.toFixed(4)}</div>
                    <div><strong>Lng:</strong> {position.lng?.toFixed(4)}</div>
                    <div><strong>Location:</strong> {nearestPlace || 'Locating...'}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
            <InitialCenter center={[position.lat, position.lng]} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
