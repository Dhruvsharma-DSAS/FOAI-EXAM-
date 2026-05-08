import { motion } from 'framer-motion';
import { Zap, Cpu, FlaskConical, TrendingUp, Trophy } from 'lucide-react';
import { NEWS_CATEGORIES } from '../../utils/constants';

const icons = { Zap, Cpu, FlaskConical, TrendingUp, Trophy };

export default function NewsTabs({ activeCategory, onCategoryChange, categoryCounts }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
      {NEWS_CATEGORIES.map((cat) => {
        const Icon = icons[cat.icon];
        const isActive = activeCategory === cat.id;
        
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
            style={{ color: isActive ? 'var(--text-bright)' : 'var(--text-muted)' }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-full z-0"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={16} className="relative z-10" style={{ color: isActive ? cat.color : 'inherit' }} />
            <span className="relative z-10">{cat.label}</span>
            <span 
              className="relative z-10 text-[10px] px-1.5 py-0.5 rounded-md bg-black/20 font-mono"
              style={{ color: isActive ? 'var(--text-bright)' : 'var(--text-faint)' }}
            >
              {categoryCounts[cat.id] || 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
