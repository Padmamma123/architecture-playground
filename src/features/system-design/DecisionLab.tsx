import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Alert } from '@mui/material';
import { architectDecisions } from '../../data/systemDesign';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';

export default function DecisionLab() {
  const [selected, setSelected] = useState(0);
  const [side, setSide] = useState<'a' | 'b' | null>(null);
  const decision = architectDecisions[selected];

  return (
    <Box>
      <SectionHeader
        title="Architect Decision Lab"
        subtitle="Learn how senior architects choose between competing options — with clear reasoning"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Architect Academy', path: '/system-design' }, { label: 'Decision Lab' }]}
      />

      <Tabs value={selected} onChange={(_, v) => { setSelected(v); setSide(null); }} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
        {architectDecisions.map((d) => <Tab key={d.id} label={d.question} />)}
      </Tabs>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 3 }}>
        {decision.question}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard hover={false} onClick={() => setSide('a')} sx={{
            borderColor: side === 'a' ? 'primary.main' : undefined,
            borderWidth: side === 'a' ? 2 : 1,
            cursor: 'pointer',
          }}>
            <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 700 }}>{decision.optionA.label}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>When: {decision.optionA.when}</Typography>
            <Typography variant="subtitle2" color="success.main" gutterBottom>Pros</Typography>
            {decision.optionA.pros.map((p) => <Typography key={p} variant="body2" sx={{ py: 0.2 }}>✅ {p}</Typography>)}
            <Typography variant="subtitle2" color="error.main" gutterBottom sx={{ mt: 1 }}>Cons</Typography>
            {decision.optionA.cons.map((c) => <Typography key={c} variant="body2" sx={{ py: 0.2 }}>⚠️ {c}</Typography>)}
          </GlassCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard hover={false} onClick={() => setSide('b')} sx={{
            borderColor: side === 'b' ? 'secondary.main' : undefined,
            borderWidth: side === 'b' ? 2 : 1,
            cursor: 'pointer',
          }}>
            <Typography variant="h6" color="secondary.main" gutterBottom sx={{ fontWeight: 700 }}>{decision.optionB.label}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>When: {decision.optionB.when}</Typography>
            <Typography variant="subtitle2" color="success.main" gutterBottom>Pros</Typography>
            {decision.optionB.pros.map((p) => <Typography key={p} variant="body2" sx={{ py: 0.2 }}>✅ {p}</Typography>)}
            <Typography variant="subtitle2" color="error.main" gutterBottom sx={{ mt: 1 }}>Cons</Typography>
            {decision.optionB.cons.map((c) => <Typography key={c} variant="body2" sx={{ py: 0.2 }}>⚠️ {c}</Typography>)}
          </GlassCard>
        </Grid>
      </Grid>

      {side && (
        <Alert severity="success" sx={{ mt: 3, bgcolor: 'rgba(0,230,118,0.08)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>🏛️ Senior Architect Verdict</Typography>
          <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.8 }}>{decision.verdict}</Typography>
        </Alert>
      )}

      {!side && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
          👆 Click an option to see the architect's verdict
        </Typography>
      )}
    </Box>
  );
}
