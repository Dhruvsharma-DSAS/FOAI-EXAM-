import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function GlassCard({ children, className, variant, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={clsx(
        'relative rounded-[20px] p-6',
        'border transition-colors duration-200',
        variant === 'live' && 'glass-card-live',
        className
      )}
      style={{
        background: 'var(--bg-deep)',
        borderColor: 'var(--border-subtle)',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.05) inset, 0 0 0 1px rgba(99,102,241,0.04), 0 24px 48px -12px rgba(0,0,0,var(--shadow-strength))',
      }}
      {...props}
    >
      {variant === 'live' && (
        <div
          className="absolute inset-0 rounded-[20px] -z-10 opacity-50"
          style={{
            background: 'conic-gradient(from 0deg, var(--accent-500), var(--hot-500), var(--cyan-500), var(--accent-500))',
            filter: 'blur(2px)',
            animation: 'auroraRotate 4s linear infinite',
            margin: '-1px',
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
