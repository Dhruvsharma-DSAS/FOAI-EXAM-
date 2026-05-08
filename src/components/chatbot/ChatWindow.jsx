import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Sparkles } from 'lucide-react';
import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestedPrompts from './SuggestedPrompts';
import ChatComposer from './ChatComposer';

export default function ChatWindow({ isOpen, onClose, messages, onSend, isTyping, onClear }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-120px)] flex flex-col rounded-[24px] border border-[var(--border-default)] bg-[var(--bg-deep)] shadow-2xl z-[100] overflow-hidden backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[rgba(from var(--bg-surface) r g b / 0.5)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-500 to-hot-500 flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-bright leading-none">Mission AI</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] text-muted font-medium uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={onClear} className="p-2 text-muted hover:text-danger transition-colors cursor-pointer" title="Clear history">
                <Trash2 size={16} />
              </button>
              <button onClick={onClose} className="p-2 text-muted hover:text-bright transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {messages.length === 0 && !isTyping ? (
              <SuggestedPrompts onSelect={onSend} />
            ) : (
              <>
                {messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
              </>
            )}
          </div>

          {/* Composer */}
          <ChatComposer onSend={onSend} disabled={isTyping} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
