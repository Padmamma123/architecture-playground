import { useState } from 'react';
import { Box, Typography, Grid, Chip, Tabs, Tab } from '@mui/material';
import { comparisons } from '../../data/comparisons';
import { difficultyColors } from '../../theme/theme';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';

export default function ComparisonLab() {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState(0);
  const comp = comparisons[selected];

  const sections = ['Purpose', 'Complexity', 'Advantages', 'Disadvantages', 'Use Cases'];

  return (
    <Box>
      <SectionHeader
        title="Pattern Comparison Lab"
        subtitle="Compare similar patterns side-by-side to make better design decisions"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Comparison Lab' }]}
      />

      <Tabs
        value={selected}
        onChange={(_, v) => { setSelected(v); setTab(0); }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        {comparisons.map((c) => (
          <Tab key={c.id} label={`${c.patternA} vs ${c.patternB}`} />
        ))}
      </Tabs>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6 }}>
          <GlassCard hover={false} sx={{ textAlign: 'center', borderColor: 'rgba(124,77,255,0.3)' }}>
            <Typography variant="h5" color="primary.main">{comp.patternA}</Typography>
          </GlassCard>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <GlassCard hover={false} sx={{ textAlign: 'center', borderColor: 'rgba(0,229,255,0.3)' }}>
            <Typography variant="h5" color="secondary.main">{comp.patternB}</Typography>
          </GlassCard>
        </Grid>
      </Grid>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        {sections.map((s) => <Tab key={s} label={s} />)}
      </Tabs>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard hover={false}>
            <Typography variant="subtitle2" color="primary.main" gutterBottom>{comp.patternA}</Typography>
            {tab === 0 && <Typography>{comp.purpose.a}</Typography>}
            {tab === 1 && (
              <Chip label={comp.complexity.a} sx={{ bgcolor: `${difficultyColors[comp.complexity.a]}22`, color: difficultyColors[comp.complexity.a], textTransform: 'capitalize' }} />
            )}
            {tab === 2 && comp.advantages.a.map((a) => <Typography key={a} variant="body2" sx={{ py: 0.5 }}>✅ {a}</Typography>)}
            {tab === 3 && comp.disadvantages.a.map((d) => <Typography key={d} variant="body2" sx={{ py: 0.5 }}>⚠️ {d}</Typography>)}
            {tab === 4 && comp.useCases.a.map((u) => <Chip key={u} label={u} size="small" sx={{ m: 0.3 }} />)}
          </GlassCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard hover={false}>
            <Typography variant="subtitle2" color="secondary.main" gutterBottom>{comp.patternB}</Typography>
            {tab === 0 && <Typography>{comp.purpose.b}</Typography>}
            {tab === 1 && (
              <Chip label={comp.complexity.b} sx={{ bgcolor: `${difficultyColors[comp.complexity.b]}22`, color: difficultyColors[comp.complexity.b], textTransform: 'capitalize' }} />
            )}
            {tab === 2 && comp.advantages.b.map((a) => <Typography key={a} variant="body2" sx={{ py: 0.5 }}>✅ {a}</Typography>)}
            {tab === 3 && comp.disadvantages.b.map((d) => <Typography key={d} variant="body2" sx={{ py: 0.5 }}>⚠️ {d}</Typography>)}
            {tab === 4 && comp.useCases.b.map((u) => <Chip key={u} label={u} size="small" sx={{ m: 0.3 }} />)}
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
