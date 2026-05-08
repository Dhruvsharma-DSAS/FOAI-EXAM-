import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchISSPosition, reverseGeocode } from '../utils/api';
import { calculateSpeed } from '../utils/haversine';
import { ISS_POLL_INTERVAL, GEOCODE_DEBOUNCE } from '../utils/constants';

export function useISSTracker() {
  const [position, setPosition] = useState({ lat: null, lng: null });
  const [speed, setSpeed] = useState(null);
  const [nearestPlace, setNearestPlace] = useState('Locating…');
  const [positions, setPositions] = useState([]);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);

  const prevPosRef = useRef(null);
  const prevTsRef = useRef(null);
  const lastGeocodeRef = useRef(0);

  const fetchPosition = useCallback(async () => {
    try {
      const data = await fetchISSPosition();
      const lat = parseFloat(data.iss_position.latitude);
      const lng = parseFloat(data.iss_position.longitude);
      const ts = data.timestamp * 1000;

      // Calculate speed if we have a previous position
      if (prevPosRef.current && prevTsRef.current) {
        const timeDiff = (ts - prevTsRef.current) / 1000;
        if (timeDiff > 0) {
          const spd = calculateSpeed(prevPosRef.current, { lat, lng }, timeDiff);
          // Filter out unreasonable speeds (ISS orbits at ~27,600 km/h)
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
      setError(null);

      // Reverse geocode (debounced)
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
      setError(err.message);
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
    refetch: fetchPosition,
  };
}

export default useISSTracker;
