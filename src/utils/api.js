import axios from 'axios';

/** Axios instance with default config */
const api = axios.create({
  timeout: 30000,
});

/** ISS position API */
export async function fetchISSPosition(signal) {
  const res = await fetch('http://api.open-notify.org/iss-now.json', { signal });
  if (!res.ok) throw new Error(`ISS API error: ${res.status}`);
  return res.json();
}

/** Astronauts API */
export async function fetchAstronauts(signal) {
  const res = await fetch('http://api.open-notify.org/astros.json', { signal });
  if (!res.ok) throw new Error(`Astronaut API error: ${res.status}`);
  return res.json();
}

/** Reverse geocoding (debounced externally) */
export async function reverseGeocode(lat, lon, signal) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    {
      headers: { 'User-Agent': 'MissionControlDashboard/1.0' },
      signal,
    }
  );
  if (!res.ok) return 'Over open ocean';
  const data = await res.json();
  return data?.address?.country || data?.display_name || 'Over open ocean';
}

/** GNews API */
export async function fetchNews(category, apiKey, signal) {
  const url = `https://gnews.io/api/v4/top-headlines?topic=${category}&lang=en&max=10&apikey=${apiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`GNews API error: ${res.status}`);
  return res.json();
}

/** GNews search API */
export async function searchNews(query, apiKey, signal) {
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${apiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`GNews search error: ${res.status}`);
  return res.json();
}

export default api;
