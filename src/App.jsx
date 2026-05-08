import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import AmbientBackground from './components/layout/AmbientBackground';
import ISSTracker from './components/iss/ISSTracker';
import NewsDashboard from './components/news/NewsDashboard';
import NewsDistribution from './components/charts/NewsDistribution';
import ChatbotFAB from './components/chatbot/ChatbotFAB';
import ChatWindow from './components/chatbot/ChatWindow';
import { useNews } from './hooks/useNews';
import { useChatbot, buildContext } from './hooks/useChatbot';
import { useISSTracker } from './hooks/useISSTracker';
import { useAstronauts } from './hooks/useAstronauts';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTheme } from './context/ThemeContext';
import toast from 'react-hot-toast';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { position, speed, nearestPlace, positions, speedHistory, lastSync } = useISSTracker();
  const { astronauts, loading: crewLoading } = useAstronauts();
  
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

  useKeyboardShortcuts([
    { key: 'k', meta: true, action: () => document.querySelector('input[type="text"]')?.focus() },
    { key: 'j', meta: true, action: () => setIsChatOpen(prev => !prev) },
    { key: 'd', meta: true, action: toggleTheme },
  ]);

  const handleSendMessage = (text) => {
    const context = buildContext(
      { position, speed, nearestPlace, positions, astronauts },
      currentArticles
    );
    sendMessage(text, context);
  };

  return (
    <div className="relative min-h-screen pb-20">
      <AmbientBackground />
      <Header />
      
      <main className="relative z-10 max-w-[1440px] mx-auto px-6 space-y-12 mt-8">
        {/* Section 1: ISS Live Tracker & Hero */}
        <section className="space-y-8">
          <ISSTracker />
        </section>

        {/* Section 2: News Intelligence Center */}
        <section className="pt-12 border-t border-[var(--border-subtle)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* News Feed - Main Area */}
            <div className="lg:col-span-8">
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

            {/* Sidebar Stats & Charts */}
            <div className="lg:col-span-4 space-y-8 pt-24 lg:pt-32">
              <NewsDistribution 
                categoryCounts={categoryCounts} 
                totalArticles={totalArticles} 
              />
              {/* Other sidebar widgets can go here */}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Elements */}
      <ChatbotFAB 
        onClick={() => setIsChatOpen(!isChatOpen)} 
        isOpen={isChatOpen}
        unreadCount={messages.filter(m => m.role === 'assistant' && !isChatOpen).length}
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
