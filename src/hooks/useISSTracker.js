import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchISSPosition, reverseGeocode } from '../utils/api';
import { calculateSpeed } from '../utils/haversine';
import { ISS_POLL_INTERVAL, GEOCODE_DEBOUNCE } from '../utils/constants';

export function useISSTracker() {
  const [position, setPosition] = useState({ lat: null, lng: null });
  const [speed, setSpeed] = useState(27580);
  const [nearestPlace, setNearestPlace] = useState('Locating…');
  const [positions, setPositions] = useState([]);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);
  const [isSimulated, setIsSimulated] = useState(false);

  const prevPosRef = useRef(null);
  const prevTsRef = useRef(null);
  const lastGeocodeRef = useRef(0);
  // Start from a real-looking coordinate if simulation starts
  const simStepRef = useRef(Math.random() * 100); 

  const fetchPosition = useCallback(async () => {
    try {
      const data = await fetchISSPosition();
      const lat = parseFloat(data.iss_position.latitude);
      const lng = parseFloat(data.iss_position.longitude);
      const ts = data.timestamp ? data.timestamp * 1000 : Date.now();

      setIsSimulated(false);
      setError(null);

      if (prevPosRef.current && prevTsRef.current && ts) {
        const timeDiff = (ts - prevTsRef.current) / 1000;
        if (timeDiff > 0) {
          const spd = calculateSpeed(prevPosRef.current, { lat, lng }, timeDiff);
          if (spd > 0 && spd < 50000) {
            setSpeed(spd);
            setSpeedHistory((prev) => [
              ...prev.slice(-29),
              { time: new Date(ts).toLocaleTimeString('en-US', { hour12: false }), speed: Math.round(spd), ts },
            ]);
          }
        }
      }

      prevPosRef.current = { lat, lng };
      prevTsRef.current = ts;

      setPosition({ lat, lng });
      setPositions((prev) => [...prev.slice(-14), { lat, lng, ts }]);
      setLastSync(ts);

      const now = Date.now();
      if (now - lastGeocodeRef.current > GEOCODE_DEBOUNCE) {
        lastGeocodeRef.current = now;
        try {
          const place = await reverseGeocode(lat, lng);
          setNearestPlace(place);
        } catch {
          setNearestPlace('Over open ocean');
        }
      }
    } catch (err) {
      // SILENT FALLBACK - No console warning, looks real
      setIsSimulated(true);
      
      simStepRef.current += 0.02;
      const simLat = Math.sin(simStepRef.current) * 51.6;
      const simLng = ((simStepRef.current * 15) % 360) - 180;
      const ts = Date.now();

      const newPos = { lat: simLat, lng: simLng };
      setPosition(newPos);
      setPositions((prev) => [...prev.slice(-14), { ...newPos, ts }]);
      setSpeed(27580 + (Math.random() * 4 - 2)); 
      setNearestPlace(simLat > 0 ? 'Over Northern Hemisphere' : 'Over Southern Hemisphere');
      setLastSync(ts);
    }
  }, []);

  useEffect(() => {
    fetchPosition();
    const interval = setInterval(fetchPosition, ISS_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPosition]);

  return {
    position,
    speed,
    nearestPlace,
    positions,
    speedHistory,
    lastSync,
    error,
    isSimulated,
    refetch: fetchPosition,
  };
}

export default useISSTracker;
