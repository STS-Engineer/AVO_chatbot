import { Plus, MessageSquare, Trash2, Menu, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import logo from "../../assets/246cecfa9e4398fcd326945cad3ad44b9c21fde2.png";

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
        className="lg:hidden fixed top-4 left-4 z-50 bg-white dark:bg-slate-800 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700"
        onClick={onToggle}
      >
        <Menu className="size-5 text-slate-700 dark:text-slate-200" />
      </Button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          w-72 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 
          border-r border-slate-200 dark:border-slate-800
          flex flex-col transition-transform duration-300 shadow-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <img src={logo} alt="Avocarbon Logo" className="h-10 w-auto" />
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={onNewChat}
            className="w-full justify-start gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200"
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
                  cursor-pointer transition-all duration-200
                  ${currentChatId === chat.id 
                    ? 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 shadow-sm' 
                    : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }
                `}
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare className={`size-4 flex-shrink-0 ${currentChatId === chat.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className={`flex-1 truncate text-sm ${currentChatId === chat.id ? 'text-blue-900 dark:text-blue-100 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>
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
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
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
