import { motion } from 'framer-motion';
import NewsCard from './NewsCard';
import NewsTabs from './NewsTabs';
import NewsControls from './NewsControls';
import Skeleton from '../ui/Skeleton';
import { AlertCircle, Inbox } from 'lucide-react';

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
    <section className="mt-12 mb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="eyebrow mb-2">WORLDWIDE INTELLIGENCE</p>
          <h2 className="text-3xl font-bold font-display text-bright">Global News Feed</h2>
        </div>
        <NewsTabs 
          activeCategory={activeCategory} 
          onCategoryChange={onCategoryChange}
          categoryCounts={categoryCounts}
        />
      </div>

      <NewsControls 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        onRefresh={onRefresh}
        loading={loading}
      />

      {error ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-danger-glow bg-[rgba(239,68,68,0.05)]">
          <AlertCircle size={48} className="text-danger mb-4" />
          <h3 className="text-xl font-bold text-bright mb-2">Intelligence Sync Failed</h3>
          <p className="text-muted text-center max-w-md px-6 mb-6">{error}</p>
          <button 
            onClick={onRefresh}
            className="px-6 py-2 rounded-xl bg-danger text-white font-medium transition-transform hover:scale-105"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-deep)] overflow-hidden">
                <Skeleton height="192px" rounded="0" />
                <div className="p-6">
                  <Skeleton width="40%" height="12px" className="mb-4" />
                  <Skeleton width="90%" height="20px" className="mb-2" />
                  <Skeleton width="80%" height="20px" className="mb-6" />
                  <div className="flex justify-between">
                    <Skeleton width="30%" height="16px" />
                    <Skeleton width="20%" height="16px" />
                  </div>
                </div>
              </div>
            ))
          ) : articles.length > 0 ? (
            articles.map((article, i) => (
              <NewsCard key={article.url + i} article={article} index={i} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 opacity-50">
              <Inbox size={64} className="mb-4" />
              <h3 className="text-xl font-bold mb-2">No Articles Found</h3>
              <p className="text-sm">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
