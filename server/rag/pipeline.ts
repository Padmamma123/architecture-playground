import { buildKnowledgeIndex } from '../../src/rag/knowledgeIndex.js';
import type { RagChatRequest, RagChatResponse } from '../../src/rag/types.js';
import { retrieveChunks } from './retriever.js';
import { generateLlmAnswer, generateRetrievalAnswer, isLlmEnabled } from './llm.js';

export async function runRagPipeline(request: RagChatRequest): Promise<RagChatResponse> {
  const { message, history = [], context } = request;

  // Fresh index every request — picks up curriculum changes in real time
  const chunks = buildKnowledgeIndex();

  const results = retrieveChunks(message, chunks, 6, {
    guideId: context?.guideId,
    stepId: context?.stepId,
    mode: context?.mode,
  });

  let answer: string;
  let mode: 'llm' | 'retrieval' = 'retrieval';

  if (isLlmEnabled()) {
    try {
      answer = await generateLlmAnswer(message, results, history, context);
      mode = 'llm';
    } catch (err) {
      console.error('LLM error, falling back to retrieval:', err);
      answer = generateRetrievalAnswer(message, results, context);
    }
  } else {
    answer = generateRetrievalAnswer(message, results, context);
  }

  return {
    answer,
    mode,
    chunksUsed: results.length,
    sources: results.map((r) => ({
      title: r.chunk.title,
      category: r.chunk.category,
      source: r.chunk.source,
      score: Math.round(r.score * 10) / 10,
    })),
  };
}
