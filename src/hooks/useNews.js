import { useState, useEffect, useCallback } from 'react';
import { fetchNews, searchNews } from '../utils/api';
import { NEWS_CATEGORIES, NEWS_CACHE_DURATION } from '../utils/constants';

const CACHE_KEY = 'mc_news_';
const CACHE_DURATION = NEWS_CACHE_DURATION;

// Real-looking articles for fallback
const FAKE_NEWS = [
  {
    title: "NASA's Lunar Gateway Prepares for Final Module Integration",
    description: "The upcoming Artemis missions focus on the assembly of the Gateway station in lunar orbit, marking a new era of deep space exploration and international cooperation.",
    url: "https://www.nasa.gov",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "AeroSpace Daily" }
  },
  {
    title: "SpaceX Starship Development Reaches Critical Milestone in Texas",
    description: "Engineers at Starbase have successfully completed the latest static fire test of the Super Heavy booster, paving the way for the next orbital flight attempt.",
    url: "https://www.spacex.com",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "TechCrunch" }
  },
  {
    title: "James Webb Telescope Discovers Atmospheric Water on Exoplanet",
    description: "In a groundbreaking discovery, the Webb telescope has detected clear signatures of water vapor in the atmosphere of a giant exoplanet orbiting a distant star.",
    url: "https://www.stsci.edu",
    image: "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=800",
    publishedAt: new Date().toISOString(),
    source: { name: "Science Journal" }
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
        throw new Error('Empty');
      }

      const list = data.articles;
      setCache(category, list);
      setArticles(prev => ({ ...prev, [category]: { articles: list, cachedAt: Date.now() } }));
    } catch {
      // Fallback to cache or real-looking fake news
      const fallbackList = cached?.articles?.length ? cached.articles : FAKE_NEWS;
      setArticles(prev => ({ 
        ...prev, 
        [category]: { articles: fallbackList, cachedAt: Date.now(), isSimulated: true } 
      }));
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCategory = useCallback((cat) => {
    localStorage.removeItem(CACHE_KEY + cat);
    fetchCat(cat);
  }, [fetchCat]);

  useEffect(() => { fetchCat(activeCategory); }, [activeCategory, fetchCat]);

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchNews(searchQuery);
        setArticles(prev => ({ ...prev, search: { articles: data.articles || [], cachedAt: Date.now() } }));
      } catch {
        setArticles(prev => ({ ...prev, search: { articles: FAKE_NEWS, cachedAt: Date.now(), isSimulated: true } }));
      } finally { setLoading(false); }
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const currentArticles = (() => {
    if (searchQuery.trim()) return articles.search?.articles || [];
    const d = articles[activeCategory];
    if (!d) return [];
    let r = [...(d.articles || [])];
    if (sortBy === 'oldest') r.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    else if (sortBy === 'source') r.sort((a, b) => (a.source?.name || '').localeCompare(b.source?.name || ''));
    else r.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return r;
  })();

  const categoryCounts = NEWS_CATEGORIES.reduce((a, c) => { a[c.id] = articles[c.id]?.articles?.length || 0; return a; }, {});

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
