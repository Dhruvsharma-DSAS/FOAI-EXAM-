import { motion } from 'framer-motion';
import { ExternalLink, Clock, User, Bookmark } from 'lucide-react';
import { formatArticleDate } from '../../utils/formatters';
import GlassCard from '../ui/GlassCard';

export default function NewsCard({ article, index }) {
  const { title, description, url, image, publishedAt, source, author } = article;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <GlassCard className="p-0 overflow-hidden h-full flex flex-col" hover={false}>
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-surface)] flex items-center justify-center">
              <span className="text-muted text-xs">No preview available</span>
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)] to-transparent opacity-60" />
          
          {/* Source Badge */}
          <div className="absolute top-4 left-4 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider backdrop-blur-md border border-[var(--border-subtle)]"
            style={{ background: 'rgba(from var(--bg-deep) r g b / 0.5)', color: 'var(--text-bright)' }}>
            {source?.name?.toUpperCase()}
          </div>

          {/* Bookmark */}
          <button className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border border-[var(--border-subtle)] transition-colors hover:bg-white/10"
            style={{ background: 'rgba(from var(--bg-deep) r g b / 0.5)', color: 'var(--text-bright)' }}>
            <Bookmark size={14} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-[11px] font-mono text-muted">
            <Clock size={12} />
            <span>{formatArticleDate(publishedAt)}</span>
          </div>
          
          <h3 className="text-base font-semibold leading-snug mb-3 text-bright line-clamp-2 group-hover:text-accent-400 transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-muted line-clamp-3 mb-6 leading-relaxed flex-1">
            {description || "No description available for this article."}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 truncate max-w-[60%]">
              <div className="w-5 h-5 rounded-full bg-accent-glow flex items-center justify-center text-[10px] font-bold text-accent-500">
                {author?.charAt(0) || 'A'}
              </div>
              <span className="text-[11px] text-muted truncate">{author || 'Anonymous'}</span>
            </div>
            
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-accent-500 hover:text-accent-400 transition-colors"
            >
              Read More
              <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
