import { clsx } from 'clsx';

export default function GlassCard({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        'glass-effect relative rounded-2xl p-6 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
