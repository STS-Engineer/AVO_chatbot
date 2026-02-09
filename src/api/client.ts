/**
 * API Client for backend communication
 */

import { API_ENDPOINTS, REQUEST_TIMEOUT } from './config';
import {
  ChatRequestPayload,
  ChatResponse,
  SearchRequestPayload,
  SearchResponse,
  HistoryResponse,
  HealthResponse,
} from './types';

/**
 * Generic fetch function with error handling
 */
async function apiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `API Error ${response.status}: ${error || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
    throw new Error('Unknown error occurred');
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Send a chat message to the backend
 */
export async function sendChatMessage(payload: ChatRequestPayload): Promise<ChatResponse> {
  return apiCall<ChatResponse>(API_ENDPOINTS.CHAT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Get conversation history
 */
export async function getHistory(
  limit: number = 50,
  offset: number = 0,
  conversationId?: string
): Promise<HistoryResponse> {
  const url = new URL(API_ENDPOINTS.HISTORY);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());
  if (conversationId) {
    url.searchParams.append('conversation_id', conversationId);
  }

  return apiCall<HistoryResponse>(url.toString(), {
    method: 'GET',
  });
}

/**
 * Clear conversation history
 */
export async function clearHistory(): Promise<{ success: boolean; message: string; timestamp: string }> {
  return apiCall(API_ENDPOINTS.CLEAR_HISTORY, {
    method: 'POST',
  });
}

/**
 * Search the knowledge base
 */
export async function searchKnowledgeBase(payload: SearchRequestPayload): Promise<SearchResponse> {
  return apiCall<SearchResponse>(API_ENDPOINTS.SEARCH, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<HealthResponse> {
  return apiCall<HealthResponse>(API_ENDPOINTS.HEALTH, {
    method: 'GET',
  });
}

/**
 * Get API configuration
 */
export async function getConfig(): Promise<any> {
  return apiCall(API_ENDPOINTS.CONFIG, {
    method: 'GET',
  });
}
