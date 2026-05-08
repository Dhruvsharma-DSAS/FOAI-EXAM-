const GNEWS_API_KEY = '2674754d281f5d9fbdba1116453ca4de';

/** ISS position API — HTTPS compatible with fallbacks */
export async function fetchISSPosition() {
  const sources = [
    'https://api.wheretheiss.at/v1/satellites/25544',
    'https://api.open-notify.org/iss-now.json' // Note: This might be blocked on HTTPS
  ];

  for (const url of sources) {
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (res.ok) {
        const data = await res.json();
        // Normalize wheretheiss.at format to open-notify format
        if (data.latitude) {
          return {
            iss_position: {
              latitude: String(data.latitude),
              longitude: String(data.longitude),
            },
            timestamp: Math.floor(data.timestamp),
          };
        }
        return data;
      }
    } catch (err) {
      console.warn(`ISS Source ${url} failed:`, err);
    }
  }
  throw new Error('All telemetry sources unavailable');
}

/** Astronauts API — with hardcoded fallback for stability */
export async function fetchAstronauts() {
  try {
    const res = await fetch('https://api.open-notify.org/astros.json', { mode: 'cors' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Astronaut API failed, using manifest fallback');
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
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { 
        mode: 'cors',
        headers: { 'User-Agent': 'MissionControlDashboard/1.0' } 
      }
    );
    if (!res.ok) return 'Over open ocean';
    const data = await res.json();
    return data?.address?.country || data?.display_name || 'Over open ocean';
  } catch {
    return 'Over ocean / remote area';
  }
}

const CATEGORY_QUERIES = {
  'breaking-news': 'world events',
  'technology': 'technology',
  'science': 'science',
  'business': 'business',
  'sports': 'sports',
};

/** GNews API — uses SEARCH endpoint (works on free plan) */
export async function fetchNews(category) {
  const query = CATEGORY_QUERIES[category] || category;
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${GNEWS_API_KEY}`;
  
  const res = await fetch(url, { 
    mode: 'cors',
    headers: { 'Accept': 'application/json' }
  });
  
  if (!res.ok) throw new Error(`GNews status: ${res.status}`);
  const data = await res.json();
  
  if (!data.articles) throw new Error('No articles in response');
  return data;
}

/** GNews search API */
export async function searchNews(query) {
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${GNEWS_API_KEY}`;
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error('Search failed');
  return await res.json();
}
