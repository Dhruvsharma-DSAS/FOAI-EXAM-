import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import GlassCard from '../ui/GlassCard';

export default function SpeedChart({ data }) {
  return (
    <GlassCard className="h-[480px] flex flex-col">
      <div className="mb-6">
        <p className="eyebrow">VELOCITY TELEMETRY</p>
        <h3 className="text-xl font-bold">Orbital Speed Trend</h3>
      </div>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-500)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-500)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            />
            <YAxis
              hide
              domain={['auto', 'auto']}
              padding={{ top: 20, bottom: 20 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="px-4 py-3 rounded-xl border shadow-2xl"
                      style={{ background: 'var(--bg-deep)', borderColor: 'var(--border-default)', backdropFilter: 'blur(12px)' }}>
                      <p className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>{payload[0].payload.time}</p>
                      <p className="text-lg font-mono font-bold" style={{ color: 'var(--text-bright)' }}>
                        {payload[0].value.toLocaleString()} <span className="text-xs font-normal text-muted">km/h</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="speed"
              stroke="var(--accent-500)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#speedGradient)"
              animationDuration={1500}
            />
            <ReferenceLine y={27580} stroke="var(--text-muted)" strokeDasharray="3 3" label={{ position: 'top', value: 'AVG', fill: 'var(--text-muted)', fontSize: 10 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
