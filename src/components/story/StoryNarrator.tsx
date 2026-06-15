import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Typography, IconButton, LinearProgress, Chip, Avatar,
  Alert, Collapse, Button, Tooltip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { motion, AnimatePresence } from 'framer-motion';
import type { PatternStory, StoryMood, StoryVisual, StoryCharacter, StoryLine } from '../../types';
import { glassStyle } from '../../theme/theme';
import { useAppStore } from '../../store/useAppStore';
import { buildSceneLines, getInsightSpeaker } from '../../utils/storyLines';
import { useStorySpeech } from '../../hooks/useStorySpeech';

const moodColors: Record<StoryMood, string> = {
  neutral: 'rgba(124, 77, 255, 0.15)',
  problem: 'rgba(255, 82, 82, 0.15)',
  conflict: 'rgba(255, 82, 82, 0.25)',
  insight: 'rgba(255, 215, 64, 0.15)',
  solution: 'rgba(0, 230, 118, 0.15)',
  celebration: 'rgba(0, 229, 255, 0.15)',
};

const moodBorders: Record<StoryMood, string> = {
  neutral: 'rgba(124, 77, 255, 0.3)',
  problem: 'rgba(255, 82, 82, 0.4)',
  conflict: 'rgba(255, 82, 82, 0.6)',
  insight: 'rgba(255, 215, 64, 0.4)',
  solution: 'rgba(0, 230, 118, 0.4)',
  celebration: 'rgba(0, 229, 255, 0.4)',
};

function TypewriterText({
  text, speed = 28, active, onComplete,
}: { text: string; speed?: number; active: boolean; onComplete?: () => void }) {
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
    <Typography variant="body1" sx={{ lineHeight: 1.85, fontSize: '1.05rem' }}>
      "{displayed}
      {active && displayed.length < text.length && (
        <Box component="span" sx={{ animation: 'blink 1s infinite', color: 'primary.main' }}>|</Box>
      )}
      {displayed.length === text.length && '"'}
    </Typography>
  );
}

function StoryVisualElement({ visual, delay }: { visual: StoryVisual; delay: number }) {
  const animProps = {
    enter: { initial: { opacity: 0, scale: 0.5, y: 30 }, animate: { opacity: 1, scale: 1, y: 0 } },
    shake: { animate: { x: [0, -8, 8, -4, 4, 0], transition: { duration: 0.6, delay } } },
    glow: { animate: { boxShadow: ['0 0 10px rgba(124,77,255,0.3)', '0 0 30px rgba(124,77,255,0.6)', '0 0 10px rgba(124,77,255,0.3)'], transition: { duration: 2, repeat: Infinity, delay } } },
    flow: { animate: { y: [0, -10, 0], transition: { duration: 1.5, repeat: Infinity, delay } } },
    bounce: { animate: { y: [0, -12, 0], transition: { duration: 1.2, repeat: Infinity, delay } } },
    split: { initial: { scale: 1 }, animate: { scale: [1, 1.1, 0.9, 1], transition: { duration: 0.8, delay } } },
    merge: { initial: { opacity: 0.5 }, animate: { opacity: 1, scale: 1.05, transition: { delay } } },
  };

  const anim = visual.animation ? animProps[visual.animation] : animProps.enter;
  const initial = 'initial' in anim ? anim.initial : { opacity: 0, y: 20 };
  const animate = 'animate' in anim ? anim.animate : { opacity: 1, y: 0 };

  return (
    <Box
      component={motion.div}
      initial={initial}
      animate={animate}
      transition={{ delay, duration: 0.5 }}
      sx={{
        textAlign: 'center', p: 2, borderRadius: 2,
        bgcolor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        minWidth: 100,
      }}
    >
      <Typography sx={{ fontSize: '2.5rem', mb: 0.5 }}>{visual.emoji}</Typography>
      <Typography variant="caption" color="text.secondary">{visual.label}</Typography>
    </Box>
  );
}

