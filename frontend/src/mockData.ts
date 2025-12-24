import { Chunk } from './types';

export const mockChunks: Chunk[] = [
  {
    id: 1,
    rank: 1,
    source: 'connections-guide.md',
    content: "To reconnect a bank connection, go to Settings > Connections and click 'Refresh'. If the connection still shows as failed...",
    vectorScore: 0.89,
    rerankerScore: 0.95,
  },
  {
    id: 2,
    rank: 2,
    source: 'troubleshooting.md',
    content: "Failed connections typically occur when credentials expire. Users should re-authenticate through their bank's portal...",
    vectorScore: 0.84,
    rerankerScore: 0.88,
  },
  {
    id: 3,
    rank: 3,
    source: 'admin-guide.md',
    content: 'Connection errors are logged in the admin panel under Diagnostics. Each error includes a timestamp and error code...',
    vectorScore: 0.81,
    rerankerScore: 0.72,
  },
  {
    id: 4,
    rank: 4,
    source: 'technical-docs.md',
    content: 'Bank connections use OAuth 2.0 and require periodic token refresh. Tokens expire after 90 days by default...',
    vectorScore: 0.76,
    rerankerScore: 0.69,
  },
];

export const mockLLMPrompt = `You are a helpful assistant. Answer the user's question based on the following context from their documents.

Context:
---
[Chunk 1 - connections-guide.md]
To reconnect a bank connection, go to Settings > Connections and click 'Refresh'. If the connection still shows as failed...

[Chunk 2 - troubleshooting.md]
Failed connections typically occur when credentials expire. Users should re-authenticate through their bank's portal...

[Chunk 3 - admin-guide.md]
Connection errors are logged in the admin panel under Diagnostics. Each error includes a timestamp and error code...

[Chunk 4 - technical-docs.md]
Bank connections use OAuth 2.0 and require periodic token refresh. Tokens expire after 90 days by default...
---

User Question: How do I fix a failed bank connection?

Please provide a helpful answer based on the context above.`;

export const mockLLMAnswer = `To fix a failed bank connection, go to Settings > Connections and click 'Refresh.' If the connection still fails, this typically means your credentials have expired — you'll need to re-authenticate through your bank's portal. The system uses OAuth 2.0, and tokens expire after 90 days by default, which is often the cause of connection failures.

If issues persist, check the admin panel under Diagnostics for detailed error logs with timestamps and error codes that can help identify the specific problem.`;
