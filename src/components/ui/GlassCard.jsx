import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function GlassCard({ children, className, variant, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } } : undefined}
      className={clsx(
        'glass-effect relative rounded-3xl p-8 overflow-hidden',
        className
      )}
      {...props}
    >
      {/* Internal Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-br from-white/10 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
