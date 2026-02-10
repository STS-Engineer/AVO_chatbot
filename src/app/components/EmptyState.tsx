interface EmptyStateProps {
  onSuggestClick: (suggestion: string) => void;
}

export function EmptyState({ onSuggestClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="glass-card empty-hero rounded-3xl px-8 py-10 text-center space-y-6 reveal-in">
          <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-orange-500 shadow-2xl shadow-blue-500/30 float-slow">
            <Bot className="size-10 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="editorial-title text-4xl font-semibold text-slate-900 dark:text-slate-100">
              How can I help you today?
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Ask me anything about Avocarbon, or start a new conversation.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            <span>Research</span>
            <span>Insights</span>
            <span>Support</span>
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