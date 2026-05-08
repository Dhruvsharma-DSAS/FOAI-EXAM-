export default function TypingIndicator() {
  return (
    <div className="flex items-start mb-4">
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-4 py-3 rounded-[20px] rounded-tl-none flex gap-1 items-center h-10">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-[typingBounce_1.4s_infinite_0s]" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-[typingBounce_1.4s_infinite_0.2s]" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-[typingBounce_1.4s_infinite_0.4s]" />
      </div>
    </div>
  );
}
