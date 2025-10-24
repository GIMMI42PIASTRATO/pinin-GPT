# SSE Chat Streaming Implementation

This implementation provides Server-Sent Events (SSE) streaming for chat responses using Ollama.

## Architecture

### Custom Request/Response Classes

Located in `/src/lib/server/customRequestResponse.ts`:

- **`AppRequest`**: Extends `IncomingMessage` with body parsing capabilities
  - `parseBody<T>()`: Asynchronously parse JSON request body
  - `body`: Getter for parsed body
  
- **`AppResponse`**: Extends `ServerResponse` with SSE and JSON helpers
  - `json(data, statusCode)`: Send JSON response
  - `error(message, statusCode)`: Send error response
  - `initSSE()`: Initialize SSE connection with proper headers
  - `sendSSE(event, data)`: Send named SSE event
  - `sendSSEData(data)`: Send SSE data without event type
  - `endSSE()`: Properly close SSE connection

### Server Configuration

Located in `/server.ts`:

The custom server intercepts requests to `/api/stream` and:
1. Casts native `IncomingMessage` and `ServerResponse` to custom classes
2. Handles the chat request with streaming
3. Falls back to Next.js handler for other routes

### Chat Event Handler

Located in `/src/events/chatEvents.ts`:

The `handleChatRequest` function:
1. Parses and validates the request body
2. Initializes SSE connection
3. Streams responses from Ollama API
4. Saves messages to database (if chatId provided)
5. Handles errors gracefully

### Client-Side SSE Client

Located in `/src/lib/client/sseClient.ts`:

The `SSEChatClient` class provides:
- Easy consumption of SSE endpoints
- Callback-based event handling
- Automatic event parsing
- Error handling

## Usage

### Server-Side (Already Configured)

The endpoint `/api/stream` is automatically available when you start the server:

```bash
npm run dev
# or
pnpm dev
```

### Client-Side Example

```typescript
import { SSEChatClient } from "@/lib/client/sseClient";
import { ChatMessage } from "@/types/chatContextTypes";

const client = new SSEChatClient();

const messages: ChatMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "Hello, how are you?",
    timestamp: new Date(),
  }
];

await client.sendMessage(
  {
    messages,
    model: "llama2", // or any Ollama model
    chatId: "chat-123", // optional
    systemPrompt: "You are a helpful assistant", // optional
  },
  {
    onStart: (data) => {
      console.log("Message started:", data.messageId);
    },
    onChunk: (chunk) => {
      console.log("Received chunk:", chunk.content);
      // Update UI with streaming content
    },
    onComplete: (message) => {
      console.log("Complete message:", message.fullContent);
      // Finalize UI
    },
    onError: (error) => {
      console.error("Error:", error.message);
      // Show error to user
    },
  }
);
```

### React Component Example

```typescript
import { useState } from "react";
import { SSEChatClient } from "@/lib/client/sseClient";

function ChatComponent() {
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (userMessage: string) => {
    setIsStreaming(true);
    setStreamingContent("");

    const client = new SSEChatClient();

    await client.sendMessage(
      {
        messages: [
          {
            id: crypto.randomUUID(),
            role: "user",
            content: userMessage,
            timestamp: new Date(),
          },
        ],
        model: "llama2",
      },
      {
        onChunk: (chunk) => {
          setStreamingContent((prev) => prev + chunk.content);
        },
        onComplete: (message) => {
          setIsStreaming(false);
          console.log("Full message received");
        },
        onError: (error) => {
          setIsStreaming(false);
          console.error(error);
        },
      }
    );
  };

  return (
    <div>
      <div>{streamingContent}</div>
      <button onClick={() => sendMessage("Hello!")} disabled={isStreaming}>
        Send
      </button>
    </div>
  );
}
```

## API Specification

### Request

**Endpoint**: `POST /api/stream`

**Body**:
```typescript
{
  messages: ChatMessage[];  // Array of chat messages
  model: string;            // Ollama model name (e.g., "llama2", "mistral")
  chatId?: string;          // Optional: Chat ID for database persistence
  systemPrompt?: string;    // Optional: Custom system prompt
}
```

### Response

**SSE Events**:

1. **message-start**
   ```json
   {
     "messageId": "uuid-v4"
   }
   ```

2. **message-chunk** (multiple)
   ```json
   {
     "messageId": "uuid-v4",
     "content": "text chunk",
     "done": false
   }
   ```

3. **message-complete**
   ```json
   {
     "messageId": "uuid-v4",
     "fullContent": "complete message text"
   }
   ```

4. **error** (if error occurs)
   ```json
   {
     "message": "error description"
   }
   ```

## Error Handling

The implementation handles errors at multiple levels:

1. **Request validation**: Invalid request body returns 400 error
2. **Ollama errors**: Caught and returned as SSE error events
3. **Database errors**: Logged but don't interrupt streaming
4. **Connection errors**: Properly closed with error events

## Database Integration

If a `chatId` is provided:
- User messages are saved to the database
- Assistant responses are saved after streaming completes
- Database errors don't interrupt the streaming process

## Requirements

- Ollama running locally or accessible via network
- Node.js with HTTP server support
- Database configured (for message persistence)
- Next.js application

## Testing

You can test the endpoint with curl:

```bash
curl -N -X POST http://localhost:3000/api/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "id": "test-1",
        "role": "user",
        "content": "Hello!",
        "timestamp": "2024-01-01T00:00:00Z"
      }
    ],
    "model": "llama2"
  }'
```

## Notes

- The `-N` flag in curl disables buffering for streaming responses
- Make sure Ollama is running before testing
- The default system prompt is used if none is provided
- Messages are streamed in real-time as they're generated by Ollama
