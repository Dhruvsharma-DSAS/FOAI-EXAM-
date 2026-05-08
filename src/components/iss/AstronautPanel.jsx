import GlassCard from '../ui/GlassCard';
import AstronautCard from './AstronautCard';
import Skeleton from '../ui/Skeleton';
import { Users } from 'lucide-react';

export default function AstronautPanel({ astronauts, loading }) {
  return (
    <GlassCard className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="eyebrow">ACTIVE CREW</p>
          <h3 className="text-xl font-bold">
            {loading ? '...' : astronauts.number} humans in space
          </h3>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-glow)' }}>
          <Users size={20} className="text-accent-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <Skeleton width="48px" height="48px" rounded="50%" />
              <div className="flex-1">
                <Skeleton width="60%" height="14px" className="mb-2" />
                <Skeleton width="30%" height="10px" />
              </div>
            </div>
          ))
        ) : astronauts.people.length > 0 ? (
          astronauts.people.map((person, i) => (
            <AstronautCard key={person.name} name={person.name} craft={person.craft} index={i} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <p className="text-sm">No crew manifest found</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
