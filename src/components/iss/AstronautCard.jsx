import { motion } from 'framer-motion';

export default function AstronautCard({ name, craft, index }) {
  const initial = name.charAt(0);
  
  // Hash name to get a consistent gradient
  const getGradient = (str) => {
    const colors = [
      ['#6366F1', '#A855F7'],
      ['#EC4899', '#F43F5E'],
      ['#06B6D4', '#3B82F6'],
      ['#10B981', '#34D399']
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const [color1, color2] = getGradient(name);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="flex items-center gap-4 p-3 rounded-xl border transition-colors group"
      style={{ background: 'var(--bg-deep)', borderColor: 'var(--border-subtle)' }}
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg relative"
        style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
      >
        <span className="relative z-10">{initial}</span>
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 blur-md transition-opacity" 
          style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }} />
      </div>
      <div>
        <h4 className="text-sm font-medium text-bright">{name}</h4>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" 
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
          {craft}
        </span>
      </div>
    </motion.div>
  );
}
