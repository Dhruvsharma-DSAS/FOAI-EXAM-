import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
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
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2005/2005115.png', // Satellite icon
  iconSize: [40, 40],
  iconAnchor: [20, 20],
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
  const defaultCenter = position.lat ? [position.lat, position.lng] : [0, 0];
  
  // Use a high-quality dark/light tile provider
  const tileUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <GlassCard className="p-0 overflow-hidden h-[480px] lg:h-[600px] border border-[var(--border-strong)]">
      <div className="absolute top-6 left-6 z-[1000] space-y-1">
        <span className="eyebrow text-accent-500">REAL-TIME TRAJECTORY</span>
        <h3 className="text-xl font-bold text-bright font-display">Live Ground Track</h3>
      </div>

      <div className="absolute top-6 right-6 z-[1000] flex gap-2">
        <div className="px-3 py-1.5 rounded-full bg-[var(--bg-deep)]/80 backdrop-blur-md border border-[var(--border-subtle)] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-bright tracking-wider uppercase">
            SYNC: {position.lat ? 'ACTIVE' : 'SEARCHING'}
          </span>
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={3}
        scrollWheelZoom={false}
        className="w-full h-full grayscale-[0.2] brightness-[0.9]"
        zoomControl={false}
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        
        {positions.length > 1 && (
          <Polyline
            positions={positions.map(p => [p.lat, p.lng])}
            color="var(--accent-500)"
            weight={3}
            opacity={0.6}
            dashArray="10, 10"
          />
        )}

        {position.lat && (
          <>
            <Marker position={[position.lat, position.lng]} icon={issIcon} />
            <MapRecenter center={[position.lat, position.lng]} />
          </>
        )}
      </MapContainer>

      {/* Map Coordinates Footer */}
      <div className="absolute bottom-6 left-6 z-[1000]">
        <div className="px-4 py-2 rounded-xl bg-[var(--bg-deep)]/80 backdrop-blur-md border border-[var(--border-subtle)] font-mono text-[11px] space-y-0.5">
          <p className="text-muted"><span className="text-accent-500 mr-2">LAT:</span>{position.lat?.toFixed(4) || '0.0000'}</p>
          <p className="text-muted"><span className="text-accent-500 mr-2">LNG:</span>{position.lng?.toFixed(4) || '0.0000'}</p>
        </div>
      </div>
    </GlassCard>
  );
}
