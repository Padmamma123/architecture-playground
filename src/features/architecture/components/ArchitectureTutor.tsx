import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, TextField, IconButton, Chip, Tooltip, Avatar, Button,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ReplayIcon from '@mui/icons-material/Replay';
import type { ArchitectureGuide, ArchitectureGuideStep } from '../../../types';
import { useTutorSpeech, buildStepNarration, speechify } from '../../../hooks/useTutorSpeech';
import { useRagChat } from '../../../hooks/useRagChat';
import type { ChatContext, ChatMessage } from '../../../rag/types';

interface ArchitectureTutorProps {
  guide: ArchitectureGuide | null;
  step: ArchitectureGuideStep | null;
  stepIndex: number;
}

const TUTOR = {
  name: 'Alex',
  role: 'Senior Architect',
  emoji: '🏛️',
};

const quickPrompts = [
  'What breaks first at 10x scale?',
  'Why do we need a queue here?',
  'What if this component fails?',
];

function TypewriterMessage({
  text, active, speed, onComplete,
}: { text: string; active: boolean; speed: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) {
      setDisplayed(text);
      return;
    }
    setDisplayed('');
    indexRef.current = 0;
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        indexRef.current++;
        setDisplayed(text.slice(0, indexRef.current));
      } else {
        clearInterval(interval);
        onCompleteRef.current?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, active]);

  return (
    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
      {displayed.split('**').map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      )}
      {active && displayed.length < text.length && (
        <Box component="span" sx={{ color: 'primary.main', animation: 'blink 1s infinite' }}>|</Box>
      )}
    </Typography>
  );
}

