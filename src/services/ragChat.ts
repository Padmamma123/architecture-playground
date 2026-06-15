import type { ChatContext, ChatMessage, RagChatResponse, RagStatus } from '../rag/types';

const API_BASE = import.meta.env.VITE_RAG_API_URL || '';

export async function fetchRagStatus(): Promise<RagStatus> {
  const res = await fetch(`${API_BASE}/api/rag/status`);
  if (!res.ok) throw new Error('RAG server unavailable');
  return res.json();
}

export async function sendRagChat(
  message: string,
  history: ChatMessage[] = [],
  context?: ChatContext,
): Promise<RagChatResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, context }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.details || err.error || `Chat failed (${res.status})`);
  }

  return res.json();
}
