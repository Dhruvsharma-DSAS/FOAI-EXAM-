import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';
import GlassCard from './GlassCard';

export default function StatTile({ 
  icon: Icon, 
  iconColor = 'var(--accent-500)', 
  eyebrow, 
  value, 
  unit, 
  sub, 
  index = 0,
  isNumeric = true 
}) {
  const displayValue = isNumeric && typeof value === 'number' ? useCountUp(value, 0) : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard className="p-6 group h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <span className="eyebrow text-[9px] text-accent-500">{eyebrow}</span>
            <div className="flex items-baseline gap-1">
              <h4 className="text-2xl font-bold font-mono text-bright tracking-tight">
                {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
              </h4>
              {unit && <span className="text-xs font-medium text-muted uppercase">{unit}</span>}
            </div>
          </div>
          <div 
            className="p-3 rounded-2xl transition-transform group-hover:scale-110 duration-500"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <Icon size={18} style={{ color: iconColor }} />
          </div>
        </div>
        
        {sub && (
          <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
            <div className="w-1 h-1 rounded-full bg-accent-500" />
            <p className="text-[10px] font-medium text-muted uppercase tracking-wider truncate">
              {sub}
            </p>
          </div>
        )}

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-8 h-8 opacity-10 pointer-events-none">
          <div className="absolute top-2 right-2 w-px h-2 bg-white" />
          <div className="absolute top-2 right-2 w-2 h-px bg-white" />
        </div>
      </GlassCard>
    </motion.div>
  );
}
