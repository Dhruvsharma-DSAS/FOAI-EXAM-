import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

export default function ChatbotFAB({ onClick, isOpen, unreadCount }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white z-[101] shadow-2xl cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #06B6D4 100%)',
        boxShadow: '0 8px 32px var(--accent-glow)',
      }}
    >
      {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      
      {unreadCount > 0 && !isOpen && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
          {unreadCount}
        </span>
      )}
    </motion.button>
  );
}
