import ISSMap from './ISSMap';
import ISSStats from './ISSStats';
import SpeedChart from '../charts/SpeedChart';
import AstronautPanel from './AstronautPanel';
import { useISSTracker } from '../../hooks/useISSTracker';
import { useAstronauts } from '../../hooks/useAstronauts';
import HeroSection from '../hero/HeroSection';

export default function ISSTracker() {
  const { position, speed, nearestPlace, positions, speedHistory, lastSync } = useISSTracker();
  const { astronauts, loading: crewLoading } = useAstronauts();

  return (
    <div className="space-y-8">
      <HeroSection altitude={408} speed={speed} lastSync={lastSync} />
      
      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <ISSMap position={position} positions={positions} />
        </div>
        <div className="lg:col-span-4">
          <AstronautPanel astronauts={astronauts} loading={crewLoading} />
        </div>
      </div>

      {/* Stats Strip */}
      <ISSStats 
        speed={speed} 
        lat={position.lat} 
        lng={position.lng} 
        nearestPlace={nearestPlace} 
        dataCount={positions.length} 
      />

      {/* Speed Chart - Detailed View */}
      <div className="w-full">
        <SpeedChart data={speedHistory} />
      </div>
    </div>
  );
}
