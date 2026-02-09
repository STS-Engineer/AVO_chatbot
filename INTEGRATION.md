# Frontend & Backend Integration Guide

## Overview

The frontend is now integrated with the backend RAG-based chatbot API. The application supports:

- **Chat Messages**: Send messages to the chatbot and receive AI-generated responses with knowledge base context
- **Conversation History**: Automatically loads and displays previous conversations
- **Knowledge Base Search**: Search the knowledge base directly
- **Health Monitoring**: Checks backend API health status
- **Error Handling**: Graceful error handling with user-friendly messages

## API Endpoints Used

### Chat
- `POST /api/chat` - Send a chat message and get AI response with context
  - Request: `{ message: string, include_context?: boolean, top_k?: number }`
  - Response: `{ success: boolean, message: string, context_items: ContextItem[], ... }`

### History
- `GET /api/history?limit=50&offset=0` - Retrieve conversation history
  - Response: `{ success: boolean, messages: HistoryMessage[], total: number, ... }`

### Search
- `POST /api/search` - Search knowledge base
  - Request: `{ query: string, top_k?: number }`
  - Response: `{ success: boolean, results: ContextItem[], count: number, ... }`

### Utility
- `GET /health` - Health check
- `POST /api/clear-history` - Clear conversation history

## Frontend Architecture

### API Layer (`src/api/`)
- **config.ts**: API endpoints and configuration
- **types.ts**: TypeScript interfaces for all API requests/responses
- **client.ts**: API client with fetch wrapper and individual endpoint functions

### Components
- **App.tsx**: Main app component with state management and API integration
- **ChatSidebar**: Conversation sidebar
- **ChatMessage**: Individual message display
- **ChatInput**: Message input component
- **EmptyState**: Initial empty state UI

## Setup

### Backend
1. Ensure backend is running on `http://localhost:8000`
2. Database and LLM services must be configured (see backend README)
3. Required environment variables:
   - `GROQ_API_KEY` - Groq LLM API key
   - `OPENAI_API_KEY` - OpenAI embeddings API key
   - Database credentials

### Frontend
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   # Copy example and update if needed
   cp .env.example .env.local
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Feature Details

### Message Handling
- User messages are sent immediately to the backend
- Backend processes with RAG (Retrieval Augmented Generation)
- AI responses include retrieved knowledge base context
- Messages are stored in backend history

### Context Items
- Retrieved knowledge base items are displayed with context
- Each context item includes:
  - ID, title, node type
  - Similarity score
  - Content preview
  - Associated attachments (images, documents)

### Error Handling
- Network errors are caught and displayed to user
- API errors show helpful messages
- Conversation continues even if an error occurs
- Error messages are logged to console

### Initialization
- History is loaded on app startup
- If history exists, it's displayed in the sidebar
- If loading fails, user can still start new conversations

## Integration Points

1. **Message Sending**
   - User types message → Component calls `sendChatMessage()`
   - Backend processes with LLM and RAG
   - Response displayed with context

2. **History Loading**
   - App startup → `getHistory()` called
   - Previous conversations loaded into state
   - User can view past messages

3. **Context Display**
   - Knowledge base items displayed in response
   - Links to original documents/attachments
   - Similarity scores show relevance

## Troubleshooting

### Backend Connection Failed
- Ensure backend is running on configured URL
- Check CORS settings in backend (should allow frontend origin)
- Verify network connectivity

### No History Loaded
- Backend may be starting up
- Check browser console for error messages
- Ensure database is connected

### Messages Not Showing Response
- Check browser console for API errors
- Verify either API key is configured in backend
- Check backend logs for processing errors

## Analytics & Monitoring

The app logs:
- API errors to console
- Successful message sends
- History loading status
- Error dismissals

Check browser DevTools Console for debugging information.

## Future Enhancements

- Session management
- User authentication
- File upload processing
- Custom knowledge base management
- Advanced search filtering
- Export conversations
- Keyboard shortcuts
- Message editing/deletion
