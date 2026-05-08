import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { formatTime } from '../../utils/formatters';

export default function MessageBubble({ message }) {
  const { role, content, timestamp, isError } = message;
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}
    >
      <div
        className={`max-w-[85%] px-4 py-3 rounded-[20px] text-sm leading-relaxed shadow-lg ${
          isUser
            ? 'bg-accent-500 text-white rounded-tr-none'
            : isError 
              ? 'bg-danger-glow border border-danger text-bright rounded-tl-none'
              : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-bright rounded-tl-none'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
      <span className="text-[10px] text-muted mt-1 px-1 font-mono">
        {formatTime(timestamp)}
      </span>
    </motion.div>
  );
}
