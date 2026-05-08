import { Search, ChevronDown, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SORT_OPTIONS } from '../../utils/constants';

export default function NewsControls({ searchQuery, onSearchChange, sortBy, onSortChange, onRefresh, loading }) {
  const [isSortOpen, setIsSortOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      {/* Search Input */}
      <div className="relative w-full md:w-auto">
        <motion.div
          animate={{ width: searchQuery ? '100%' : '240px' }}
          className="relative group md:min-w-[240px]"
        >
          <Search 
            size={18} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent-500 transition-colors" 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search news intelligence..."
            className="w-full bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-500 transition-all placeholder:text-faint"
          />
        </motion.div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Sort Dropdown */}
        <div className="relative flex-1 md:flex-none">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full md:w-48 flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-deep)] text-sm font-medium transition-colors hover:border-[var(--border-default)] cursor-pointer"
          >
            <span className="text-muted">Sort:</span>
            <span className="text-bright">{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
            <ChevronDown size={16} className={`text-muted transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-[var(--border-default)] bg-[var(--bg-deep)] shadow-2xl z-50 py-1 overflow-hidden backdrop-blur-xl"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onSortChange(opt.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-elevated)] ${sortBy === opt.value ? 'text-accent-500 font-semibold' : 'text-muted'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-deep)] text-muted transition-all hover:bg-[var(--bg-elevated)] hover:text-bright disabled:opacity-50 cursor-pointer"
        >
          <RotateCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  );
}
