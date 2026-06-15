import { Box, Typography, Grid, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import type { SolidPrinciple } from '../../../types';
import GlassCard from '../../../components/ui/GlassCard';

interface RealWorldSectionProps {
  principle: SolidPrinciple;
}

export default function RealWorldSection({ principle }: RealWorldSectionProps) {
  return (
    <GlassCard hover={false}>
      <Typography variant="h5" gutterBottom>
        Section 6: Real World Examples
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        See how tech giants apply {principle.acronym === 'S' ? 'SRP' : principle.name.split(' ')[0]}
      </Typography>
      <Grid container spacing={2}>
        {principle.realWorld.map((example, i) => (
          <Grid key={example.company} size={{ xs: 12, sm: 6 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              sx={{
                display: 'flex', gap: 2, p: 2, borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Avatar sx={{ bgcolor: 'primary.dark', width: 48, height: 48, fontSize: '1.5rem' }}>
                {example.icon}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{example.company}</Typography>
                <Typography variant="body2" color="text.secondary">{example.usage}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </GlassCard>
  );
}
