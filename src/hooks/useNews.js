import { useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../utils/api';
import { NEWS_CATEGORIES } from '../utils/constants';

const CACHE_KEY_PREFIX = 'mc_news_';
const CACHE_DURATION = 3600000; // 1 hour cache — saves API calls on free tier

function getCached(category) {
  try {
    const raw = localStorage.getItem(CACHE_KEY_PREFIX + category);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.cachedAt < CACHE_DURATION) return data;
    return data; // return stale cache as fallback
  } catch { return null; }
}

function setCache(category, articles) {
  try {
    localStorage.setItem(CACHE_KEY_PREFIX + category, JSON.stringify({ articles, cachedAt: Date.now() }));
  } catch {}
}

export function useNews() {
  const [articles, setArticles] = useState({});
  const [activeCategory, setActiveCategory] = useState('technology');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

  const fetchCategoryNews = useCallback(async (category) => {
    if (!apiKey) {
      setError('API key not set');
      return;
    }

    // Always try cache first
    const cached = getCached(category);
    const isFresh = cached && (Date.now() - cached.cachedAt < CACHE_DURATION);
    
    if (isFresh) {
      // Cache is fresh, use it directly — no API call needed
      setArticles(prev => ({ ...prev, [category]: cached }));
      setError(null);
      return;
    }

    // Cache is stale or missing — try API
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNews(category, apiKey);
      const list = data.articles || [];
      setCache(category, list);
      setArticles(prev => ({ ...prev, [category]: { articles: list, cachedAt: Date.now() } }));
    } catch (err) {
      // On ANY error (429, network, etc.) — fall back to stale cache silently
      if (cached && cached.articles && cached.articles.length > 0) {
        setArticles(prev => ({ ...prev, [category]: cached }));
        setError(null); // Don't show error if we have cached data
      } else {
        setError('Unable to load news. Will retry on next refresh.');
      }
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const refreshCategory = useCallback((category) => {
    // Force clear cache and refetch
    localStorage.removeItem(CACHE_KEY_PREFIX + category);
    fetchCategoryNews(category);
  }, [fetchCategoryNews]);

  // Fetch ONLY the active category (saves API calls)
  useEffect(() => {
    fetchCategoryNews(activeCategory);
  }, [activeCategory, fetchCategoryNews]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || !apiKey) return;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&max=10&apikey=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setArticles(prev => ({ ...prev, search: { articles: data.articles || [], cachedAt: Date.now() } }));
      } catch {
        // Silently fail search — don't break the UI
      } finally {
        setLoading(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, apiKey]);

  // Current articles to display
  const currentArticles = (() => {
    if (searchQuery.trim()) return articles.search?.articles || [];
    const catData = articles[activeCategory];
    if (!catData) return [];
    let result = [...(catData.articles || [])];
    if (sortBy === 'oldest') result.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    else if (sortBy === 'source') result.sort((a, b) => (a.source?.name || '').localeCompare(b.source?.name || ''));
    else result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return result;
  })();

  const categoryCounts = NEWS_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = articles[cat.id]?.articles?.length || 0;
    return acc;
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
    refreshCategory,
  };
}

export default useNews;
