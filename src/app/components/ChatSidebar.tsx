import { Plus, MessageSquare, Trash2, Menu, Sun, Moon, Search, Pin } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import logoLight from "../../assets/246cecfa9e4398fcd326945cad3ad44b9c21fde2.png";
import logoDark from "../../assets/dark.png";

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  isPinned?: boolean;
}

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onTogglePin: (chatId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function ChatSidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onTogglePin,
  isOpen,
  onToggle,
  theme,
  onToggleTheme
}: ChatSidebarProps) {
  const [query, setQuery] = useState("");

  const { pinnedChats, recentChats } = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const visibleChats = normalizedQuery
      ? chats.filter((chat) => chat.title.toLowerCase().includes(normalizedQuery))
      : chats;

    return {
      pinnedChats: visibleChats.filter((chat) => chat.isPinned),
      recentChats: visibleChats.filter((chat) => !chat.isPinned),
    };
  }, [chats, query]);

  const renderChatItem = (chat: Chat) => (
    <div
      key={chat.id}
      className={`
        group relative flex items-start gap-3 rounded-xl px-4 py-3
        cursor-pointer transition-all duration-200 hover:-translate-y-0.5
        ${currentChatId === chat.id 
          ? 'glass-card border-blue-200/70 dark:border-blue-400/30 active-glow' 
          : 'hover:bg-white/40 dark:hover:bg-slate-800/40'
        }
      `}
      onClick={() => onSelectChat(chat.id)}
    >
      <MessageSquare className={`mt-0.5 size-4 flex-shrink-0 ${currentChatId === chat.id ? 'text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}`} />
      <span className={`min-w-0 flex-1 text-sm whitespace-normal break-all leading-snug ${currentChatId === chat.id ? 'text-blue-900 dark:text-blue-100 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>
        {chat.title}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 opacity-0 group-hover:opacity-100 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(chat.id);
          }}
          aria-label={chat.isPinned ? "Unpin chat" : "Pin chat"}
        >
          <Pin className={`size-3.5 ${chat.isPinned ? 'text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteChat(chat.id);
          }}
        >
          <Trash2 className="size-3.5 text-red-600 dark:text-red-400" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 glass-card hover:bg-white/80 dark:hover:bg-slate-800/70"
        onClick={onToggle}
      >
        <Menu className="size-5 text-slate-700 dark:text-slate-200" />
      </Button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          w-72 glass-panel
          flex flex-col transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b soft-divider bg-white/50 dark:bg-slate-900/40">
          <img
            src={theme === 'dark' ? logoDark : logoLight}
            alt="Avocarbon Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={onNewChat}
            className="w-full justify-start gap-3 bg-gradient-to-r from-blue-600 via-sky-500 to-orange-500 hover:from-blue-700 hover:via-sky-600 hover:to-orange-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plus className="size-5" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              className="h-10 rounded-xl pl-9 bg-white/70 dark:bg-slate-900/40"
            />
          </div>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 px-3 chat-list-panel">
          <div className="space-y-4 py-2">
            {pinnedChats.length > 0 && (
              <div className="space-y-2">
                <div className="px-2 text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                  Pinned
                </div>
                <div className="space-y-2">
                  {pinnedChats.map(renderChatItem)}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {pinnedChats.length > 0 && (
                <div className="px-2 text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                  Recent
                </div>
              )}
              <div className="space-y-2">
                {recentChats.map(renderChatItem)}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer with Theme Toggle */}
        <div className="p-4 border-t soft-divider bg-white/50 dark:bg-slate-900/40">
          <div className="glass-card flex items-center justify-between px-4 py-3 rounded-xl">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 hover:bg-white/60 dark:hover:bg-slate-700/60 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
              onClick={onToggleTheme}
            >
              {theme === 'light' ? (
                <Moon className="size-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <Sun className="size-5 text-yellow-500" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
}
