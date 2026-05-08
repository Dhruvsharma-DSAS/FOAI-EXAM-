import { memo } from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

const StatTile = memo(function StatTile({ icon: Icon, iconColor, eyebrow, value, unit, sub, index = 0, isNumeric = true }) {
  const displayValue = useCountUp(isNumeric ? value : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-2xl p-5 border overflow-hidden"
      style={{
        background: 'var(--bg-deep)',
        borderColor: 'var(--border-subtle)',
        boxShadow: '0 8px 32px -8px rgba(0,0,0,var(--shadow-strength))',
      }}
    >
      {/* Subtle radial gradient */}
      <div
        className="absolute top-0 left-0 w-32 h-32 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top left, ${iconColor}33, transparent)`,
        }}
      />
      <div className="relative z-10">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{ background: `${iconColor}15` }}
        >
          {Icon && <Icon size={20} style={{ color: iconColor }} />}
        </div>

        {/* Eyebrow */}
        <p className="eyebrow mb-1">{eyebrow}</p>

        {/* Value */}
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-mono font-medium"
            style={{ fontSize: '2rem', color: 'var(--text-bright)', letterSpacing: '-0.02em' }}
          >
            {isNumeric ? displayValue.toLocaleString() : value}
          </span>
          {unit && (
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {unit}
            </span>
          )}
        </div>

        {/* Sub text */}
        {sub && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
});

export default StatTile;
