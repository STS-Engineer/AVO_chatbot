import { Send, Paperclip, X } from "lucide-react";
import { useState, KeyboardEvent, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface ChatInputProps {
  onSend: (message: string, files?: AttachedFile[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const newFiles: AttachedFile[] = files.map(file => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));

    setAttachedFiles(prev => [...prev, ...newFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSend = () => {
    if ((message.trim() || attachedFiles.length > 0) && !disabled) {
      onSend(message.trim(), attachedFiles.length > 0 ? attachedFiles : undefined);
      setMessage("");
      setAttachedFiles([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t soft-divider bg-transparent p-4">
      <div className="w-full">
        {/* Attached Files Preview */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-2 glass-card rounded-xl border-blue-200/60 dark:border-blue-600/40"
              >
                <Paperclip className="size-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-slate-100 truncate font-medium">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 hover:bg-blue-200 dark:hover:bg-blue-800/50"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="size-3.5 text-slate-600 dark:text-slate-400" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2 glass-panel rounded-2xl p-2 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors hover:-translate-y-0.5">
          {/* File Input (Hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
          />

          {/* Attach Button */}
          <Button
            variant="ghost"
            size="icon"
            className="size-10 flex-shrink-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Paperclip className="size-5 text-slate-600 dark:text-slate-400" />
          </Button>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Avocarbon AI..."
            disabled={disabled}
            className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 whitespace-pre-wrap break-words"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={(!message.trim() && attachedFiles.length === 0) || disabled}
            size="icon"
            className="size-10 flex-shrink-0 bg-gradient-to-r from-blue-600 via-sky-500 to-orange-500 hover:from-blue-700 hover:via-sky-600 hover:to-orange-600 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="size-5 text-white" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
          Avocarbon AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}