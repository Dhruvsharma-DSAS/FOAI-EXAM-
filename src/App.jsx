import { useState, useEffect } from 'react';
import AmbientBackground from './components/layout/AmbientBackground';
import ISSTracker from './components/iss/ISSTracker';
import NewsDashboard from './components/news/NewsDashboard';
import ChatbotFAB from './components/chatbot/ChatbotFAB';
import ChatWindow from './components/chatbot/ChatWindow';
import { useNews } from './hooks/useNews';
import { useChatbot, buildContext } from './hooks/useChatbot';
import { useISSTracker } from './hooks/useISSTracker';
import { useAstronauts } from './hooks/useAstronauts';
import { useTheme } from './context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { position, speed, nearestPlace, positions } = useISSTracker();
  const { astronauts } = useAstronauts();
  
  const { 
    currentArticles, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery,
    sortBy,
    setSortBy,
    loading: newsLoading,
    error: newsError,
    categoryCounts,
    totalArticles,
    refreshCategory
  } = useNews();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const { messages, isTyping, sendMessage, clearHistory } = useChatbot();

  const handleSendMessage = (text) => {
    const context = buildContext(
      { position, speed, nearestPlace, positions, astronauts },
      currentArticles
    );
    sendMessage(text, context);
  };

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      
      {/* Simple Functional Header */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between max-w-[1400px] mx-auto">
        <div>
          <p className="text-[10px] font-bold text-accent-500 uppercase tracking-[0.3em]">Mission Control Dashboard</p>
          <h1 className="text-xl font-bold font-display text-bright">Real-Time ISS and News Intelligence</h1>
        </div>
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] text-sm font-medium text-bright hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          Switch to {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 pb-20 space-y-10">
        {/* ISS Tracking Section */}
        <ISSTracker />

        {/* News Section */}
        <div className="pt-8 border-t border-[var(--border-subtle)]">
          <NewsDashboard 
            articles={currentArticles}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            loading={newsLoading}
            error={newsError}
            categoryCounts={categoryCounts}
            onRefresh={() => refreshCategory(activeCategory)}
          />
        </div>
      </main>

      {/* Chatbot */}
      <ChatbotFAB 
        onClick={() => setIsChatOpen(!isChatOpen)} 
        isOpen={isChatOpen}
        unreadCount={0}
      />
      <ChatWindow 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        onSend={handleSendMessage}
        isTyping={isTyping}
        onClear={clearHistory}
      />
    </div>
  );
}

export default App;
