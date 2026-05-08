import { useState, useEffect, useCallback } from 'react';
import { fetchNews, searchNews } from '../utils/api';
import { NEWS_CATEGORIES } from '../utils/constants';

const CACHE_KEY = 'mc_news_';
const CACHE_DURATION = 3600000; // 1 hour

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
      
      if (!data.articles) {
        throw new Error('No articles found in response');
      }

      const list = data.articles;
      setCache(category, list);
      setArticles(prev => ({ 
        ...prev, 
        [category]: { articles: list, cachedAt: Date.now() } 
      }));
    } catch (err) {
      console.error('News fetch error:', err);
      if (cached?.articles?.length) {
        setArticles(prev => ({ ...prev, [category]: cached }));
        setError(null);
      } else {
        setError(`Connection failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCategory = useCallback((cat) => {
    localStorage.removeItem(CACHE_KEY + cat);
    fetchCat(cat);
  }, [fetchCat]);

  // Initial and category change fetch
  useEffect(() => { 
    fetchCat(activeCategory); 
  }, [activeCategory, fetchCat]);

  // Debounced Search
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
      } catch (err) {
        console.error('Search error:', err);
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

  const totalArticles = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

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
    totalArticles, 
    refreshCategory 
  };
}

export default useNews;
