export default function Skeleton({ className, width, height, rounded = '8px' }) {
  return (
    <div
      className={className}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius: rounded,
        background: 'linear-gradient(90deg, var(--bg-surface) 0%, var(--bg-elevated) 50%, var(--bg-surface) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s ease-in-out infinite',
      }}
    />
  );
}
