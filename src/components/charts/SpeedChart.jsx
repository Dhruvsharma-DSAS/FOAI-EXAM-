import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';

export default function SpeedChart({ data }) {
  const hasData = data && data.length > 0;

  return (
    <div 
      className="h-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-deep)] p-6 flex flex-col"
      style={{ minHeight: '400px' }}
    >
      <div className="mb-4">
        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Velocity Telemetry</p>
        <h3 className="text-lg font-bold text-bright">ISS Speed Trend</h3>
      </div>

      <div className="flex-1 w-full" style={{ minHeight: '280px' }}>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                domain={['dataMin - 500', 'dataMax + 500']}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={{ 
                        background: '#0a0d18', 
                        border: '1px solid rgba(99,102,241,0.2)', 
                        borderRadius: '12px',
                        padding: '10px 14px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      }}>
                        <p style={{ color: '#64748b', fontSize: '10px', fontFamily: 'monospace', marginBottom: '4px' }}>
                          {payload[0].payload.time}
                        </p>
                        <p style={{ color: '#fff', fontSize: '16px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          {payload[0].value.toLocaleString()} <span style={{ fontSize: '11px', color: '#64748b' }}>km/h</span>
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
                stroke="#EF4444"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#speedGradient)"
                animationDuration={1500}
                name="ISS Speed (km/h)"
              />
              <ReferenceLine 
                y={27580} 
                stroke="#64748b" 
                strokeDasharray="4 4" 
                label={{ position: 'right', value: 'AVG', fill: '#64748b', fontSize: 9 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 text-muted">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <p className="text-sm font-medium text-muted">Collecting telemetry data...</p>
            <p className="text-xs text-faint mt-1">Chart will appear after 2+ data points</p>
          </div>
        )}
      </div>

      {hasData && (
        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-500 rounded" />
            <span className="text-[10px] text-muted font-medium">ISS Speed (km/h)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0 border-t border-dashed border-[#64748b]" />
            <span className="text-[10px] text-muted font-medium">Avg: 27,580</span>
          </div>
        </div>
      )}
    </div>
  );
}
