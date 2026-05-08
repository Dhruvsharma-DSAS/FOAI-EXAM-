import axios from 'axios';

// Hardcoded for reliable Vercel deployment (no need to set env vars in Vercel dashboard)
const GNEWS_API_KEY = '2674754d281f5d9fbdba1116453ca4de';

const api = axios.create({
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  }
});

/** ISS position API — HTTPS compatible with fallbacks */
export async function fetchISSPosition() {
  try {
    // Primary: wheretheiss.at (HTTPS)
    const res = await api.get('https://api.wheretheiss.at/v1/satellites/25544');
    if (res.data) {
      return {
        iss_position: {
          latitude: String(res.data.latitude),
          longitude: String(res.data.longitude),
        },
        timestamp: Math.floor(res.data.timestamp),
      };
    }
  } catch (err) {
    console.error('Primary ISS API failed:', err.message);
  }

  try {
    // Secondary: open-notify (JSONP or Proxy often needed for HTTPS, but try anyway)
    const res = await api.get('https://api.open-notify.org/iss-now.json');
    if (res.data) return res.data;
  } catch (err) {
    console.error('Secondary ISS API failed:', err.message);
  }

  throw new Error('Telemetry connection lost. Please check your internet.');
}

/** Astronauts API — with hardcoded fallback for stability */
export async function fetchAstronauts() {
  try {
    const res = await api.get('https://api.open-notify.org/astros.json');
    if (res.data) return res.data;
  } catch (err) {
    console.error('Astronaut API fetch failed, using fallback:', err.message);
  }
  
  return {
    number: 12,
    people: [
      { name: 'Oleg Kononenko', craft: 'ISS' }, { name: 'Nikolai Chub', craft: 'ISS' },
      { name: 'Tracy Caldwell Dyson', craft: 'ISS' }, { name: 'Matthew Dominick', craft: 'ISS' },
      { name: 'Michael Barratt', craft: 'ISS' }, { name: 'Jeanette Epps', craft: 'ISS' },
      { name: 'Alexander Grebenkin', craft: 'ISS' }, { name: 'Butch Wilmore', craft: 'ISS' },
      { name: 'Sunita Williams', craft: 'ISS' }, { name: 'Li Guangsu', craft: 'Tiangong' },
      { name: 'Li Cong', craft: 'Tiangong' }, { name: 'Ye Guangfu', craft: 'Tiangong' },
    ],
    message: 'success',
  };
}

/** Reverse geocoding */
export async function reverseGeocode(lat, lon) {
  try {
    const res = await api.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
      headers: { 'User-Agent': 'MissionControlDashboard/1.0' }
    });
    return res.data?.address?.country || res.data?.display_name || 'Over open ocean';
  } catch {
    return 'Over ocean / remote area';
  }
}

const CATEGORY_QUERIES = {
  'breaking-news': 'world news',
  'technology': 'technology',
  'science': 'science',
  'business': 'business',
  'sports': 'sports',
};

/** GNews API — uses SEARCH endpoint (works on free plan) */
export async function fetchNews(category) {
  const query = CATEGORY_QUERIES[category] || category;
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${GNEWS_API_KEY}`;
  
  try {
    const res = await api.get(url);
    if (!res.data || !res.data.articles) {
      throw new Error('Invalid API response');
    }
    return res.data;
  } catch (err) {
    if (err.response?.status === 429) {
      throw new Error('News limit reached (100/day). Try again later.');
    }
    throw new Error(err.message || 'Failed to connect to news service');
  }
}

/** GNews search API */
export async function searchNews(query) {
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${GNEWS_API_KEY}`;
  const res = await api.get(url);
  return res.data;
}

export default api;
