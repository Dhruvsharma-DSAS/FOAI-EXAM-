import { useState, useEffect, useCallback } from 'react';
import { fetchNews, searchNews } from '../utils/api';
import { NEWS_CATEGORIES } from '../utils/constants';

const CACHE_KEY = 'mc_news_';
const CACHE_DURATION = 3600000; // 1 hour

// High-quality fake data for offline/simulation mode
const FAKE_NEWS = [
  {
    title: "Mission Control: System Stability Confirmed",
    description: "Deep space telemetry links are operating within normal parameters. Real-time intelligence feed is standing by for high-priority updates.",
    url: "#",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "System Intel" }
  },
  {
    title: "Orbital Mechanics Update: Path Vectoring Active",
    description: "New trajectory models suggest optimal viewing windows for the current orbital cycle. Crew operations proceed as scheduled.",
    url: "#",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "Cosmic News" }
  },
  {
    title: "Intelligence Feed: Scanning for Signal",
    description: "Broad-spectrum analysis currently underway. Local intelligence buffers are active while external data links synchronize.",
    url: "#",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "Mission Intel" }
  }
];

function getCached(cat) {
  try {
    const raw = localStorage.getItem(CACHE_KEY + cat);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function setCache(cat, articles) {
  try { 
    localStorage.setItem(CACHE_KEY + cat, JSON.stringify({ articles, cachedAt: Date.now() })); 
  } catch {}
}

export function useNews() {
  const [articles, setArticles] = useState({});
  const [activeCategory, setActiveCategory] = useState('technology');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCat = useCallback(async (category) => {
    const cached = getCached(category);
    const now = Date.now();
    const isFresh = cached && (now - cached.cachedAt < CACHE_DURATION);
    
    if (isFresh) {
      setArticles(prev => ({ ...prev, [category]: cached }));
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchNews(category);
      
      if (!data.articles || data.articles.length === 0) {
        throw new Error('Empty news feed');
      }

      const list = data.articles;
      setCache(category, list);
      setArticles(prev => ({ ...prev, [category]: { articles: list, cachedAt: Date.now() } }));
    } catch (err) {
      console.warn(`Real news feed failed for ${category}. Showing simulated intel.`);
      // Fallback to cache if possible, otherwise use FAKE_NEWS
      const fallbackList = cached?.articles?.length ? cached.articles : FAKE_NEWS;
      setArticles(prev => ({ 
        ...prev, 
        [category]: { articles: fallbackList, cachedAt: Date.now(), isSimulated: true } 
      }));
      // We don't set error here anymore because we are showing simulated data
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCategory = useCallback((cat) => {
    localStorage.removeItem(CACHE_KEY + cat);
    fetchCat(cat);
  }, [fetchCat]);

  useEffect(() => { 
    fetchCat(activeCategory); 
  }, [activeCategory, fetchCat]);

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchNews(searchQuery);
        setArticles(prev => ({ 
          ...prev, 
          search: { articles: data.articles || [], cachedAt: Date.now() } 
        }));
      } catch {
        setArticles(prev => ({ 
          ...prev, 
          search: { articles: FAKE_NEWS, cachedAt: Date.now(), isSimulated: true } 
        }));
      } finally {
        setLoading(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const currentArticles = (() => {
    if (searchQuery.trim()) return articles.search?.articles || [];
    const d = articles[activeCategory];
    if (!d) return [];
    let r = [...(d.articles || [])];
    
    if (sortBy === 'oldest') {
      r.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    } else if (sortBy === 'source') {
      r.sort((a, b) => (a.source?.name || '').localeCompare(b.source?.name || ''));
    } else {
      r.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }
    return r;
  })();

  const categoryCounts = NEWS_CATEGORIES.reduce((a, c) => { 
    a[c.id] = articles[c.id]?.articles?.length || 0; 
    return a; 
  }, {});

  return { 
    currentArticles, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery, 
    sortBy, 
    setSortBy, 
    loading, 
    error, 
    categoryCounts, 
    totalArticles: Object.values(categoryCounts).reduce((a, b) => a + b, 0), 
    refreshCategory 
  };
}

export default useNews;
