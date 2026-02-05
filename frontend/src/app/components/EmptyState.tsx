import { Sparkles, FileText, Lightbulb, Code } from "lucide-react";

interface EmptyStateProps {
  onSuggestClick: (suggestion: string) => void;
}

export function EmptyState({ onSuggestClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/20">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 shadow-2xl shadow-blue-500/30">
            <Bot className="size-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              How can I help you today?
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Ask me anything about Avocarbon or start a conversation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bot({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}