import { useState, useEffect } from 'react';
import { fetchAstronauts } from '../utils/api';

export function useAstronauts() {
  const [astronauts, setAstronauts] = useState({ number: 0, people: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchAstronauts();
        if (!cancelled) {
          setAstronauts({ number: data.number, people: data.people });
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { astronauts, loading, error };
}

export default useAstronauts;
