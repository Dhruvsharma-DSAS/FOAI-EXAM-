import ISSMap from './ISSMap';
import ISSStats from './ISSStats';
import SpeedChart from '../charts/SpeedChart';
import AstronautPanel from './AstronautPanel';
import { useISSTracker } from '../../hooks/useISSTracker';
import { useAstronauts } from '../../hooks/useAstronauts';
import HeroSection from '../hero/HeroSection';

export default function ISSTracker() {
  const { position, speed, nearestPlace, positions, speedHistory, lastSync, error } = useISSTracker();
  const { astronauts, loading: crewLoading } = useAstronauts();

  return (
    <>
      <HeroSection altitude={408} speed={speed} lastSync={lastSync} />
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        <div className="xl:col-span-8">
          <ISSMap position={position} positions={positions} />
        </div>
        <div className="xl:col-span-4">
          <SpeedChart data={speedHistory} />
        </div>
      </div>

      <div className="mb-6">
        <ISSStats 
          speed={speed} 
          lat={position.lat} 
          lng={position.lng} 
          nearestPlace={nearestPlace} 
          dataCount={positions.length} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-12">
        <div className="xl:col-span-5">
          <AstronautPanel astronauts={astronauts} loading={crewLoading} />
        </div>
        <div className="xl:col-span-7 h-full">
          {/* Pie chart placeholder or other content */}
          <div id="distribution-placeholder" className="h-full"></div>
        </div>
      </div>
    </>
  );
}
