import { Globe, Command, Search, Bell } from 'lucide-react';
import LiveClock from './LiveClock';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between glass-effect border-b border-[var(--border-subtle)] rounded-b-3xl mx-auto max-w-[1440px]">
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center text-white shadow-lg shadow-accent-500/20"
        >
          <Globe size={20} />
        </motion.div>
        <div>
          <h1 className="text-sm font-black font-display text-bright leading-none uppercase tracking-widest">
            Mission Control
          </h1>
          <p className="text-[10px] font-mono text-muted mt-1 uppercase tracking-tighter">
            System v2.5.0 <span className="text-accent-500 ml-1">Terminal Active</span>
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <div className="flex items-center gap-6">
          <button className="text-[10px] font-bold text-muted hover:text-accent-500 transition-colors tracking-widest uppercase">Telemetry</button>
          <button className="text-[10px] font-bold text-muted hover:text-accent-500 transition-colors tracking-widest uppercase">Intelligence</button>
          <button className="text-[10px] font-bold text-muted hover:text-accent-500 transition-colors tracking-widest uppercase">Astronauts</button>
        </div>
        <div className="w-px h-6 bg-[var(--border-subtle)]" />
        <LiveClock />
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-muted hover:text-bright transition-colors">
          <Bell size={18} />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
