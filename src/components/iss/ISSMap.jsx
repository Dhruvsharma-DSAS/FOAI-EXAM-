import { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCoordinate } from '../../utils/formatters';

/* ---- Marker updater (imperative, avoids re-renders) ---- */
function MapUpdater({ position, positions }) {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (!position.lat || !position.lng) return;

    // Create or update marker
    if (!markerRef.current) {
      const icon = L.divIcon({
        html: `
          <div class="iss-marker">
            <div class="iss-pulse-ring"></div>
            <div class="iss-pulse-ring delay-1"></div>
            <div class="iss-satellite">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
        `,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      markerRef.current = L.marker([position.lat, position.lng], { icon }).addTo(map);
    } else {
      markerRef.current.setLatLng([position.lat, position.lng]);
    }

    map.flyTo([position.lat, position.lng], map.getZoom(), {
      animate: true,
      duration: 1.5,
    });

    return () => {};
  }, [position.lat, position.lng, map]);

  return null;
}

export default function ISSMap({ position, positions }) {
  const { theme } = useTheme();

  const tileUrl = theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  // Trajectory polylines with fade
  const trajectorySegments = useMemo(() => {
    if (positions.length < 2) return [];
    return positions.slice(-15).map((pos, i, arr) => {
      if (i === 0) return null;
      return {
        key: `traj-${i}`,
        positions: [
          [arr[i - 1].lat, arr[i - 1].lng],
          [pos.lat, pos.lng],
        ],
        opacity: 0.2 + (i / arr.length) * 0.8,
      };
    }).filter(Boolean);
  }, [positions]);

  const defaultCenter = position.lat ? [position.lat, position.lng] : [0, 0];

  return (
    <GlassCard className="p-0 overflow-hidden relative" hover={false}>
      <div className="h-[320px] md:h-[480px] relative">
        <MapContainer
          center={defaultCenter}
          zoom={3}
          scrollWheelZoom={true}
          className="h-full w-full"
          zoomControl={true}
          style={{ borderRadius: '20px' }}
        >
          <TileLayer url={tileUrl} subdomains={['a', 'b', 'c', 'd']} />
          <MapUpdater position={position} positions={positions} />

          {/* Trajectory */}
          {trajectorySegments.map((seg) => (
            <Polyline
              key={seg.key}
              positions={seg.positions}
              pathOptions={{
                color: '#06B6D4',
                weight: 2.5,
                opacity: seg.opacity,
              }}
            />
          ))}

          {/* Past dots */}
          {positions.slice(-15).map((pos, i) => (
            <CircleMarker
              key={`dot-${i}`}
              center={[pos.lat, pos.lng]}
              radius={3}
              pathOptions={{
                fillColor: '#06B6D4',
                fillOpacity: 0.2 + (i / 15) * 0.6,
                weight: 0,
                fill: true,
              }}
            />
          ))}
        </MapContainer>

        {/* Coordinate overlay */}
        <div
          className="absolute top-4 right-4 z-[1000] px-4 py-3 rounded-xl border"
          style={{
            background: 'rgba(from var(--bg-deep) r g b / 0.85)',
            backdropFilter: 'blur(12px)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${position.lat}-${position.lng}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                LAT <span style={{ color: 'var(--cyan-500)' }}>{formatCoordinate(position.lat, 'lat')}</span>
              </p>
              <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                LON <span style={{ color: 'var(--cyan-500)' }}>{formatCoordinate(position.lng, 'lng')}</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
}
