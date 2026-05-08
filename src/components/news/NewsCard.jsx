import { motion } from 'framer-motion';
import { ExternalLink, Clock, Bookmark, Share2 } from 'lucide-react';
import { formatArticleDate } from '../../utils/formatters';
import GlassCard from '../ui/GlassCard';

export default function NewsCard({ article, index }) {
  const { title, description, url, image, publishedAt, source } = article;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="h-full"
    >
      <GlassCard className="p-0 h-full flex flex-col group cursor-default">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-white">
              {source?.name?.toUpperCase()}
            </span>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-accent-500 transition-colors">
              <Bookmark size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-[10px] font-mono text-muted uppercase tracking-wider">
            <Clock size={12} />
            <span>{formatArticleDate(publishedAt)}</span>
          </div>

          <h3 className="text-lg font-bold leading-tight mb-3 text-bright group-hover:text-accent-500 transition-colors line-clamp-2 font-display">
            {title}
          </h3>

          <p className="text-sm text-muted line-clamp-3 mb-6 leading-relaxed flex-1">
            {description}
          </p>

          <div className="mt-auto pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-accent-500 hover:gap-3 transition-all"
            >
              READ FULL INTEL
              <ExternalLink size={14} />
            </a>
            <button className="text-muted hover:text-bright transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
