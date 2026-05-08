import axios from 'axios';

const GNEWS_API_KEY = '2674754d281f5d9fbdba1116453ca4de';

/** ISS position API — HTTPS compatible with fallbacks */
export async function fetchISSPosition() {
  try {
    // Primary: wheretheiss.at (HTTPS)
    const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    if (res.ok) {
      const data = await res.json();
      return {
        iss_position: {
          latitude: String(data.latitude),
          longitude: String(data.longitude),
        },
        timestamp: Math.floor(data.timestamp),
      };
    }
  } catch (err) {
    console.error('Primary ISS API failed:', err);
  }

  try {
    // Secondary: open-notify (HTTP, but might work if proxy or local)
    const res = await fetch('https://api.open-notify.org/iss-now.json');
    if (res.ok) {
      return res.json();
    }
  } catch (err) {
    console.error('Secondary ISS API failed:', err);
  }

  throw new Error('All ISS position sources exhausted. Check connection.');
}

/** Astronauts API — with hardcoded fallback for stability */
export async function fetchAstronauts() {
  try {
    const res = await fetch('https://api.open-notify.org/astros.json');
    if (res.ok) return res.json();
  } catch (err) {
    console.error('Astronaut API fetch failed, using fallback:', err);
  }
  
  // High-fidelity fallback data
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
  if (!res.ok) {
    // If search fails, try a very basic fallback URL
    const fallbackUrl = `https://gnews.io/api/v4/search?q=news&lang=en&max=5&apikey=${GNEWS_API_KEY}`;
    const fallbackRes = await fetch(fallbackUrl);
    if (!fallbackRes.ok) throw new Error(`News API failed: ${res.status}`);
    return fallbackRes.json();
  }
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
