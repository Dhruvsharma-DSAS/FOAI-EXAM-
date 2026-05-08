import { useState, useEffect, useMemo } from 'react';
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
  
  // ISS State (for chatbot context)
  const { position, speed, nearestPlace, positions } = useISSTracker();
  const { astronauts } = useAstronauts();
  
  // News State
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

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { messages, isTyping, sendMessage, clearHistory } = useChatbot();

  // Keyboard Shortcuts
  useKeyboardShortcuts([
    { key: 'k', meta: true, action: () => document.querySelector('input[type="text"]')?.focus() },
    { key: 'j', meta: true, action: () => setIsChatOpen(prev => !prev) },
    { key: 'd', meta: true, action: toggleTheme },
  ]);

  // Toast on updates
  useEffect(() => {
    if (positions.length > 0 && positions.length % 5 === 0) {
      toast.success('ISS position locked', {
        icon: '🛰️',
        style: {
          background: 'var(--bg-deep)',
          color: 'var(--text-bright)',
          border: '1px solid var(--border-default)',
        },
      });
    }
  }, [positions.length]);

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
      <Header />
      
      <main className="relative z-10 max-w-[1600px] mx-auto px-6 pt-6">
        {/* ISS Section */}
        <ISSTracker />

        {/* Integration of Pie Chart in the ISS layout gap */}
        <div className="hidden xl:block absolute top-[1100px] right-6 w-[calc(100%*7/12-24px)] h-[400px]">
          {/* Note: In a real app we'd use a more robust layout, but for this portfolio piece we'll place it precisely */}
        </div>

        {/* News Dashboard */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-12">
          <div className="xl:col-span-12">
             <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 order-2 xl:order-1">
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
                <div className="xl:col-span-4 order-1 xl:order-2 mt-20">
                  <NewsDistribution 
                    categoryCounts={categoryCounts} 
                    totalArticles={totalArticles} 
                  />
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Chatbot */}
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
