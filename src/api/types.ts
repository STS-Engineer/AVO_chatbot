/**
 * API Type Definitions
 */

// Request Types
export interface ChatRequestPayload {
  message: string;
  include_context?: boolean;
  top_k?: number;
  conversation_id?: string;
}

export interface SearchRequestPayload {
  query: string;
  top_k?: number;
}

export interface EditMessageRequestPayload {
  message: string;
  message_index: number;
  include_context?: boolean;
  top_k?: number;
  conversation_id?: string;
}

// Response Types
export interface Attachment {
  id: string;
  file_name: string;
  file_type?: string;
  file_path: string;
  uploaded_at?: string;
  parent_node_title?: string;
  parent_node_type?: string;
}

export interface ContextItem {
  id: string;
  title: string;
  node_type: string;
  content?: string;
  similarity?: number;
  parent_id?: string;
  attachments?: Attachment[];
  parent_node_title?: string;
  parent_node_type?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  context?: string;
  context_items?: ContextItem[];
  context_count?: number;
  error?: string;
  timestamp: string;
}

export interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context_count?: number;
}

export interface HistoryResponse {
  success: boolean;
  messages: HistoryMessage[];
  total: number;
  timestamp: string;
}

export interface SearchResponse {
  success: boolean;
  results: ContextItem[];
  count: number;
  timestamp: string;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  database_connected: boolean;
  llm_configured: boolean;
  timestamp: string;
}
