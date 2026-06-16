export interface KnowledgeChunk {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  source: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatContext {
  page?: string;
  mode?: 'architecture' | 'solid' | 'patterns' | 'system-design' | 'general';
  guideId?: string;
  guideName?: string;
  stepId?: string;
  stepTitle?: string;
  stepProblem?: string;
  stepSolution?: string;
}

export interface RagChatRequest {
  message: string;
  history?: ChatMessage[];
  context?: ChatContext;
}

export interface RagChatResponse {
  answer: string;
  sources: { title: string; category: string; source: string; score: number }[];
  mode: 'llm' | 'retrieval';
  chunksUsed: number;
}

export interface RagStatus {
  ready: boolean;
  llmEnabled: boolean;
  provider?: 'groq' | 'openai' | null;
  model: string | null;
  chunkCount: number;
  message: string;
}
