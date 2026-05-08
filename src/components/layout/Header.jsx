import { Settings } from 'lucide-react';
import LiveBadge from '../ui/LiveBadge';
import LiveClock from './LiveClock';
import ThemeToggle from './ThemeToggle';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export default function Header() {
  const isOnline = useOnlineStatus();

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-6 h-[72px] border-b"
      style={{
        background: 'rgba(from var(--bg-void) r g b / 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Left: Logo + Wordmark */}
      <div className="flex items-center gap-3">
        {/* Orbital logo */}
        <div className="relative w-8 h-8">
          <svg viewBox="0 0 32 32" className="w-8 h-8" style={{ animation: 'orbit 20s linear infinite' }}>
            <circle cx="16" cy="16" r="3" fill="var(--accent-500)" />
            <circle cx="16" cy="16" r="10" fill="none" stroke="var(--accent-400)" strokeWidth="1" opacity="0.5" />
            <circle cx="16" cy="6" r="2" fill="var(--cyan-500)">
              <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
        <div>
          <h1
            className="text-sm font-bold tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-bright)' }}
          >
            MISSION CONTROL
          </h1>
          <p className="text-xs hidden sm:block" style={{ color: 'var(--text-faint)' }}>
            v2.0 · Real-time ISS Telemetry
          </p>
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-4">
        <LiveBadge connected={isOnline} />
        <LiveClock />
        <ThemeToggle />
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-0"
          style={{ background: 'transparent', color: 'var(--text-muted)' }}
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
