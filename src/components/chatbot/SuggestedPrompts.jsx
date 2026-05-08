import { motion } from 'framer-motion';
import { MapPin, Gauge, Users, Newspaper } from 'lucide-react';
import { SUGGESTED_PROMPTS } from '../../utils/constants';

const icons = { MapPin, Gauge, Users, Newspaper };

export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="p-4">
      <p className="eyebrow mb-3 px-1">TRY ASKING</p>
      <div className="grid grid-cols-1 gap-2">
        {SUGGESTED_PROMPTS.map((prompt, i) => {
          const Icon = icons[prompt.icon];
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(prompt.text)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-deep)] text-sm text-left hover:border-accent-500 hover:bg-[var(--bg-elevated)] transition-all group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-accent-glow text-accent-500 group-hover:scale-110 transition-transform">
                <Icon size={14} />
              </div>
              <span className="text-muted group-hover:text-bright transition-colors">{prompt.text}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
