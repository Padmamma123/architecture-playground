import { useState, useEffect, useCallback } from 'react';
import type { ChatContext, ChatMessage, RagChatResponse, RagStatus } from '../rag/types';
import { fetchRagStatus, sendRagChat } from '../services/ragChat';

export function useRagChat(context?: ChatContext) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<RagStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRagStatus()
      .then(setStatus)
      .catch(() => setStatus({
        ready: false,
        llmEnabled: false,
        model: null,
        chunkCount: 0,
        message: 'RAG server offline. Run: npm run dev:server',
      }));
  }, []);

  const chat = useCallback(async (
    message: string,
    history: ChatMessage[] = [],
    overrideContext?: ChatContext,
  ): Promise<RagChatResponse> => {
    setLoading(true);
    setError(null);
    try {
      return await sendRagChat(message, history, overrideContext ?? context);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Chat failed';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [context]);

  return { chat, loading, status, error };
}
