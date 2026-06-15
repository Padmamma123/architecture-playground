import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, Chip, Button, Grid } from '@mui/material';
import Editor from '@monaco-editor/react';
import { getPatternById } from '../../data/patterns';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import FactorySimulation from './simulations/FactorySimulation';
import DecoratorSimulation from './simulations/DecoratorSimulation';
import AdapterSimulation from './simulations/AdapterSimulation';
import ObserverSimulation from './simulations/ObserverSimulation';
import StrategySimulation from './simulations/StrategySimulation';
import ChainSimulation from './simulations/ChainSimulation';
import GenericSimulation from './simulations/GenericSimulation';
import StoryNarrator from '../../components/story/StoryNarrator';
import { getStoryForPattern } from '../../data/stories';

function getSimulation(type: string, pattern: ReturnType<typeof getPatternById>) {
  if (!pattern) return null;
  switch (type) {
    case 'factory': return <FactorySimulation />;
    case 'decorator': return <DecoratorSimulation />;
    case 'adapter': return <AdapterSimulation />;
    case 'observer': return <ObserverSimulation />;
    case 'strategy': return <StrategySimulation />;
    case 'chain': return <ChainSimulation />;
    default: return <GenericSimulation pattern={pattern} />;
  }
}

export default function PatternDetailPage() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [step, setStep] = useState(0);
  const { markComplete, setProgress } = useAppStore();
  const pattern = getPatternById(id || '');
  const story = getStoryForPattern(id || '');

  if (!pattern) return <Typography>Pattern not found</Typography>;

  const handleComplete = () => {
    markComplete(`pattern-${pattern.id}`);
    setProgress(category || '', 50);
    navigate(`/patterns/${category}`);
  };

  return (
    <Box>
      <SectionHeader
        title={pattern.name}
        subtitle={pattern.description}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: category || '', path: `/patterns/${category}` },
          { label: pattern.name },
        ]}
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        {story && <Tab label="📖 Story Mode" />}
        <Tab label="Visual Simulation" />
        <Tab label="Step by Step" />
        <Tab label="Code Example" />
        <Tab label="Real World" />
      </Tabs>

      {story && tab === 0 && (
        <StoryNarrator story={story} onComplete={() => setProgress(category || '', 30)} />
      )}

      {tab === (story ? 1 : 0) && (
        <GlassCard hover={false} sx={{ minHeight: 400 }}>
          {getSimulation(pattern.simulationType, pattern)}
        </GlassCard>
      )}

      {tab === (story ? 2 : 1) && (
        <GlassCard hover={false}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Chip label={`Step ${step + 1} of ${pattern.steps.length}`} color="primary" />
          </Box>
          <Box sx={{ p: 4, borderRadius: 2, bgcolor: 'rgba(124,77,255,0.1)', textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" gutterBottom>{pattern.steps[step]?.title}</Typography>
            <Typography color="text.secondary">{pattern.steps[step]?.description}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="outlined" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Previous</Button>
            <Button
              variant="contained"
              disabled={step >= pattern.steps.length - 1}
              onClick={() => setStep((s) => Math.min(s + 1, pattern.steps.length - 1))}
            >
              Next Step
            </Button>
          </Box>
        </GlassCard>
      )}

      {tab === (story ? 3 : 2) && (
        <Grid container spacing={2}>
          {pattern.code.bad && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="error.main" gutterBottom>Without Pattern</Typography>
              <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,82,82,0.3)' }}>
                <Editor height="350px" language="typescript" theme="vs-dark" value={pattern.code.bad}
                  options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} />
              </Box>
            </Grid>
          )}
          <Grid size={{ xs: 12, md: pattern.code.bad ? 6 : 12 }}>
            <Typography variant="subtitle2" color="success.main" gutterBottom>With Pattern</Typography>
            <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(0,230,118,0.3)' }}>
              <Editor height="350px" language="typescript" theme="vs-dark" value={pattern.code.good}
                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} />
            </Box>
          </Grid>
        </Grid>
      )}

      {tab === (story ? 4 : 3) && (
        <GlassCard hover={false}>
          <Typography variant="h6" gutterBottom>Real World Applications</Typography>
          <Grid container spacing={2}>
            {pattern.realWorld.map((rw) => (
              <Grid key={rw} size={{ xs: 12, sm: 4 }}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Typography variant="subtitle2">{rw}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="contained" color="success" onClick={handleComplete}>
              Mark as Complete (+100 XP)
            </Button>
          </Box>
        </GlassCard>
      )}
    </Box>
  );
}
