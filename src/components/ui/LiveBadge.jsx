export default function LiveBadge({ connected = true }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
      style={{ background: connected ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
      <div className="relative w-2 h-2">
        <div className="absolute inset-0 rounded-full" style={{ background: connected ? 'var(--success)' : 'var(--danger)' }} />
        <div className="absolute inset-0 rounded-full" style={{
          background: connected ? 'var(--success)' : 'var(--danger)',
          animation: 'liveDot 1.4s ease-out infinite',
        }} />
        <div className="absolute inset-0 rounded-full" style={{
          background: connected ? 'var(--success)' : 'var(--danger)',
          animation: 'liveDot 1.4s ease-out infinite 0.7s',
        }} />
      </div>
      <span style={{ color: connected ? 'var(--success)' : 'var(--danger)' }}>
        {connected ? 'LIVE' : 'OFFLINE'}
      </span>
    </div>
  );
}
