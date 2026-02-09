import { Plus, MessageSquare, Trash2, Menu, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import logoLight from "../../assets/246cecfa9e4398fcd326945cad3ad44b9c21fde2.png";
import logoDark from "../../assets/dark.png";

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
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
  isOpen,
  onToggle,
  theme,
  onToggleTheme
}: ChatSidebarProps) {
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
            className="w-full justify-start gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-500 hover:via-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plus className="size-5" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-2 py-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`
                  group relative flex items-center gap-3 rounded-xl px-4 py-3
                  cursor-pointer transition-all duration-200 hover:-translate-y-0.5
                  ${currentChatId === chat.id 
                    ? 'glass-card border-emerald-200/60 dark:border-emerald-400/30 active-glow' 
                    : 'hover:bg-white/40 dark:hover:bg-slate-800/40'
                  }
                `}
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare className={`size-4 flex-shrink-0 ${currentChatId === chat.id ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className={`flex-1 truncate text-sm ${currentChatId === chat.id ? 'text-emerald-900 dark:text-emerald-100 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>
                  {chat.title}
                </span>
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
            ))}
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
