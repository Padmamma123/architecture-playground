import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, Chip, Button, Grid, Alert, Divider } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/LightbulbOutlined';
import { getTopicById } from '../../data/systemDesign';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import { difficultyColors } from '../../theme/theme';

export default function TopicPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const { markComplete } = useAppStore();
  const topic = getTopicById(id || '');

  if (!topic) return <Typography>Topic not found</Typography>;

  const handleComplete = () => {
    markComplete(`sd-topic-${topic.id}`);
    navigate('/system-design');
  };

  return (
    <Box>
      <SectionHeader
        title={`${topic.icon} ${topic.title}`}
        subtitle={topic.subtitle}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Architect Academy', path: '/system-design' },
          { label: topic.title },
        ]}
      />

      <Chip label={topic.difficulty} sx={{ mb: 2, bgcolor: `${difficultyColors[topic.difficulty]}22`, color: difficultyColors[topic.difficulty], textTransform: 'capitalize' }} />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="What & Why" />
        <Tab label="How It Works" />
        <Tab label="Real World" />
        <Tab label="Architect Tips" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <GlassCard hover={false}>
              <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 700 }}>What is it?</Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.9 }}>{topic.whatItIs}</Typography>
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <GlassCard hover={false} sx={{ borderColor: 'rgba(255, 215, 64, 0.3)' }}>
              <Typography variant="h6" color="warning.main" gutterBottom sx={{ fontWeight: 700 }}>Why does it matter?</Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.9 }}>{topic.whyItMatters}</Typography>
            </GlassCard>
          </Grid>
          {topic.tradeoffs && (
            <Grid size={{ xs: 12 }}>
              <GlassCard hover={false}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Trade-offs</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2" color="success.main" gutterBottom>✅ Pros</Typography>
                    {topic.tradeoffs.pros.map((p) => <Typography key={p} variant="body2" sx={{ py: 0.3 }}>• {p}</Typography>)}
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2" color="error.main" gutterBottom>⚠️ Cons</Typography>
                    {topic.tradeoffs.cons.map((c) => <Typography key={c} variant="body2" sx={{ py: 0.3 }}>• {c}</Typography>)}
                  </Grid>
                </Grid>
              </GlassCard>
            </Grid>
          )}
        </Grid>
      )}

      {tab === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {topic.howItWorks.map((step, i) => (
            <GlassCard key={step.step} hover={false}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Chip label={i + 1} color="primary" sx={{ minWidth: 36, fontWeight: 700 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{step.step}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.8 }}>{step.detail}</Typography>
                </Box>
              </Box>
            </GlassCard>
          ))}
        </Box>
      )}

      {tab === 2 && (
        <Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {topic.realWorld.map((rw) => (
              <Grid key={rw} size={{ xs: 12, sm: 6 }}>
                <GlassCard hover={false}>
                  <Typography variant="body1">🌍 {rw}</Typography>
                </GlassCard>
              </Grid>
            ))}
          </Grid>
          {topic.keyNumbers && (
            <GlassCard hover={false}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>📊 Key Numbers to Remember</Typography>
              <Grid container spacing={2}>
                {topic.keyNumbers.map((kn) => (
                  <Grid key={kn.label} size={{ xs: 6, md: 4 }}>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(124,77,255,0.1)', textAlign: 'center' }}>
                      <Typography variant="h5" color="primary.light" sx={{ fontWeight: 700 }}>{kn.value}</Typography>
                      <Typography variant="caption" color="text.secondary">{kn.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </GlassCard>
          )}
        </Box>
      )}

      {tab === 3 && (
        <GlassCard hover={false}>
          <Alert severity="info" icon={<LightbulbIcon />} sx={{ mb: 3, bgcolor: 'rgba(124,77,255,0.1)' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>💡 Architect Tip</Typography>
            <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.8 }}>{topic.architectTip}</Typography>
          </Alert>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Button variant="contained" color="success" size="large" onClick={handleComplete}>
              Mark as Complete (+100 XP)
            </Button>
          </Box>
        </GlassCard>
      )}
    </Box>
  );
}
