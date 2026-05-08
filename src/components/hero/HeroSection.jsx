import { motion } from 'framer-motion';
import { formatNumber, formatRelativeTime } from '../../utils/formatters';

export default function HeroSection({ altitude, speed, lastSync }) {
  return (
    <section className="relative py-16 md:py-20 text-center overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="relative w-2 h-2">
            <div className="absolute inset-0 rounded-full" style={{ background: 'var(--success)' }} />
            <div className="absolute inset-0 rounded-full" style={{
              background: 'var(--success)',
              animation: 'liveDot 1.4s ease-out infinite',
            }} />
          </div>
          <span className="eyebrow" style={{ color: 'var(--success)' }}>TRACKING NOW</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl md:text-2xl mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-muted)', fontWeight: 500 }}
        >
          The International Space Station is currently
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <span
            className="font-mono font-bold"
            style={{
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              color: 'var(--text-bright)',
              letterSpacing: '-0.02em',
            }}
          >
            {formatNumber(altitude || 408)}
          </span>
          <span className="text-xl md:text-2xl ml-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
            km above Earth
          </span>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm md:text-base"
          style={{ color: 'var(--text-muted)' }}
        >
          Orbiting at {formatNumber(speed || 27580)} km/h · Last sync {lastSync ? formatRelativeTime(lastSync) : '—'}
        </motion.p>

        {/* Aurora accent line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-8 h-px w-16"
          style={{ background: 'linear-gradient(90deg, var(--accent-500), var(--hot-500), var(--cyan-500))' }}
        />
      </div>
    </section>
  );
}
