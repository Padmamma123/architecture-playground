import { Box, Typography, Grid, Chip, LinearProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import { architectRoadmap, systemDesignTopics, designProblems } from '../../data/systemDesign';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import { difficultyColors } from '../../theme/theme';

export default function SystemDesignHub() {
  const navigate = useNavigate();
  const { completed } = useAppStore();

  const totalTopics = systemDesignTopics.length + designProblems.length;
  const doneTopics = completed.filter((c) => c.startsWith('sd-')).length;
  const pct = Math.round((doneTopics / totalTopics) * 100);

  return (
    <Box>
      <SectionHeader
        title="System Design Architect Academy"
        subtitle="Your structured path from fundamentals to designing systems like Instagram, Uber, and Netflix"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Architect Academy' }]}
      />

      <GlassCard hover={false} sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <SchoolIcon sx={{ fontSize: 56, color: 'primary.main' }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Become a Strong Architect</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              4 phases · {systemDesignTopics.length} concepts · {designProblems.length} design problems · interactive tools
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinearProgress variant="determinate" value={pct} sx={{ flex: 1, height: 8, borderRadius: 4,
                '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #7C4DFF, #00E5FF)' } }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{pct}%</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="outlined" onClick={() => navigate('/system-design/calculator')}>🧮 Capacity Calculator</Button>
            <Button variant="outlined" onClick={() => navigate('/system-design/decisions')}>⚖️ Decision Lab</Button>
            <Button variant="contained" onClick={() => navigate('/system-design/topic/scalability')}>Start Learning →</Button>
          </Box>
        </Box>
      </GlassCard>

      {architectRoadmap.map((phase) => {
        const topics = systemDesignTopics.filter((t) => t.phase === phase.phase);
        const problems = phase.phase === 'interview' ? designProblems : [];

        return (
          <Box key={phase.phase} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h4">{phase.icon}</Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{phase.label}</Typography>
                <Typography variant="caption" color="text.secondary">{phase.description}</Typography>
              </Box>
            </Box>

            <Grid container spacing={2}>
              {topics.map((topic, i) => (
                <Grid key={topic.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <GlassCard onClick={() => navigate(`/system-design/topic/${topic.id}`)}>
                    <Box component={motion.div} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h4">{topic.icon}</Typography>
                        {completed.includes(`sd-topic-${topic.id}`) && <Chip label="✅" size="small" color="success" />}
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{topic.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>{topic.subtitle}</Typography>
                      <Chip label={topic.difficulty} size="small" sx={{ bgcolor: `${difficultyColors[topic.difficulty]}22`, color: difficultyColors[topic.difficulty], textTransform: 'capitalize' }} />
                    </Box>
                  </GlassCard>
                </Grid>
              ))}

              {problems.map((problem, i) => (
                <Grid key={problem.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <GlassCard onClick={() => navigate(`/system-design/problem/${problem.id}`)} sx={{ borderColor: 'rgba(0, 229, 255, 0.2)' }}>
                    <Box component={motion.div} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h4">{problem.icon}</Typography>
                        {completed.includes(`sd-problem-${problem.id}`) && <Chip label="✅" size="small" color="success" />}
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{problem.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>{problem.description.slice(0, 80)}...</Typography>
                      <Chip label={problem.difficulty} size="small" color="secondary" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                    </Box>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
}
