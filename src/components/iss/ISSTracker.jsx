import { useState, useCallback } from 'react';
import ISSMap from './ISSMap';
import SpeedChart from '../charts/SpeedChart';
import { useISSTracker } from '../../hooks/useISSTracker';
import { useAstronauts } from '../../hooks/useAstronauts';
import { RefreshCw, Radio, RadioOff } from 'lucide-react';

export default function ISSTracker() {
  const { position, speed, nearestPlace, positions, speedHistory, lastSync, refetch } = useISSTracker();
  const { astronauts, loading: crewLoading } = useAstronauts();
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-display text-bright">ISS Live Tracking</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-[var(--border-default)] bg-[var(--bg-surface)] text-bright hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            Refresh Now
          </button>
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
              autoRefresh 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-[var(--bg-surface)] border-[var(--border-default)] text-muted'
            }`}
          >
            {autoRefresh ? <Radio size={14} /> : <RadioOff size={14} />}
            Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-deep)]">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Latitude / Longitude</p>
          <p className="text-lg font-mono font-bold text-bright">
            {position.lat?.toFixed(3) || '—'}, {position.lng?.toFixed(3) || '—'}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-deep)]">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Speed</p>
          <p className="text-lg font-mono font-bold text-bright">
            {speed ? speed.toFixed(2) : '27580.00'} <span className="text-xs text-muted">km/h</span>
          </p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-deep)]">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Nearest Place</p>
          <p className="text-sm font-medium text-bright truncate">
            {nearestPlace || 'Locating...'}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-deep)]">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Tracked Positions</p>
          <p className="text-lg font-mono font-bold text-bright">
            {positions.length}
          </p>
        </div>
      </div>

      {/* Map + Speed Chart Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ height: '480px' }}>
        <div className="lg:col-span-7 h-full">
          <ISSMap position={position} positions={positions} nearestPlace={nearestPlace} />
        </div>
        <div className="lg:col-span-5 h-full">
          <SpeedChart data={speedHistory} />
        </div>
      </div>

      {/* Astronaut Count */}
      <div className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-deep)] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Crew in Space</p>
          <p className="text-xl font-bold text-bright">
            {crewLoading ? '...' : `${astronauts.number} astronauts`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 max-w-[70%]">
          {!crewLoading && astronauts.people?.map((person, i) => (
            <span 
              key={i} 
              className="px-3 py-1 rounded-full text-[11px] font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-muted"
            >
              {person.name} <span className="text-accent-500">({person.craft})</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
