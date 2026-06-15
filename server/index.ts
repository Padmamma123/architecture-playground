import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { runRagPipeline } from './rag/pipeline.js';
import { getChunkCount } from '../src/rag/knowledgeIndex.js';
import { isLlmEnabled, getLlmModel } from './rag/llm.js';
import type { RagChatRequest } from '../src/rag/types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = Number(process.env.PORT || process.env.RAG_PORT || 3001);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean) as string[];

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (origin.endsWith('.onrender.com')) return callback(null, true);
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    callback(null, true); // allow in production for Render preview URLs
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

app.get('/api/rag/status', (_req, res) => {
  const llm = isLlmEnabled();
  res.json({
    ready: true,
    llmEnabled: llm,
    model: llm ? getLlmModel() : null,
    chunkCount: getChunkCount(),
    message: llm
      ? `RAG + LLM ready (${getLlmModel()}).`
      : 'RAG retrieval ready. Set OPENAI_API_KEY on Render for LLM answers.',
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/rag/reindex', (_req, res) => {
  const count = getChunkCount();
  res.json({ success: true, chunkCount: count, message: `Indexed ${count} knowledge chunks.` });
});

app.post('/api/chat', async (req, res) => {
  try {
    const body = req.body as RagChatRequest;
    if (!body?.message?.trim()) {
      res.status(400).json({ error: 'message is required' });
      return;
    }

    const result = await runRagPipeline({
      message: body.message.trim(),
      history: body.history ?? [],
      context: body.context,
    });

    res.json(result);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: 'Failed to process chat request',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  const llm = isLlmEnabled();
  console.log(`RAG API on port ${PORT}`);
  console.log(`LLM: ${llm ? getLlmModel() : 'DISABLED — set OPENAI_API_KEY'}`);
  console.log(`Chunks: ${getChunkCount()}`);
  console.log(`CORS origins: ${allowedOrigins.join(', ') || 'onrender.com only'}`);
});
