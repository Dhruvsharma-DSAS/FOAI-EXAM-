import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchNews, searchNews } from '../utils/api';
import { NEWS_CATEGORIES, NEWS_CACHE_DURATION } from '../utils/constants';
import { getItem, setItem } from '../utils/storage';

export function useNews() {
  const [articles, setArticles] = useState({});
  const [activeCategory, setActiveCategory] = useState('breaking-news');
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
    const cacheKey = `news:${category}:${Math.floor(Date.now() / NEWS_CACHE_DURATION)}`;
    const cached = getItem(cacheKey);
    if (cached && cached.articles) {
      setArticles((prev) => ({ ...prev, [category]: { articles: cached.articles, cachedAt: cached.cachedAt } }));
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
      setError(err.message);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const refreshCategory = useCallback((category) => {
    fetchCategoryNews(category);
  }, [fetchCategoryNews]);

  // Fetch initial categories
  useEffect(() => {
    NEWS_CATEGORIES.forEach((cat) => fetchCategoryNews(cat.id));
  }, [fetchCategoryNews]);

  // Get current articles based on active category and search
  const currentArticles = (() => {
    if (searchQuery.trim()) {
      const searchResults = articles.search?.articles || [];
      return searchResults;
    }
    const catData = articles[activeCategory];
    if (!catData) return [];
    let result = [...(catData.articles || [])];

    // Sort
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
