import { User, Bot, FileText, Download, ImageIcon } from "lucide-react";
import { motion } from "motion/react";
import { AttachedFile } from "./ChatInput";
import { ContextItem } from "../../api/types";
import { API_BASE_URL } from "../../api/config";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  files?: AttachedFile[];
  context_items?: ContextItem[];
  context?: string;
  isLatest?: boolean;
}

export function ChatMessage({ role, content, files, context_items, context, isLatest = false }: ChatMessageProps) {
  const isUser = role === 'user';

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
    if (!path) return "#";
    return `${API_BASE_URL}/uploads/${encodePath(path)}`;
  };

  const contextAttachments = (context_items || []).flatMap((item) =>
    (item.attachments || []).map((att) => ({
      ...att,
      parent_node_title: att.parent_node_title || item.title,
      parent_node_type: att.parent_node_type || item.node_type,
    }))
  );

  const imageAttachments = contextAttachments.filter((att) => att.file_type?.startsWith("image/"));
  const fileAttachments = contextAttachments.filter((att) => !att.file_type?.startsWith("image/"));

  return (
    <motion.div
      initial={isLatest ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        w-full py-8 px-4
        ${isUser ? 'bg-white dark:bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950/50 border-y border-slate-100 dark:border-slate-800'}
      `}
    >
      <div className="max-w-4xl mx-auto flex gap-6">
        {/* Avatar */}
        <div className={`
          flex-shrink-0 size-10 rounded-xl flex items-center justify-center shadow-lg
          ${isUser 
            ? 'bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800' 
            : 'bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600'
          }
        `}>
          {isUser ? (
            <User className="size-5 text-white" />
          ) : (
            <Bot className="size-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 space-y-3">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {isUser ? 'You' : 'Avocarbon AI'}
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
                      <div className="rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 max-w-sm shadow-md">
                        <img 
                          src={file.url} 
                          alt={file.name}
                          className="w-full h-auto"
                        />
                        <div className="p-3 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
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
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 max-w-sm shadow-md">
                        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-lg shadow-md">
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
          {!isUser && contextAttachments.length > 0 && (
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
                        className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
                      >
                        <img
                          src={buildImageUrl(attachment.file_path, attachment.file_name)}
                          alt={attachment.file_name || "Context image"}
                          className="w-full h-auto max-h-80 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <div className="p-3 flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-700">
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
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
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