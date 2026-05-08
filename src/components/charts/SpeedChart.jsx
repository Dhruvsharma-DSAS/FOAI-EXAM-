import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid, Legend } from 'recharts';

export default function SpeedChart({ data }) {
  const hasData = data && data.length > 0;

  return (
    <div 
      className="h-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-deep)] p-5 flex flex-col"
      style={{ minHeight: '400px' }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-bright">ISS Speed Trend</h3>
      </div>

      <div className="flex-1 w-full" style={{ minHeight: '300px' }}>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                domain={['dataMin - 200', 'dataMax + 200']}
                tickFormatter={(v) => v.toLocaleString()}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={{ 
                        background: '#0a0d18', 
                        border: '1px solid rgba(99,102,241,0.2)', 
                        borderRadius: '8px',
                        padding: '8px 12px',
                      }}>
                        <p style={{ color: '#64748b', fontSize: '10px', fontFamily: 'monospace' }}>
                          {payload[0].payload.time}
                        </p>
                        <p style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          {payload[0].value.toLocaleString()} km/h
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', color: '#64748b' }}
              />
              <Line
                type="monotone"
                dataKey="speed"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#EF4444' }}
                name="ISS Speed (km/h)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 text-muted">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <p className="text-sm font-medium text-muted">Collecting telemetry data...</p>
            <p className="text-xs text-faint mt-1">Chart appears after 2+ data points (~30 sec)</p>
          </div>
        )}
      </div>
    </div>
  );
}
