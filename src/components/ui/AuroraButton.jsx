import { motion } from 'framer-motion';

export default function AuroraButton({ children, onClick, className, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl px-6 py-3 font-medium text-white cursor-pointer ${className || ''}`}
      style={{
        background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #06B6D4 100%)',
        boxShadow: '0 8px 24px var(--accent-glow)',
      }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
