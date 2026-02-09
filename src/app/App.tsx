import { useState, useEffect, useRef } from "react";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput, AttachedFile } from "./components/ChatInput";
import { EmptyState } from "./components/EmptyState";
import { ScrollArea } from "./components/ui/scroll-area";
import { sendChatMessage, getHistory } from "../api/client";
import { ChatResponse, ContextItem } from "../api/types";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  files?: AttachedFile[];
  context_items?: ContextItem[];
  context?: string;
  timestamp?: string;
  error?: string;
}

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

export default function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [apiError, setApiError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load conversation history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await getHistory(50, 0, 'default');
        if (response.success && response.messages.length > 0) {
          // Create a chat from the history
          const historyChat: Chat = {
            id: 'default',
            title: 'Conversation',
            timestamp: new Date(),
            messages: response.messages.map((msg, idx) => ({
              id: idx.toString(),
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp,
            })),
          };
          setChats([historyChat]);
          setCurrentChatId('default');
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to load history:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to load history');
        setIsInitialized(true);
      }
    };

    loadHistory();
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChat?.messages]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: new Date(),
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setSidebarOpen(false);
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };



  const handleSendMessage = async (content: string, files?: AttachedFile[]) => {
    if (!content.trim()) return;
    
    setApiError(null);
    let chatId = currentChatId;

    // Create new chat if none exists
    if (!chatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: content.slice(0, 50),
        timestamp: new Date(),
        messages: []
      };
      chatId = newChat.id;
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(chatId);
      setSidebarOpen(false);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      files,
      timestamp: new Date().toISOString(),
    };

    // Add user message
    setChats(prev => prev.map(chat => 
      chat.id === chatId
        ? {
            ...chat,
            messages: [...chat.messages, userMessage],
            title: chat.messages.length === 0 ? content.slice(0, 50) : chat.title
          }
        : chat
    ));

    // Send message to backend API
    setIsLoading(true);
    try {
      const response: ChatResponse = await sendChatMessage({
        message: content,
        include_context: true,
        top_k: 8,
        conversation_id: chatId,
      });

      if (response.success && response.message) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message,
          context_items: response.context_items,
          context: response.context,
          timestamp: response.timestamp,
        };

        setChats(prev => prev.map(chat =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, assistantMessage] }
            : chat
        ));
      } else {
        throw new Error(response.error || 'Failed to get response from AI');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setApiError(errorMessage);
      
      const errorAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${errorMessage}`,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      };

      setChats(prev => prev.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, errorAssistantMessage] }
          : chat
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!currentChatId) {
      createNewChat();
      setTimeout(() => handleSendMessage(suggestion), 100);
    } else {
      handleSendMessage(suggestion);
    }
  };

  return (
    <div className="app-shell theme-smooth size-full flex flex-col">
      {/* API Error Banner */}
      {apiError && (
        <div className="bg-red-50 dark:bg-red-950 border-b border-red-200 dark:border-red-800 p-3 text-red-800 dark:text-red-200 flex items-center justify-between">
          <span className="text-sm">{apiError}</span>
          <button
            onClick={() => setApiError(null)}
            className="text-sm hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onNewChat={createNewChat}
          onSelectChat={(id) => {
            setCurrentChatId(id);
            setSidebarOpen(false);
          }}
          onDeleteChat={deleteChat}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentChat && currentChat.messages.length > 0 ? (
            <>
              {/* Messages */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto bg-transparent"
              >
                {currentChat.messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    files={message.files}
                    context_items={message.context_items}
                    context={message.context}
                    isLatest={index === currentChat.messages.length - 1}
                    sequence={index}
                  />
                ))}
                {isLoading && <LoadingMessage />}
              </div>

              {/* Input */}
              <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </>
          ) : !isInitialized ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Loading conversation history...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              <EmptyState onSuggestClick={handleSuggestionClick} />

              {/* Input */}
              <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-4xl mx-auto flex gap-6">
        <div className="flex-shrink-0 size-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600">
          <span className="size-4 rounded-full bg-white/80 typing-shimmer" />
        </div>
        <div className="flex-1 space-y-4 glass-card rounded-2xl p-4 md:p-5 border-emerald-200/50 dark:border-emerald-400/20">
          <div className="flex items-center gap-2">
            <div className="h-2 w-16 rounded-full typing-shimmer" />
            <div className="h-2 w-10 rounded-full typing-shimmer" />
            <div className="h-2 w-12 rounded-full typing-shimmer" />
          </div>
          <div className="space-y-3">
            <div className="skeleton-line w-2/3" />
            <div className="skeleton-block w-5/6" />
            <div className="skeleton-line w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}