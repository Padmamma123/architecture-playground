import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, Chip, Button, Grid, Alert, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import { getProblemById } from '../../data/systemDesign';
import { getSystemDesignStory } from '../../data/stories';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import StoryNarrator from '../../components/story/StoryNarrator';

export default function DesignProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const { markComplete } = useAppStore();
  const problem = getProblemById(id || '');
  const story = getSystemDesignStory(id || '');

  if (!problem) return <Typography>Problem not found</Typography>;

  const handleComplete = () => {
    markComplete(`sd-problem-${problem.id}`);
    navigate('/system-design');
  };

  return (
    <Box>
      <SectionHeader
        title={`${problem.icon} Design: ${problem.name}`}
        subtitle={problem.description}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Architect Academy', path: '/system-design' },
          { label: problem.name },
        ]}
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        {story && <Tab label="📖 Story" />}
        <Tab label="Requirements" />
        <Tab label="Step-by-Step Design" />
        <Tab label="Architecture" />
        <Tab label="Pitfalls" />
      </Tabs>

      {story && tab === 0 && <StoryNarrator story={story} />}

      {tab === (story ? 1 : 0) && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <GlassCard hover={false}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Functional Requirements</Typography>
              {problem.requirements.functional.map((r) => (
                <Typography key={r} variant="body2" sx={{ py: 0.5 }}>✅ {r}</Typography>
              ))}
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <GlassCard hover={false}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Non-Functional Requirements</Typography>
              {problem.requirements.nonFunctional.map((r) => (
                <Typography key={r} variant="body2" sx={{ py: 0.5 }}>⚡ {r}</Typography>
              ))}
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <GlassCard hover={false}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>📊 Capacity Estimates</Typography>
              <Grid container spacing={2}>
                {Object.entries(problem.capacity).map(([key, val]) => (
                  <Grid key={key} size={{ xs: 6, md: 3 }}>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(0,229,255,0.08)', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{key}</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'secondary.main' }}>{val}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </GlassCard>
          </Grid>
        </Grid>
      )}

      {tab === (story ? 2 : 1) && (
        <GlassCard hover={false}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {problem.steps.map((step, i) => (
              <Step key={step.title}>
                <StepLabel onClick={() => setActiveStep(i)} sx={{ cursor: 'pointer' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{step.title}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>{step.content}</Typography>
                  <Alert severity="warning" sx={{ mb: 2, bgcolor: 'rgba(255,215,64,0.08)' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>❓ Why?</Typography>
                    <Typography variant="body2">{step.why}</Typography>
                  </Alert>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" disabled={i === 0} onClick={() => setActiveStep(i - 1)}>Back</Button>
                    <Button size="small" variant="contained" onClick={() => setActiveStep(Math.min(i + 1, problem.steps.length - 1))}>
                      {i < problem.steps.length - 1 ? 'Next Step' : 'Done'}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </GlassCard>
      )}

      {tab === (story ? 3 : 2) && (
        <Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {problem.architecture.map((comp) => (
              <Grid key={comp.component} size={{ xs: 12, sm: 6 }}>
                <GlassCard hover={false}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.light' }}>{comp.component}</Typography>
                  <Typography variant="body2" sx={{ my: 0.5 }}>{comp.role}</Typography>
                  <Typography variant="caption" color="text.secondary">Why: {comp.why}</Typography>
                </GlassCard>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {problem.patterns.map((p) => <Chip key={p} label={p} color="secondary" variant="outlined" />)}
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Button variant="outlined" sx={{ mr: 2 }} onClick={() => navigate('/case-studies')}>View Diagram →</Button>
            <Button variant="contained" color="success" onClick={handleComplete}>Mark Complete (+100 XP)</Button>
          </Box>
        </Box>
      )}

      {tab === (story ? 4 : 3) && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {problem.pitfalls.map((p) => (
            <Alert key={p} severity="error" sx={{ bgcolor: 'rgba(255,82,82,0.08)' }}>
              <Typography variant="body1">🚫 {p}</Typography>
            </Alert>
          ))}
        </Box>
      )}
    </Box>
  );
}
