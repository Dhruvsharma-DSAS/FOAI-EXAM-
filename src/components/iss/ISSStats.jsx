import { Gauge, MapPin, Mountain, Activity } from 'lucide-react';
import StatTile from '../ui/StatTile';
import { formatNumber, formatCoordDisplay } from '../../utils/formatters';

export default function ISSStats({ speed, lat, lng, nearestPlace, dataCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatTile
        index={0}
        icon={Gauge}
        iconColor="var(--danger)"
        eyebrow="ORBITAL VELOCITY"
        value={speed || 27580}
        unit="km/h"
        sub="Relative to ground"
      />
      <StatTile
        index={1}
        icon={MapPin}
        iconColor="var(--cyan-500)"
        eyebrow="GROUND TRACK"
        isNumeric={false}
        value={nearestPlace || 'Indian Ocean'}
        sub={formatCoordDisplay(lat, lng)}
      />
      <StatTile
        index={2}
        icon={Mountain}
        iconColor="var(--accent-500)"
        eyebrow="ALTITUDE"
        value={408}
        unit="km"
        sub="Standard orbit"
      />
      <StatTile
        index={3}
        icon={Activity}
        iconColor="var(--hot-500)"
        eyebrow="DATA POINTS"
        value={dataCount || 0}
        sub="Since session start"
      />
    </div>
  );
}
