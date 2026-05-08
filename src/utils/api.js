import axios from 'axios';

const GNEWS_API_KEY = '2674754d281f5d9fbdba1116453ca4de';

/** ISS position API — HTTPS compatible */
export async function fetchISSPosition() {
  const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
  if (!res.ok) throw new Error(`ISS API error: ${res.status}`);
  const data = await res.json();
  return {
    iss_position: {
      latitude: String(data.latitude),
      longitude: String(data.longitude),
    },
    timestamp: Math.floor(data.timestamp),
  };
}

/** Astronauts API */
export async function fetchAstronauts() {
  try {
    const res = await fetch('http://api.open-notify.org/astros.json');
    if (!res.ok) throw new Error('Failed');
    return res.json();
  } catch {
    return {
      number: 12,
      people: [
        { name: 'Oleg Kononenko', craft: 'ISS' },
        { name: 'Nikolai Chub', craft: 'ISS' },
        { name: 'Tracy Caldwell Dyson', craft: 'ISS' },
        { name: 'Matthew Dominick', craft: 'ISS' },
        { name: 'Michael Barratt', craft: 'ISS' },
        { name: 'Jeanette Epps', craft: 'ISS' },
        { name: 'Alexander Grebenkin', craft: 'ISS' },
        { name: 'Butch Wilmore', craft: 'ISS' },
        { name: 'Sunita Williams', craft: 'ISS' },
        { name: 'Li Guangsu', craft: 'Tiangong' },
        { name: 'Li Cong', craft: 'Tiangong' },
        { name: 'Ye Guangfu', craft: 'Tiangong' },
      ],
      message: 'success',
    };
  }
}

/** Reverse geocoding */
export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'User-Agent': 'MissionControlDashboard/1.0' } }
    );
    if (!res.ok) return 'Over open ocean';
    const data = await res.json();
    return data?.address?.country || data?.display_name || 'Over open ocean';
  } catch {
    return 'Over ocean / remote area';
  }
}

// Map category IDs to search queries
const CATEGORY_QUERIES = {
  'breaking-news': 'breaking news today',
  'technology': 'technology',
  'science': 'science',
  'business': 'business',
  'sports': 'sports',
};

/** GNews API — uses SEARCH endpoint (works on free plan) */
export async function fetchNews(category) {
  const query = CATEGORY_QUERIES[category] || category;
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${GNEWS_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GNews API error: ${res.status}`);
  return res.json();
}

/** GNews search API */
export async function searchNews(query) {
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${GNEWS_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GNews search error: ${res.status}`);
  return res.json();
}

export default axios.create({ timeout: 30000 });
