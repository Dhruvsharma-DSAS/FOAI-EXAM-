import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '../ui/GlassCard';
import { CATEGORY_COLORS, NEWS_CATEGORIES } from '../../utils/constants';

export default function NewsDistribution({ categoryCounts, totalArticles }) {
  const data = NEWS_CATEGORIES.map(cat => ({
    name: cat.label,
    value: categoryCounts[cat.id] || 0,
    color: CATEGORY_COLORS[cat.id]
  })).filter(d => d.value > 0);

  return (
    <GlassCard className="h-full flex flex-col">
      <div className="mb-6">
        <p className="eyebrow">INTELLIGENCE OVERVIEW</p>
        <h3 className="text-xl font-bold">News Distribution</h3>
      </div>
      
      <div className="flex-1 relative min-h-[250px]">
        {/* Center text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <span className="font-mono text-3xl font-bold text-bright leading-none">
            {totalArticles}
          </span>
          <span className="text-[10px] eyebrow mt-1">TOTAL ARTICLES</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius="65%"
              outerRadius="90%"
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="px-4 py-3 rounded-xl border shadow-2xl"
                      style={{ background: 'var(--bg-deep)', borderColor: 'var(--border-default)', backdropFilter: 'blur(12px)' }}>
                      <p className="text-sm font-medium mb-1" style={{ color: payload[0].payload.color }}>
                        {payload[0].name}
                      </p>
                      <p className="text-lg font-mono font-bold" style={{ color: 'var(--text-bright)' }}>
                        {payload[0].value} <span className="text-xs font-normal text-muted">articles</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
            <span className="text-xs text-muted truncate">{item.name}</span>
            <span className="text-xs font-mono font-medium ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
