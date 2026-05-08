import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../context/ThemeContext';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom ISS Marker
const issIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/International_Space_Station.svg/200px-International_Space_Station.svg.png',
  iconSize: [48, 30],
  iconAnchor: [24, 15],
  popupAnchor: [0, -15],
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== 0) {
      map.flyTo(center, map.getZoom(), { animate: true, duration: 2 });
    }
  }, [center, map]);
  return null;
}

export default function ISSMap({ position, positions }) {
  const { theme } = useTheme();
  const center = position.lat ? [position.lat, position.lng] : [20, 0];
  
  const tileUrl = theme === 'dark' 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div 
      className="relative rounded-3xl overflow-hidden border border-[var(--border-default)]"
      style={{ height: '600px' }}
    >
      {/* Map Header Overlay */}
      <div className="absolute top-5 left-5 z-[1000] space-y-1">
        <span className="eyebrow text-accent-500">REAL-TIME TRAJECTORY</span>
        <h3 className="text-xl font-bold font-display" style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          Live Ground Track
        </h3>
      </div>

      {/* Sync Badge */}
      <div className="absolute top-5 right-5 z-[1000]">
        <div 
          className="px-3 py-1.5 rounded-full flex items-center gap-2 border"
          style={{ 
            background: 'rgba(10, 13, 24, 0.85)', 
            borderColor: 'rgba(99, 102, 241, 0.2)',
            backdropFilter: 'blur(12px)' 
          }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-white tracking-wider uppercase">
            {position.lat ? 'TRACKING' : 'ACQUIRING'}
          </span>
        </div>
      </div>

      {/* Leaflet Map — rendered directly, no GlassCard wrapper */}
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={true}
        zoomControl={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer 
          url={tileUrl} 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        
        {positions.length > 1 && (
          <Polyline
            positions={positions.map(p => [p.lat, p.lng])}
            pathOptions={{ color: '#6366f1', weight: 3, opacity: 0.7, dashArray: '8, 8' }}
          />
        )}

        {position.lat && (
          <>
            <Marker position={[position.lat, position.lng]} icon={issIcon} />
            <MapRecenter center={[position.lat, position.lng]} />
          </>
        )}
      </MapContainer>

      {/* Coordinates Overlay */}
      <div className="absolute bottom-5 left-5 z-[1000]">
        <div 
          className="px-4 py-3 rounded-xl font-mono text-[11px] space-y-1 border"
          style={{ 
            background: 'rgba(10, 13, 24, 0.85)', 
            borderColor: 'rgba(99, 102, 241, 0.15)',
            backdropFilter: 'blur(12px)' 
          }}
        >
          <p style={{ color: '#94a3b8' }}>
            <span style={{ color: '#6366f1' }} className="mr-2">LAT</span>
            {position.lat?.toFixed(4) || '—'}
          </p>
          <p style={{ color: '#94a3b8' }}>
            <span style={{ color: '#6366f1' }} className="mr-2">LNG</span>
            {position.lng?.toFixed(4) || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
