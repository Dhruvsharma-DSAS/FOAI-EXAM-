import { useState } from 'react';
import { motion } from 'framer-motion';
import NewsCard from './NewsCard';
import Skeleton from '../ui/Skeleton';
import { Search, RefreshCw, ChevronDown, AlertCircle, Inbox } from 'lucide-react';
import { NEWS_CATEGORIES, SORT_OPTIONS } from '../../utils/constants';

export default function NewsDashboard({ 
  articles, 
  activeCategory, 
  onCategoryChange, 
  searchQuery, 
  onSearchChange,
  sortBy,
  onSortChange,
  loading,
  error,
  categoryCounts,
  onRefresh
}) {
  const activeCat = NEWS_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold font-display text-bright">
          {activeCat?.label || 'Breaking'} News
        </h2>
        <div className="flex items-center gap-2">
          {/* Category Tabs */}
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                activeCategory === cat.id 
                  ? 'bg-accent-500/10 border-accent-500/30 text-accent-500' 
                  : 'border-[var(--border-subtle)] text-muted hover:text-bright hover:border-[var(--border-default)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-[var(--border-default)] bg-[var(--bg-surface)] text-bright hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search title, source, author..."
            className="w-full bg-[var(--bg-deep)] border border-[var(--border-default)] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-500 transition-colors placeholder:text-faint"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted font-medium whitespace-nowrap">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[var(--bg-deep)] border border-[var(--border-default)] rounded-xl px-3 py-2.5 text-sm text-bright focus:outline-none focus:border-accent-500 cursor-pointer"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      {error ? (
        <div className="py-16 text-center rounded-2xl border border-red-500/20 bg-red-500/5">
          <AlertCircle size={40} className="mx-auto mb-3 text-red-400" />
          <p className="text-sm text-muted mb-4">{error}</p>
          <button 
            onClick={onRefresh}
            className="px-5 py-2 rounded-xl bg-accent-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[360px] rounded-2xl bg-[var(--bg-elevated)] animate-pulse" />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <NewsCard key={article.url + i} article={article} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center opacity-40">
          <Inbox size={48} className="mx-auto mb-3" />
          <p className="text-sm">No articles found</p>
        </div>
      )}
    </div>
  );
}
