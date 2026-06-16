import OpenAI from 'openai';
import type { ChatMessage, ChatContext } from '../../src/rag/types.js';
import type { RetrievalResult } from './retriever.js';

const SYSTEM_PROMPT = `You are Alex, a senior software architect and tutor in the Architecture Playground app.
You teach SOLID principles, design patterns, and system design (Instagram, Uber, Netflix, etc.).

RULES:
1. Answer ONLY using the RETRIEVED CONTEXT below. Do not invent facts not in context.
2. Explain in plain language — avoid buzzwords without explaining them.
3. Use real examples from the context when available.
4. If context is insufficient, say what you know from context and what you'd need to clarify.
5. Be conversational, encouraging, and structured (short paragraphs or bullets).
6. For architecture questions, mention components, problems, and trade-offs.`;

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';
const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';

export interface LlmConfig {
  apiKey: string;
  baseURL?: string;
  model: string;
  provider: 'groq' | 'openai';
}

export function resolveLlmConfig(): LlmConfig | null {
  const groqKey = (process.env.GROQ_API_KEY || '').trim();
  const openaiKey = (process.env.OPENAI_API_KEY || '').trim();
  const explicitProvider = (process.env.LLM_PROVIDER || '').trim().toLowerCase();

  // Groq key in GROQ_API_KEY or OPENAI_API_KEY (gsk_ prefix)
  const groqCandidate = groqKey || (openaiKey.startsWith('gsk_') ? openaiKey : '');
  if (groqCandidate.startsWith('gsk_') && groqCandidate.length > 20) {
    if (explicitProvider === 'openai') {
      // user explicitly wants openai — fall through
    } else {
      return {
        apiKey: groqCandidate,
        baseURL: GROQ_BASE_URL,
        model: process.env.LLM_MODEL || process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
        provider: 'groq',
      };
    }
  }

  if (openaiKey.startsWith('sk-') && openaiKey !== 'sk-your-key-here' && openaiKey.length > 20) {
    return {
      apiKey: openaiKey,
      model: process.env.LLM_MODEL || process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
      provider: 'openai',
    };
  }

  return null;
}

export function isLlmEnabled(): boolean {
  return resolveLlmConfig() !== null;
}

export function getLlmModel(): string {
  return resolveLlmConfig()?.model ?? DEFAULT_OPENAI_MODEL;
}

export function getLlmProvider(): 'groq' | 'openai' | null {
  return resolveLlmConfig()?.provider ?? null;
}

function buildContextBlock(results: RetrievalResult[]): string {
  if (results.length === 0) return 'No matching context found in knowledge base.';
  return results
    .map((r, i) => `[Source ${i + 1}: ${r.chunk.title} (${r.chunk.category})]\n${r.chunk.content}`)
    .join('\n\n---\n\n');
}

function buildContextHints(ctx?: ChatContext): string {
  if (!ctx) return '';
  const parts: string[] = [];
  if (ctx.page) parts.push(`Current page: ${ctx.page}`);
  if (ctx.mode) parts.push(`Mode: ${ctx.mode}`);
  if (ctx.guideName) parts.push(`Building architecture: ${ctx.guideName}`);
  if (ctx.stepTitle) parts.push(`Current step: ${ctx.stepTitle}`);
  if (ctx.stepProblem) parts.push(`Step problem: ${ctx.stepProblem}`);
  if (ctx.stepSolution) parts.push(`Step solution: ${ctx.stepSolution}`);
  return parts.length ? `\nUSER SESSION CONTEXT:\n${parts.join('\n')}` : '';
}

export async function generateLlmAnswer(
  message: string,
  results: RetrievalResult[],
  history: ChatMessage[] = [],
  context?: ChatContext,
): Promise<string> {
  const config = resolveLlmConfig();
  if (!config) {
    throw new Error('No LLM API key configured (set GROQ_API_KEY or OPENAI_API_KEY)');
  }

  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });

  const contextBlock = buildContextBlock(results);
  const sessionHints = buildContextHints(context);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `${SYSTEM_PROMPT}${sessionHints}\n\nRETRIEVED CONTEXT:\n${contextBlock}`,
    },
    ...history.slice(-8).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: message },
  ];

  const completion = await client.chat.completions.create({
    model: config.model,
    messages,
    temperature: 0.4,
    max_tokens: 900,
  });

  return completion.choices[0]?.message?.content?.trim()
    || 'I could not generate a response. Please try again.';
}

export function generateRetrievalAnswer(
  message: string,
  results: RetrievalResult[],
  context?: ChatContext,
): string {
  if (results.length === 0) {
    return 'I searched the knowledge base but couldn\'t find a close match. Try asking about a specific pattern (Factory, Observer), SOLID principle (SRP, DIP), or system (Instagram, Uber, WhatsApp).';
  }

  const top = results[0].chunk;
  const related = results.slice(1, 4);

  let answer = `Based on **${top.title}** (${top.category}):\n\n${top.content}`;

  if (context?.stepTitle) {
    answer = `For your current step **${context.stepTitle}**:\n\n${answer}`;
  }

  if (related.length > 0) {
    answer += '\n\n**Related topics:**\n';
    for (const r of related) {
      answer += `• ${r.chunk.title}: ${r.chunk.content.slice(0, 120)}...\n`;
    }
  }

  return answer;
}
