import { Grid, Box, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dashboardSections } from '../../data/patterns';
import { useAppStore } from '../../store/useAppStore';
import PatternCard from '../../components/ui/PatternCard';
import GlassCard from '../../components/ui/GlassCard';
import SectionHeader from '../../components/ui/SectionHeader';

export default function Dashboard() {
  const navigate = useNavigate();
  const { xp, level, badges, completed } = useAppStore();
  const unlockedBadges = badges.filter((b) => b.unlocked);

  const routes: Record<string, string> = {
    'system-design': '/system-design',
    solid: '/solid',
    creational: '/patterns/creational',
    structural: '/patterns/structural',
    behavioral: '/patterns/behavioral',
    architecture: '/architecture',
    quiz: '/quiz',
    comparison: '/comparison',
    'case-studies': '/case-studies',
  };

  return (
    <Box>
      <SectionHeader
        title="Architecture Playground"
        subtitle="Learn SOLID Principles, Design Patterns, and System Design through visual simulations"
      />

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'XP Points', value: xp, icon: '⚡', color: '#7C4DFF' },
          { label: 'Level', value: level, icon: '🎮', color: '#00E5FF' },
          { label: 'Completed', value: completed.length, icon: '✅', color: '#00E676' },
          { label: 'Badges', value: unlockedBadges.length, icon: '🏆', color: '#FFD740' },
        ].map((stat, i) => (
          <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
            <GlassCard hover={false} sx={{ textAlign: 'center' }}>
              <Box component={motion.div} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                <Typography variant="h4">{stat.icon}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      {unlockedBadges.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>🏅 Achievements</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {unlockedBadges.map((b) => (
              <Chip key={b.id} label={`${b.icon} ${b.name}`} sx={{ bgcolor: 'rgba(255, 215, 64, 0.15)', color: 'warning.main' }} />
            ))}
          </Box>
        </Box>
      )}

      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>Learning Paths</Typography>
      <Grid container spacing={3}>
        {dashboardSections.map((section, i) => (
          <Grid key={section.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <PatternCard
              item={section}
              index={i}
              onClick={() => navigate(routes[section.id] || '/')}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
