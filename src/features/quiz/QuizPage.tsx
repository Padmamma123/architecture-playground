import { useState } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel, Alert, Chip, LinearProgress } from '@mui/material';
import { quizQuestions } from '../../data/quizzes';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';

export default function QuizPage() {
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const { addXp, unlockBadge } = useAppStore();

  const filtered = difficulty === 'all'
    ? quizQuestions
    : quizQuestions.filter((q) => q.difficulty === difficulty);

  const question = filtered[current];

  const handleSubmit = () => {
    if (selected === null) return;
    setShowResult(true);
    if (selected === question.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current < filtered.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      const pct = Math.round((score / filtered.length) * 100);
      addXp(score * 25);
      if (pct === 100) unlockBadge('quiz-champion');
    }
  };

  if (finished) {
    const pct = Math.round((score / filtered.length) * 100);
    return (
      <Box sx={{ textAlign: 'center' }}>
        <SectionHeader title="Quiz Complete!" subtitle={`You scored ${score}/${filtered.length} (${pct}%)`} />
        <GlassCard hover={false} sx={{ maxWidth: 400, mx: 'auto' }}>
          <Typography variant="h2" sx={{ mb: 2 }}>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }} color={pct >= 80 ? 'success.main' : 'warning.main'}>
            {pct}%
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>+{score * 25} XP earned</Typography>
          <Button variant="contained" onClick={() => { setCurrent(0); setScore(0); setFinished(false); setSelected(null); setShowResult(false); }}>
            Retry Quiz
          </Button>
        </GlassCard>
      </Box>
    );
  }

  return (
    <Box>
      <SectionHeader
        title="Design Pattern Quiz"
        subtitle="Test your knowledge with interactive questions"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Quiz' }]}
      />

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
          <Chip
            key={d}
            label={d === 'all' ? 'All Levels' : d}
            onClick={() => { setDifficulty(d); setCurrent(0); setScore(0); setSelected(null); setShowResult(false); }}
            color={difficulty === d ? 'primary' : 'default'}
            variant={difficulty === d ? 'filled' : 'outlined'}
            sx={{ textTransform: 'capitalize', cursor: 'pointer' }}
          />
        ))}
      </Box>

      <LinearProgress
        variant="determinate"
        value={((current + 1) / filtered.length) * 100}
        sx={{ mb: 3, height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)',
          '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #7C4DFF, #00E5FF)' } }}
      />

      {question && (
        <GlassCard hover={false}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Chip label={`Question ${current + 1}/${filtered.length}`} size="small" />
            <Chip label={question.difficulty} size="small" color="secondary" sx={{ textTransform: 'capitalize' }} />
          </Box>

          <Typography variant="h6" sx={{ mb: 3 }}>{question.question}</Typography>

          <RadioGroup value={selected} onChange={(_, v) => !showResult && setSelected(Number(v))}>
            {question.options.map((opt, i) => (
              <FormControlLabel
                key={i}
                value={i}
                control={<Radio />}
                label={opt}
                sx={{
                  mb: 1, p: 1.5, borderRadius: 2, width: '100%',
                  bgcolor: showResult
                    ? i === question.correctIndex ? 'rgba(0,230,118,0.15)' : i === selected ? 'rgba(255,82,82,0.15)' : 'transparent'
                    : selected === i ? 'rgba(124,77,255,0.1)' : 'transparent',
                  border: '1px solid',
                  borderColor: showResult && i === question.correctIndex ? 'success.main' : 'rgba(255,255,255,0.06)',
                }}
              />
            ))}
          </RadioGroup>

          {showResult && (
            <Alert severity={selected === question.correctIndex ? 'success' : 'error'} sx={{ mt: 2 }}>
              {question.explanation}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            {!showResult ? (
              <Button variant="contained" onClick={handleSubmit} disabled={selected === null}>Submit Answer</Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                {current < filtered.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            )}
          </Box>
        </GlassCard>
      )}
    </Box>
  );
}
