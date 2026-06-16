import { Box, Typography, IconButton, TextField, Chip, Collapse, CircularProgress, Alert } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { glassStyle } from '../../theme/theme';
import { useRagChat } from '../../hooks/useRagChat';
import type { ChatContext, ChatMessage } from '../../rag/types';

function pageToMode(path: string): ChatContext['mode'] {
  if (path.startsWith('/architecture')) return 'architecture';
  if (path.startsWith('/solid')) return 'solid';
  if (path.startsWith('/patterns')) return 'patterns';
  if (path.startsWith('/system-design')) return 'system-design';
  return 'general';
}

export default function AiTutorPanel() {
  const location = useLocation();
  const isArchitecturePage = location.pathname.startsWith('/architecture');

  const chatContext = useMemo<ChatContext>(() => ({
    page: location.pathname,
    mode: pageToMode(location.pathname),
  }), [location.pathname]);

  const { chat, loading, status, error } = useRagChat(chatContext);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; mode?: string }[]>([
    {
      role: 'ai',
      text: isArchitecturePage
        ? 'Hi! I\'m Alex, your Architecture Tutor. I use RAG to search all curriculum data and an LLM to answer dynamically. Ask me anything!'
        : 'Hi! I\'m Alex. Ask me about SOLID, design patterns, or system design — I retrieve real content from the knowledge base and generate answers.',
    },
  ]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    const userText = query.trim();
    setQuery('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);

    const history: ChatMessage[] = messages
      .filter((m) => m.role === 'user' || m.role === 'ai')
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

    try {
      const result = await chat(userText, history);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: result.answer, mode: result.mode },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: '⚠️ Could not reach the RAG server. Start it with:\n\nnpm run dev:server\n\nOr run both: npm run dev:all',
        },
      ]);
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          background: 'linear-gradient(135deg, #7C4DFF, #00E5FF)',
          color: '#fff',
          zIndex: 1300,
          boxShadow: '0 4px 20px rgba(124, 77, 255, 0.4)',
          '&:hover': { background: 'linear-gradient(135deg, #651FFF, #00B8D4)' },
        }}
      >
        {open ? <CloseIcon /> : <SmartToyIcon />}
      </IconButton>

      <Collapse in={open}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            width: 400,
            maxHeight: 520,
            ...glassStyle,
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Alex — AI Tutor</Typography>
              <Chip
                label={status?.llmEnabled
                  ? `RAG + ${status.provider === 'groq' ? 'Groq' : 'LLM'}`
                  : status?.ready ? 'Retrieval only' : 'Offline'}
                size="small"
                color={status?.llmEnabled ? 'success' : status?.ready ? 'warning' : 'error'}
                sx={{ ml: 'auto', fontSize: '0.65rem' }}
              />
            </Box>
          {status && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {status.chunkCount} chunks indexed · {status.llmEnabled ? `Model: ${status.model}` : 'Retrieval only'}
            </Typography>
          )}
          {status?.ready && !status.llmEnabled && (
            <Alert severity="info" sx={{ mt: 1, py: 0.5, fontSize: '0.75rem' }}>
              For Groq answers: set <strong>GROQ_API_KEY</strong> in .env or Render, restart server
            </Alert>
          )}
          </Box>

          {error && (
            <Alert severity="warning" sx={{ mx: 2, mt: 1, py: 0 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  component={motion.div}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  sx={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '90%',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.role === 'user' ? 'primary.dark' : 'rgba(255,255,255,0.05)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                  {msg.mode && (
                    <Chip label={msg.mode === 'llm' ? 'GPT' : 'Retrieval'} size="small" sx={{ mt: 0.5, fontSize: '0.6rem', height: 18 }} />
                  )}
                </Box>
              ))}
            </AnimatePresence>
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">Searching knowledge base...</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Ask anything about patterns, SOLID, system design..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={loading}
            />
            <IconButton onClick={handleSend} color="primary" disabled={loading || !query.trim()}>
              {loading ? <CircularProgress size={20} /> : <SendIcon />}
            </IconButton>
          </Box>
        </Box>
      </Collapse>
    </>
  );
}
