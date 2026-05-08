import { useState, useEffect, useCallback } from 'react';
import { fetchNews, searchNews } from '../utils/api';
import { NEWS_CATEGORIES, NEWS_CACHE_DURATION } from '../utils/constants';
import { getItem, setItem } from '../utils/storage';

export function useNews() {
  const [articles, setArticles] = useState({});
  const [activeCategory, setActiveCategory] = useState('technology');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

  const fetchCategoryNews = useCallback(async (category) => {
    if (!apiKey || apiKey === 'your_gnews_key_here') {
      setError('GNews API key not configured');
      return;
    }

    // Check cache first — use a longer cache window to avoid rate limits
    const cacheKey = `news_${category}`;
    const cached = getItem(cacheKey);
    if (cached && cached.articles && (Date.now() - cached.cachedAt) < NEWS_CACHE_DURATION) {
      setArticles((prev) => ({ ...prev, [category]: cached }));
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchNews(category, apiKey);
      const payload = { articles: data.articles || [], cachedAt: Date.now() };
      setItem(cacheKey, payload);
      setArticles((prev) => ({ ...prev, [category]: payload }));
    } catch (err) {
      // Handle rate limit specifically
      if (err.message.includes('429')) {
        setError('Rate limit reached — using cached data. Free GNews plan allows 100 requests/day.');
        // Try to use stale cache if available
        if (cached && cached.articles) {
          setArticles((prev) => ({ ...prev, [category]: cached }));
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim() || !apiKey) return;
    try {
      setLoading(true);
      setError(null);
      const data = await searchNews(query, apiKey);
      setArticles((prev) => ({ ...prev, search: { articles: data.articles || [], cachedAt: Date.now() } }));
    } catch (err) {
      if (err.message.includes('429')) {
        setError('Rate limit reached. Try again later.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const refreshCategory = useCallback((category) => {
    // Clear cache for this category then refetch
    const cacheKey = `news_${category}`;
    localStorage.removeItem(cacheKey);
    fetchCategoryNews(category);
  }, [fetchCategoryNews]);

  // Only fetch the ACTIVE category (not all 5 at once to avoid rate limits)
  useEffect(() => {
    fetchCategoryNews(activeCategory);
  }, [activeCategory, fetchCategoryNews]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => handleSearch(searchQuery), 600);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  // Get current articles based on active category and search
  const currentArticles = (() => {
    if (searchQuery.trim()) {
      return articles.search?.articles || [];
    }
    const catData = articles[activeCategory];
    if (!catData) return [];
    let result = [...(catData.articles || [])];

    if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    } else if (sortBy === 'source') {
      result.sort((a, b) => (a.source?.name || '').localeCompare(b.source?.name || ''));
    } else {
      result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }
    return result;
  })();

  const categoryCounts = NEWS_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = articles[cat.id]?.articles?.length || 0;
    return acc;
  }, {});

  const totalArticles = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return {
    articles,
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
    handleSearch,
  };
}

export default useNews;
