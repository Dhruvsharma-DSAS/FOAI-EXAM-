import { motion } from 'framer-motion';
import NewsCard from './NewsCard';
import NewsTabs from './NewsTabs';
import NewsControls from './NewsControls';
import Skeleton from '../ui/Skeleton';
import { Shield, Radio, Search } from 'lucide-react';

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
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-accent-500 animate-pulse" />
            <span className="eyebrow text-accent-500">Live Intel Feed</span>
          </div>
          <h2 className="text-3xl font-black font-display text-bright uppercase tracking-tight">
            Global Intelligence
          </h2>
        </div>
        <NewsTabs 
          activeCategory={activeCategory} 
          onCategoryChange={onCategoryChange}
          categoryCounts={categoryCounts}
        />
      </div>

      <div className="glass-effect p-6 rounded-3xl space-y-6">
        <NewsControls 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          onRefresh={onRefresh}
          loading={loading}
        />

        {error ? (
          <div className="py-20 text-center space-y-4">
            <Shield size={48} className="mx-auto text-danger opacity-50" />
            <p className="text-muted font-medium">Encryption Link Severed: {error}</p>
            <button 
              onClick={onRefresh}
              className="px-6 py-2 rounded-xl bg-accent-500 text-white font-bold text-xs uppercase tracking-widest"
            >
              Reconnect
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[400px] rounded-3xl bg-[var(--bg-elevated)] animate-pulse" />
              ))
            ) : articles.length > 0 ? (
              articles.map((article, i) => (
                <NewsCard key={article.url + i} article={article} index={i} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center opacity-30">
                <Search size={48} className="mx-auto mb-4" />
                <p className="eyebrow">Zero Records Found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