function CharacterPortrait({
  character, isSpeaking, isActive,
}: { character: StoryCharacter; isSpeaking: boolean; isActive: boolean }) {
  return (
    <Box
      component={motion.div}
      animate={{
        scale: isSpeaking ? 1.15 : isActive ? 1.05 : 0.9,
        opacity: isSpeaking || isActive ? 1 : 0.45,
        y: isSpeaking ? -8 : 0,
      }}
      transition={{ duration: 0.35 }}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: 140 }}
    >
      <Box sx={{ position: 'relative' }}>
        <Avatar
          sx={{
            width: isSpeaking ? 72 : 56,
            height: isSpeaking ? 72 : 56,
            bgcolor: character.color,
            fontSize: isSpeaking ? '2rem' : '1.5rem',
            border: isSpeaking ? `3px solid ${character.color}` : '2px solid transparent',
            boxShadow: isSpeaking ? `0 0 24px ${character.color}66` : 'none',
            transition: 'all 0.3s',
          }}
        >
          {character.avatar}
        </Avatar>
        {isSpeaking && (
          <Box
            component={motion.div}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            sx={{
              position: 'absolute', bottom: -4, right: -4,
              bgcolor: 'success.main', borderRadius: '50%', width: 22, height: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <VolumeUpIcon sx={{ fontSize: 14, color: '#fff' }} />
          </Box>
        )}
      </Box>
      <Typography
        variant="caption"
        sx={{
          mt: 1, fontWeight: isSpeaking ? 700 : 400,
          color: isSpeaking ? character.color : 'text.secondary',
          textAlign: 'center',
        }}
      >
        {character.name}
      </Typography>
      {isSpeaking && (
        <Box sx={{ display: 'flex', gap: 0.3, mt: 0.5 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              component={motion.div}
              animate={{ scaleY: [1, 2, 1] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.12 }}
              sx={{ width: 4, height: 12, borderRadius: 1, bgcolor: character.color }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

interface StoryNarratorProps {
  story: PatternStory;
  onComplete?: () => void;
}

export default function StoryNarrator({ story, onComplete }: StoryNarratorProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lineDone, setLineDone] = useState(false);
  const [allLinesDone, setAllLinesDone] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showInsight, setShowInsight] = useState(false);
  const [completedLines, setCompletedLines] = useState<StoryLine[]>([]);
  const addXp = useAppStore((s) => s.addXp);

  const {
    speak, stop, pause, resume,
    voiceEnabled, setVoiceEnabled, isSpeaking, speechSupported,
  } = useStorySpeech(story.characters);

  const scene = story.scenes[sceneIndex];
  const lines = buildSceneLines(scene, story.characters);
  const currentLine = lines[lineIndex];
  const speaker = currentLine ? story.characters.find((c) => c.id === currentLine.characterId) : undefined;
  const isLastScene = sceneIndex >= story.scenes.length - 1;
  const insightSpeaker = getInsightSpeaker(scene, story.characters);
  const moralSpeaker = story.characters[0];

  const resetSceneState = useCallback(() => {
    stop();
    setLineIndex(0);
    setLineDone(false);
    setAllLinesDone(false);
    setShowQuiz(false);
    setQuizAnswer(null);
    setShowInsight(false);
    setCompletedLines([]);
  }, [stop]);

  const goNextScene = useCallback(() => {
    stop();
    if (sceneIndex < story.scenes.length - 1) {
      setSceneIndex((i) => i + 1);
      resetSceneState();
    } else {
      setIsPlaying(false);
      addXp(75);
      onComplete?.();
    }
  }, [sceneIndex, story.scenes.length, addXp, onComplete, resetSceneState, stop]);

  const advanceLine = useCallback(() => {
    stop();
    if (lineIndex < lines.length - 1) {
      setCompletedLines((prev) => [...prev, lines[lineIndex]]);
      setLineIndex((i) => i + 1);
      setLineDone(false);
    } else {
      setAllLinesDone(true);
    }
  }, [lineIndex, lines, stop]);

  // Speak current line when playing (voice on)
  useEffect(() => {
    if (!isPlaying || !currentLine || !speaker || allLinesDone || !voiceEnabled) return;

    setLineDone(false);
    const timer = setTimeout(() => {
      speak(currentLine.text, speaker, () => setLineDone(true));
    }, 300);

    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [isPlaying, lineIndex, sceneIndex, currentLine?.text, speaker?.id, allLinesDone, voiceEnabled, speak, stop]);

  // When voice off, reset lineDone for typewriter pacing
  useEffect(() => {
    if (isPlaying && !voiceEnabled && !allLinesDone) {
      setLineDone(false);
    }
  }, [isPlaying, lineIndex, voiceEnabled, allLinesDone]);

  // Speak insight when it appears
  useEffect(() => {
    if (!showInsight || !scene.insight || !insightSpeaker || !isPlaying || !voiceEnabled) return;
    speak(scene.insight, insightSpeaker);
  }, [showInsight, scene.insight, insightSpeaker, isPlaying, voiceEnabled, speak]);

  // Speak moral on last scene
  useEffect(() => {
    if (!isLastScene || !allLinesDone || !isPlaying || !voiceEnabled) return;
    const timer = setTimeout(() => speak(story.moral, moralSpeaker), 1500);
    return () => clearTimeout(timer);
  }, [isLastScene, allLinesDone, isPlaying, voiceEnabled, story.moral, moralSpeaker, speak]);

  useEffect(() => {
    if (!allLinesDone) return;
    if (scene.insight) {
      const t = setTimeout(() => setShowInsight(true), 600);
      return () => clearTimeout(t);
    }
  }, [allLinesDone, scene.insight]);

  useEffect(() => {
    if (!isPlaying || !allLinesDone) return;
    if (scene.quiz) {
      setShowQuiz(true);
      return;
    }
    const delay = scene.insight ? 5000 : 2500;
    const timer = setTimeout(goNextScene, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, allLinesDone, scene, goNextScene]);

  useEffect(() => {
    if (!isPlaying || !lineDone || allLinesDone) return;
    const timer = setTimeout(advanceLine, voiceEnabled ? 400 : 800);
    return () => clearTimeout(timer);
  }, [isPlaying, lineDone, allLinesDone, advanceLine, voiceEnabled]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (window.speechSynthesis?.paused) {
        resume();
      }
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === scene.quiz?.correctIndex) addXp(25);
    setShowQuiz(false);
    if (isPlaying) setTimeout(goNextScene, 1000);
  };

  const handlePrevScene = () => {
    if (sceneIndex > 0) {
      stop();
      setSceneIndex((i) => i - 1);
      resetSceneState();
    }
  };

  const handleSkip = () => {
    stop();
    if (!allLinesDone && lineIndex < lines.length - 1) {
      advanceLine();
    } else if (!allLinesDone) {
      setAllLinesDone(true);
    } else {
      goNextScene();
    }
  };

  const actuallySpeaking = isSpeaking && voiceEnabled;

  return (
    <Box sx={{ ...glassStyle, overflow: 'hidden' }}>
      <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoStoriesIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{story.title}</Typography>
          <Typography variant="caption" color="text.secondary">{story.bookReference}</Typography>
        </Box>
        <Tooltip title={voiceEnabled ? 'Mute character voices' : 'Enable character voices'}>
          <IconButton
            onClick={() => {
              if (voiceEnabled) stop();
              setVoiceEnabled((v) => !v);
            }}
            color={voiceEnabled ? 'primary' : 'default'}
            size="small"
          >
            {voiceEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </IconButton>
        </Tooltip>
        <Chip
          label={actuallySpeaking ? '🔊 Speaking...' : voiceEnabled ? 'Voice On' : 'Voice Off'}
          size="small"
          color={actuallySpeaking ? 'success' : 'default'}
          variant="outlined"
        />
        <Chip label={`Scene ${sceneIndex + 1}/${story.scenes.length}`} size="small" color="primary" variant="outlined" />
      </Box>

      {!speechSupported && (
        <Alert severity="warning" sx={{ mx: 2, mt: 1 }}>
          Voice not supported in this browser. Try Chrome or Edge for character narration.
        </Alert>
      )}

      <LinearProgress
        variant="determinate"
        value={((sceneIndex + 1) / story.scenes.length) * 100}
        sx={{ height: 3, bgcolor: 'rgba(255,255,255,0.05)',
          '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #7C4DFF, #00E5FF)' } }}
      />

      <AnimatePresence mode="wait">
        <Box
          key={scene.id}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{ bgcolor: moodColors[scene.mood], borderBottom: `2px solid ${moodBorders[scene.mood]}` }}
        >
          <Box sx={{ px: 3, pt: 2 }}>
            <Typography variant="overline" color="primary.light" sx={{ letterSpacing: 2 }}>{scene.title}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, px: 3, py: 2, flexWrap: 'wrap', minHeight: 120 }}>
            {scene.visuals.map((v, i) => (
              <StoryVisualElement key={`${v.label}-${i}`} visual={v} delay={i * 0.15} />
            ))}
          </Box>

          <Box sx={{
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
            gap: 1, px: 3, py: 2, minHeight: 130,
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.25) 100%)',
          }}>
            {story.characters.map((char) => (
              <CharacterPortrait
                key={char.id}
                character={char}
                isSpeaking={speaker?.id === char.id && !allLinesDone && (actuallySpeaking || isPlaying)}
                isActive={speaker?.id === char.id || completedLines.some((l) => l.characterId === char.id)}
              />
            ))}
          </Box>

          <Box sx={{ px: 3, pb: 2 }}>
            <AnimatePresence mode="wait">
              {currentLine && speaker && !allLinesDone && (
                <Box
                  key={`line-${lineIndex}`}
                  component={motion.div}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  sx={{
                    p: 2.5, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.35)',
                    border: `2px solid ${speaker.color}55`, borderTop: `4px solid ${speaker.color}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Avatar sx={{ bgcolor: speaker.color, width: 32, height: 32, fontSize: '0.9rem' }}>{speaker.avatar}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: speaker.color }}>{speaker.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{speaker.role}</Typography>
                    </Box>
                    <Chip
                      icon={actuallySpeaking ? <VolumeUpIcon sx={{ fontSize: '14px !important' }} /> : <RecordVoiceOverIcon sx={{ fontSize: '14px !important' }} />}
                      label={actuallySpeaking ? 'Speaking...' : 'Waiting'}
                      size="small"
                      sx={{ ml: 'auto', bgcolor: `${speaker.color}22`, color: speaker.color }}
                    />
                  </Box>
                  <TypewriterText
                    text={currentLine.text}
                    speed={actuallySpeaking ? 35 : isPlaying ? 22 : 8}
                    active={isPlaying}
                    onComplete={() => { if (!voiceEnabled) setLineDone(true); }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Line {lineIndex + 1} of {lines.length}
                  </Typography>
                </Box>
              )}

              {completedLines.length > 0 && !allLinesDone && (
                <Box sx={{ mt: 1, opacity: 0.35 }}>
                  {completedLines.slice(-1).map((line, i) => {
                    const char = story.characters.find((c) => c.id === line.characterId);
                    return (
                      <Typography key={i} variant="caption" color="text.secondary">
                        {char?.avatar} {char?.name}: "{line.text.slice(0, 60)}{line.text.length > 60 ? '...' : ''}"
                      </Typography>
                    );
                  })}
                </Box>
              )}
            </AnimatePresence>

            <Collapse in={showInsight && !!scene.insight}>
              {insightSpeaker && (
                <Box component={motion.div} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(255, 215, 64, 0.08)', border: '1px solid rgba(255, 215, 64, 0.35)' }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Avatar sx={{ bgcolor: insightSpeaker.color, width: 36, height: 36 }}>{insightSpeaker.avatar}</Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 700 }}>
                        💡 {insightSpeaker.name} explains:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>{scene.insight}</Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Collapse>

            <Collapse in={showQuiz && !!scene.quiz}>
              {scene.quiz && (
                <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(124, 77, 255, 0.1)', border: '1px solid rgba(124, 77, 255, 0.3)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    🤔 {story.characters[0]?.avatar} What would YOU do?
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1.5 }}>{scene.quiz.question}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {scene.quiz.options.map((opt, i) => (
                      <Button key={i} variant={quizAnswer === i ? 'contained' : 'outlined'} size="small"
                        onClick={() => setQuizAnswer(i)} sx={{ justifyContent: 'flex-start', textAlign: 'left' }}>
                        {opt}
                      </Button>
                    ))}
                  </Box>
                  {quizAnswer !== null && (
                    <Alert severity={quizAnswer === scene.quiz.correctIndex ? 'success' : 'error'} sx={{ mt: 1 }}>
                      {scene.quiz.explanation}
                    </Alert>
                  )}
                  <Button variant="contained" size="small" onClick={handleQuizSubmit} sx={{ mt: 1 }} disabled={quizAnswer === null}>
                    Continue Story
                  </Button>
                </Box>
              )}
            </Collapse>
          </Box>
        </Box>
      </AnimatePresence>

      {isLastScene && allLinesDone && (
        <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          sx={{ p: 3, bgcolor: 'rgba(0, 229, 255, 0.08)', borderTop: '2px solid rgba(0, 229, 255, 0.3)' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar sx={{ bgcolor: moralSpeaker.color, width: 48, height: 48, fontSize: '1.5rem' }}>{moralSpeaker.avatar}</Avatar>
            <Box>
              <Typography variant="subtitle2" color="secondary.main" sx={{ fontWeight: 700 }}>
                📜 {moralSpeaker.name} concludes:
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic' }}>"{story.moral}"</Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <IconButton onClick={handlePrevScene} disabled={sceneIndex === 0}><SkipPreviousIcon /></IconButton>
        <IconButton onClick={handlePlayPause}
          sx={{ bgcolor: 'primary.main', color: '#fff', width: 52, height: 52, '&:hover': { bgcolor: 'primary.dark' } }}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={handleSkip}><SkipNextIcon /></IconButton>
      </Box>

      {!isPlaying && lineIndex === 0 && !allLinesDone && (
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', pb: 2 }}>
          Press ▶ Play — characters will speak aloud (use headphones for best experience)
        </Typography>
      )}
    </Box>
  );
}
