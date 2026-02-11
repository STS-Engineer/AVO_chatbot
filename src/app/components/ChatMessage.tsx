import { User, Bot, FileText, Download, ImageIcon, Pencil } from "lucide-react";
import { motion } from "motion/react";
import { AttachedFile } from "./ChatInput";
import { ContextItem } from "../../api/types";
import { API_BASE_URL } from "../../api/config";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  files?: AttachedFile[];
  context_items?: ContextItem[];
  isLatest?: boolean;
  sequence?: number;
  onEdit?: () => void;
}

export function ChatMessage({
  role,
  content,
  files,
  context_items,
  isLatest = false,
  sequence,
  onEdit,
}: ChatMessageProps) {
  const isUser = role === 'user';
  const shouldAnimate = isLatest || (typeof sequence === "number" && sequence < 6);
  const delay = typeof sequence === "number" ? Math.min(0.4, sequence * 0.04) : 0;

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return ImageIcon;
    }
    return FileText;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const normalizeAttachmentPath = (filePath?: string): string => {
    if (!filePath) return "";
    let clean = filePath.replace(/\\/g, "/").replace(/^\/+/, "");
    if (clean.toLowerCase().startsWith("uploads/")) {
      clean = clean.slice("uploads/".length);
    }
    return clean;
  };

  const encodePath = (path: string): string => {
    return path
      .split("/")
      .filter(Boolean)
      .map((segment) => encodeURIComponent(segment))
      .join("/");
  };

  const buildDownloadUrl = (filePath?: string, fileName?: string): string => {
    const path = normalizeAttachmentPath(filePath || fileName || "");
    if (!path) return "#";
    return `${API_BASE_URL}/api/download/${encodePath(path)}`;
  };

  const buildImageUrl = (filePath?: string, fileName?: string): string => {
    const path = normalizeAttachmentPath(filePath || fileName || "");
    if (!path) return "";
    // Always ensure /uploads/ prefix is present for proper URL routing
    const encodedPath = encodePath(path);
    return `${API_BASE_URL}/uploads/${encodedPath}`;
  };

  const contextAttachments = (context_items || []).flatMap((item) =>
    (item.attachments || []).map((att) => ({
      ...att,
      parent_node_title: att.parent_node_title || item.title,
      parent_node_type: att.parent_node_type || item.node_type,
    }))
  );

  // Deduplicate attachments by file_path to avoid showing the same file twice
  const seenFiles = new Set<string>();
  const uniqueContextAttachments = contextAttachments.filter((att) => {
    const fileKey = (att.file_path || att.file_name || '').toLowerCase().trim();
    if (!fileKey) return true; // Include if no file path
    if (seenFiles.has(fileKey)) return false; // Skip if already seen
    seenFiles.add(fileKey);
    return true;
  });

  const imageAttachments = uniqueContextAttachments.filter((att) => att.file_type?.startsWith("image/"));
  const fileAttachments = uniqueContextAttachments.filter((att) => !att.file_type?.startsWith("image/"));

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: shouldAnimate ? delay : 0 }}
      className={`
        w-full py-8 px-4
        bg-transparent
      `}
    >
      <div className="max-w-4xl mx-auto flex gap-6">
        {/* Avatar */}
        <div className={`
          flex-shrink-0 size-10 rounded-xl flex items-center justify-center shadow-lg
          ${isUser 
            ? 'bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800' 
            : 'bg-gradient-to-br from-blue-600 via-sky-500 to-orange-500'
          }
        `}>
          {isUser ? (
            <User className="size-5 text-white" />
          ) : (
            <Bot className="size-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div
          className={`flex-1 space-y-3 glass-card rounded-2xl p-4 md:p-5 ${
            isUser
              ? 'border-emerald-200/50 dark:border-emerald-400/20'
              : 'border-blue-200/60 dark:border-blue-400/20'
          }`}
        >
          <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
            <span>{isUser ? 'You' : 'Avocarbon AI'}</span>
            {isUser && onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <Pencil className="size-3.5" />
                Edit
              </button>
            )}
          </div>

          {/* Files */}
          {files && files.length > 0 && (
            <div className="space-y-2">
              {files.map(file => {
                const Icon = getFileIcon(file.type);
                const isImage = file.type.startsWith('image/');

                return (
                  <div key={file.id}>
                    {isImage ? (
                      <div className="rounded-2xl overflow-hidden glass-card max-w-sm">
                        <img 
                          src={file.url} 
                          alt={file.name}
                          className="w-full h-auto"
                        />
                        <div className="p-3 bg-white/60 dark:bg-slate-900/60 flex items-center justify-between border-t soft-divider">
                          <div className="flex items-center gap-2 min-w-0">
                            <ImageIcon className="size-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <span className="text-sm text-slate-700 dark:text-slate-300 truncate font-medium">
                              {file.name}
                            </span>
                          </div>
                          <a
                            href={file.url}
                            download={file.name}
                            className="ml-2 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Download className="size-4 text-slate-600 dark:text-slate-400" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4 glass-card rounded-2xl max-w-sm">
                        <div className="p-2.5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-lg shadow-md">
                          <Icon className="size-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900 dark:text-slate-100 truncate font-medium">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <a
                          href={file.url}
                          download={file.name}
                          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Download className="size-4 text-slate-600 dark:text-slate-400" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Text Content */}
          {content && (
            <div className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          )}

          {/* Display attachments (images and files) */}
          {!isUser && uniqueContextAttachments.length > 0 && (
            <div className="mt-4 space-y-4">
              {imageAttachments.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Images
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {imageAttachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="rounded-2xl overflow-hidden glass-card"
                      >
                        <img
                          src={buildImageUrl(attachment.file_path, attachment.file_name)}
                          alt={attachment.file_name || "Context image"}
                          className="w-full h-auto max-h-80 object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = "flex";
                            img.style.alignItems = "center";
                            img.style.justifyContent = "center";
                            img.style.backgroundColor = "#f1f5f9";
                            img.outerHTML = `<div style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; background: #f1f5f9; color: #64748b; font-size: 14px; text-align: center;">Image not available</div>`;
                          }}
                        />
                        <div className="p-3 flex items-center justify-between gap-2 border-t soft-divider bg-white/60 dark:bg-slate-900/60">
                          <div className="min-w-0">
                            <div className="text-sm text-slate-800 dark:text-slate-200 truncate">
                              {attachment.file_name || "Image"}
                            </div>
                            {attachment.parent_node_title && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                From: {attachment.parent_node_title}
                              </div>
                            )}
                          </div>
                          <a
                            href={buildDownloadUrl(attachment.file_path, attachment.file_name)}
                            download={attachment.file_name || undefined}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Download className="size-4 text-slate-600 dark:text-slate-300" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {fileAttachments.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Attachments
                  </div>
                  {fileAttachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-3 p-3 rounded-xl glass-card"
                    >
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <FileText className="size-4 text-slate-600 dark:text-slate-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-800 dark:text-slate-200 truncate">
                          {attachment.file_name || "Attachment"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {attachment.file_type || "unknown"}
                          {attachment.parent_node_title ? ` • From: ${attachment.parent_node_title}` : ""}
                        </div>
                      </div>
                      <a
                        href={buildDownloadUrl(attachment.file_path, attachment.file_name)}
                        download={attachment.file_name || undefined}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Download className="size-4 text-slate-600 dark:text-slate-300" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}