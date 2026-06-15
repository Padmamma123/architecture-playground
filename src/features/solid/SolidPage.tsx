import { useParams, useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, Button, Chip } from '@mui/material';
import { useState } from 'react';
import { solidPrinciples } from '../../data/solid';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../../components/ui/SectionHeader';
import ProblemSection from './components/ProblemSection';
import BreakdownSection from './components/BreakdownSection';
import SolutionSection from './components/SolutionSection';
import SandboxSection from './components/SandboxSection';
import CodeComparisonSection from './components/CodeComparisonSection';
import RealWorldSection from './components/RealWorldSection';
import StoryNarrator from '../../components/story/StoryNarrator';
import { getStoryForPattern } from '../../data/stories';

const sections = ['Story', 'Problem', 'Breakdown', 'Solution', 'Sandbox', 'Code', 'Real World'];

export default function SolidListPage() {
  const navigate = useNavigate();
  const { setProgress } = useAppStore();

  return (
    <Box>
      <SectionHeader
        title="SOLID Principles"
        subtitle="Master the five foundational principles of object-oriented design"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'SOLID Principles' }]}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {solidPrinciples.map((p) => (
          <Box
            key={p.id}
            onClick={() => { setProgress('solid', 10); navigate(`/solid/${p.id}`); }}
            sx={{
              p: 3, borderRadius: 3, cursor: 'pointer',
              bgcolor: 'rgba(18, 24, 38, 0.55)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', gap: 2,
              transition: 'all 0.3s',
              '&:hover': { borderColor: 'rgba(124, 77, 255, 0.4)', transform: 'translateX(8px)' },
            }}
          >
            <Chip label={p.acronym} color="primary" sx={{ width: 40, height: 40, fontSize: '1.2rem', fontWeight: 700 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ fontWeight: 600 }}>{p.name}</Box>
              <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{p.tagline}</Box>
            </Box>
            <Chip label={p.difficulty} size="small" variant="outlined" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function SolidDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const { markComplete, setProgress } = useAppStore();
  const principle = solidPrinciples.find((p) => p.id === id);
  const story = getStoryForPattern(id || '');

  if (!principle) {
    return <Box>Principle not found</Box>;
  }

  const handleComplete = () => {
    markComplete(`solid-${principle.id}`);
    setProgress('solid', Math.min(100, (solidPrinciples.findIndex((p) => p.id === id) + 1) * 20));
    navigate('/solid');
  };

  return (
    <Box>
      <SectionHeader
        title={`${principle.acronym} — ${principle.name}`}
        subtitle={principle.tagline}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'SOLID', path: '/solid' },
          { label: principle.name },
        ]}
      />

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {sections.map((s) => <Tab key={s} label={s} />)}
      </Tabs>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {story && tab === 0 && <StoryNarrator story={story} onComplete={() => setProgress('solid', 15)} />}
        {tab === (story ? 1 : 0) && <ProblemSection principle={principle} />}
        {tab === (story ? 2 : 1) && <BreakdownSection principle={principle} />}
        {tab === (story ? 3 : 2) && <SolutionSection principle={principle} />}
        {tab === (story ? 4 : 3) && <SandboxSection principle={principle} />}
        {tab === (story ? 5 : 4) && <CodeComparisonSection principle={principle} />}
        {tab === (story ? 6 : 5) && <RealWorldSection principle={principle} />}
      </Box>

      {tab === (story ? 6 : 5) && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="contained" color="success" size="large" onClick={handleComplete}>
            Mark as Complete (+100 XP)
          </Button>
        </Box>
      )}
    </Box>
  );
}