export default function ArchitectureTutor({ guide, step }: ArchitectureTutorProps) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; mode?: string }[]>([]);
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const { speak, stop, voiceEnabled, setVoiceEnabled, isSpeaking, speechSupported } = useTutorSpeech();
  const lastNarrationRef = useRef('');

  const ragContext: ChatContext | undefined = guide ? {
    page: '/architecture',
    mode: 'architecture',
    guideId: guide.id,
    guideName: guide.name,
    stepId: step?.id,
    stepTitle: step?.title,
    stepProblem: step?.problem,
    stepSolution: step?.solution,
  } : undefined;

  const { chat: ragChat, status: ragStatus } = useRagChat(ragContext);

  const stepMessage = guide && step
    ? `${guide.icon} **${guide.name}** — ${step.title}\n\n${step.tutorIntro}\n\nAsk me anything about this step, or use the quick prompts below!`
    : guide
      ? `Let's build **${guide.name}** together! I'll explain every component, the problems it solves, and why architects make these choices. Click **Next Step** to start building on the canvas.`
      : '';

  const narrateStep = useCallback(() => {
    if (!guide || !step) return;
    const narration = buildStepNarration(guide.name, step.title, step.tutorIntro, step.problem, step.solution);
    lastNarrationRef.current = narration;
    stop();
    speak(narration);
  }, [guide, step, speak, stop]);

  useEffect(() => {
    if (guide && step) {
      const msg = stepMessage;
      setMessages([{ role: 'ai', text: msg }]);
      setTypingIndex(0);
      const narration = buildStepNarration(guide.name, step.title, step.tutorIntro, step.problem, step.solution);
      lastNarrationRef.current = narration;
      stop();
      if (voiceEnabled) speak(narration);
    } else if (guide) {
      setMessages([{ role: 'ai', text: stepMessage }]);
      setTypingIndex(0);
      stop();
      if (voiceEnabled) speak(speechify(stepMessage));
    }
    return () => stop();
  }, [guide?.id, step?.id]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    stop();
    setMessages((prev) => [...prev, { role: 'user', text }]);

    const history: ChatMessage[] = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    setChatLoading(true);
    try {
      const result = await ragChat(text, history, ragContext);
      setMessages((prev) => {
        const next = [...prev, { role: 'ai' as const, text: result.answer, mode: result.mode }];
        setTypingIndex(next.length - 1);
        if (voiceEnabled) speak(result.answer);
        return next;
      });
    } catch {
      setMessages((prev) => {
        const fallback = '⚠️ RAG server offline. Run `npm run dev:server` in a terminal, then ask again.';
        const next = [...prev, { role: 'ai' as const, text: fallback }];
        setTypingIndex(next.length - 1);
        return next;
      });
    } finally {
      setChatLoading(false);
    }
    setQuery('');
  };

  if (!guide) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <SmartToyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Select a system above to start guided architecture building with your AI tutor.
        </Typography>
        {speechSupported && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Voice narration enabled — Alex will explain each step aloud
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 360 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 44,
            height: 44,
            animation: isSpeaking ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
          }}
        >
          {TUTOR.emoji}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{TUTOR.name} — {TUTOR.role}</Typography>
          <Typography variant="caption" color="text.secondary">
            {isSpeaking ? '🔊 Speaking...' : step ? step.title : guide.name}
          </Typography>
        </Box>
        {speechSupported && (
          <>
            <Tooltip title={voiceEnabled ? 'Mute tutor voice' : 'Enable tutor voice'}>
              <IconButton size="small" onClick={() => { stop(); setVoiceEnabled(!voiceEnabled); }} color="primary">
                {voiceEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
              </IconButton>
            </Tooltip>
            {step && (
              <Tooltip title="Replay step explanation">
                <IconButton size="small" onClick={narrateStep} color="secondary">
                  <ReplayIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
        <Chip label={guide.name} size="small" color="primary" variant="outlined" sx={{ fontSize: '0.7rem' }} />
        {ragStatus && (
          <Chip
            label={ragStatus.llmEnabled ? 'RAG+LLM' : 'Retrieval only'}
            size="small"
            color={ragStatus.llmEnabled ? 'success' : 'warning'}
            variant="outlined"
            sx={{ fontSize: '0.6rem' }}
          />
        )}
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 200, maxHeight: 280 }}>
        {messages.map((msg, i) => (
          <Box
            key={`${i}-${msg.text.slice(0, 20)}`}
            sx={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '92%',
              p: 1.5,
              borderRadius: 2,
              bgcolor: msg.role === 'user' ? 'primary.dark' : 'rgba(255,255,255,0.05)',
              border: msg.role === 'ai' ? '1px solid rgba(124,77,255,0.2)' : 'none',
            }}
          >
            {msg.role === 'ai' && typingIndex === i ? (
              <TypewriterMessage
                text={msg.text}
                active
                speed={voiceEnabled ? 18 : 12}
                onComplete={() => setTypingIndex(null)}
              />
            ) : (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {msg.text.split('**').map((part, j) =>
                  j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                )}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      {step && (
        <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
          {speechSupported && voiceEnabled && (
            <Chip
              icon={<RecordVoiceOverIcon sx={{ fontSize: 14 }} />}
              label="Voice on"
              size="small"
              color="secondary"
              variant="outlined"
              sx={{ fontSize: '0.65rem', mr: 0.5 }}
            />
          )}
          {quickPrompts.map((p) => (
            <Chip
              key={p}
              label={p}
              size="small"
              variant="outlined"
              onClick={() => sendMessage(p)}
              sx={{ cursor: 'pointer', fontSize: '0.7rem', '&:hover': { bgcolor: 'rgba(124,77,255,0.15)' } }}
            />
          ))}
        </Box>
      )}

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder={`Ask Alex about ${guide.name}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(query)}
        />
        <IconButton onClick={() => sendMessage(query)} color="primary" disabled={!query.trim() || chatLoading}>
          <SendIcon />
        </IconButton>
      </Box>

      {step && speechSupported && (
        <Box sx={{ px: 2, pb: 1.5, textAlign: 'center' }}>
          <Button size="small" variant="text" startIcon={<ReplayIcon />} onClick={narrateStep}>
            Listen to full step explanation
          </Button>
        </Box>
      )}
    </Box>
  );
}
