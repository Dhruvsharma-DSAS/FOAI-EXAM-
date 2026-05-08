import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full p-1 cursor-pointer border-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]"
      style={{ background: 'var(--bg-elevated)' }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        layout
        className="w-6 h-6 rounded-full flex items-center justify-center"
        style={{
          background: isDark ? 'var(--accent-500)' : 'var(--warning)',
          boxShadow: isDark
            ? '0 0 12px var(--accent-glow)'
            : '0 0 12px rgba(245,158,11,0.4)',
          marginLeft: isDark ? 0 : 'auto',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {isDark ? <Moon size={12} color="white" /> : <Sun size={12} color="white" />}
      </motion.div>
    </button>
  );
}
