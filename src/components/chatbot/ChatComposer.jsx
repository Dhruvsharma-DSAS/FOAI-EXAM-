import { Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ChatComposer({ onSend, disabled }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-grow textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="p-4 border-t border-[var(--border-subtle)]">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about ISS or news..."
          rows={1}
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-accent-500 transition-all placeholder:text-faint resize-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="absolute right-2 bottom-2 w-8 h-8 rounded-lg bg-accent-500 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 cursor-pointer"
        >
          <Send size={16} />
        </button>
      </form>
      <p className="text-[10px] text-faint mt-2 text-center">
        Press <span className="font-mono">Enter</span> to send · <span className="font-mono">Shift+Enter</span> for newline
      </p>
    </div>
  );
}
