/**
 * API Configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kb-chat.azurewebsites.net/';

export const API_ENDPOINTS = {
  // Chat
  CHAT: `${API_BASE_URL}/api/chat`,
  HISTORY: `${API_BASE_URL}/api/history`,
  CLEAR_HISTORY: `${API_BASE_URL}/api/clear-history`,
  SEARCH: `${API_BASE_URL}/api/search`,
  
  // Health
  HEALTH: `${API_BASE_URL}/health`,
  CONFIG: `${API_BASE_URL}/config`,
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;
