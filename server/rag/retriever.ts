import type { KnowledgeChunk } from '../../src/rag/types.js';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'to', 'of',
  'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'about',
  'what', 'how', 'why', 'when', 'where', 'which', 'who', 'whom', 'this',
  'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your',
  'it', 'its', 'they', 'them', 'their', 'and', 'or', 'but', 'if', 'not',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

export interface RetrievalResult {
  chunk: KnowledgeChunk;
  score: number;
}

export function retrieveChunks(
  query: string,
  chunks: KnowledgeChunk[],
  topK = 6,
  contextBoost?: { guideId?: string; stepId?: string; mode?: string },
): RetrievalResult[] {
  const queryTokens = tokenize(query);
  const queryLower = query.toLowerCase();

  if (queryTokens.length === 0) {
    return chunks.slice(0, topK).map((chunk) => ({ chunk, score: 0.1 }));
  }

  const scored = chunks.map((chunk) => {
    const searchText = `${chunk.title} ${chunk.content} ${chunk.tags.join(' ')} ${chunk.category}`.toLowerCase();
    const chunkTokens = tokenize(searchText);
    const tokenSet = new Set(chunkTokens);

    let score = 0;

    for (const token of queryTokens) {
      if (tokenSet.has(token)) score += 2;
      if (searchText.includes(token)) score += 0.5;
    }

    // Exact phrase boost
    if (queryLower.length > 4 && searchText.includes(queryLower)) {
      score += 8;
    }

    // Tag boost
    for (const tag of chunk.tags) {
      if (queryLower.includes(tag) || queryTokens.some((t) => tag.includes(t))) {
        score += 3;
      }
    }

    // Title word overlap
    const titleTokens = tokenize(chunk.title);
    for (const t of queryTokens) {
      if (titleTokens.includes(t)) score += 2.5;
    }

    // Context boost for guided architecture
    if (contextBoost?.guideId && chunk.id.includes(contextBoost.guideId)) {
      score += 5;
    }
    if (contextBoost?.stepId && chunk.id.includes(contextBoost.stepId)) {
      score += 8;
    }
    if (contextBoost?.mode && chunk.category.includes(contextBoost.mode.replace('-', ''))) {
      score += 1;
    }

    return { chunk, score };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
