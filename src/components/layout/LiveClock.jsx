import { useState, useEffect } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="font-mono text-sm tabular-nums" style={{ color: 'var(--text-muted)' }}>
      {time.toLocaleTimeString('en-US', { hour12: false })}
    </span>
  );
}
