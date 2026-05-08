import { motion } from 'framer-motion';
import LiveBadge from '../ui/LiveBadge';
import { useCountUp } from '../../hooks/useCountUp';

export default function HeroSection({ altitude, speed, lastSync }) {
  const displayAltitude = useCountUp(altitude || 408, 2);
  const displaySpeed = useCountUp(speed || 27580);

  return (
    <div className="relative pt-12 pb-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center space-y-4"
      >
        <LiveBadge />
        
        <div className="space-y-2">
          <h2 className="eyebrow tracking-[0.3em] text-accent-500">ORBITAL POSITIONING SYSTEM</h2>
          <h1 className="text-4xl md:text-6xl font-black font-display text-bright tracking-tight">
            ISS Mission Control
          </h1>
        </div>

        <p className="text-muted max-w-2xl text-sm md:text-base leading-relaxed">
          Monitoring the International Space Station's real-time trajectory, 
          orbital velocity telemetry, and global scientific intelligence feed.
        </p>

        <div className="flex flex-wrap justify-center gap-12 pt-8">
          <div className="text-center">
            <p className="eyebrow mb-1">ALTITUDE</p>
            <p className="text-3xl font-mono font-bold text-bright">
              {displayAltitude}<span className="text-sm font-normal text-muted ml-1">KM</span>
            </p>
          </div>
          <div className="w-px h-12 bg-[var(--border-subtle)] hidden md:block" />
          <div className="text-center">
            <p className="eyebrow mb-1">VELOCITY</p>
            <p className="text-3xl font-mono font-bold text-bright">
              {displaySpeed.toLocaleString()}<span className="text-sm font-normal text-muted ml-1">KM/H</span>
            </p>
          </div>
          <div className="w-px h-12 bg-[var(--border-subtle)] hidden md:block" />
          <div className="text-center">
            <p className="eyebrow mb-1">STATUS</p>
            <p className="text-sm font-bold text-success mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              NOMINAL ORBIT
            </p>
          </div>
        </div>
      </motion.div>

      {/* Decorative HUD Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-accent-500/20 rounded-tl-3xl -z-10" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-accent-500/20 rounded-tr-3xl -z-10" />
    </div>
  );
}
