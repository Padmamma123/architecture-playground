import { Box, Typography, Chip, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import type { PatternItem } from '../../types';
import { difficultyColors } from '../../theme/theme';
import { useAppStore } from '../../store/useAppStore';
import GlassCard from './GlassCard';

interface PatternCardProps {
  item: PatternItem;
  onClick: () => void;
  index?: number;
}

export default function PatternCard({ item, onClick, index = 0 }: PatternCardProps) {
  const progress = useAppStore((s) => s.progress[item.id] ?? 0);
  const completed = useAppStore((s) => s.completed.includes(item.id));

  return (
    <GlassCard onClick={onClick} sx={{ height: '100%' }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h3" sx={{ fontSize: '2.5rem' }}>{item.icon}</Typography>
          {completed && (
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 28 }} />
          )}
        </Box>

        <Typography variant="h6" gutterBottom>{item.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {item.description}
        </Typography>

        <Chip
          label={item.difficulty}
          size="small"
          sx={{
            bgcolor: `${difficultyColors[item.difficulty]}22`,
            color: difficultyColors[item.difficulty],
            mb: 1.5,
            textTransform: 'capitalize',
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {item.useCases.slice(0, 3).map((uc) => (
            <Chip key={uc} label={uc} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress
            variant="determinate"
            value={completed ? 100 : progress}
            sx={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.05)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: 'linear-gradient(90deg, #7C4DFF, #00E5FF)',
              },
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {completed ? '100%' : `${progress}%`}
          </Typography>
        </Box>
      </Box>
    </GlassCard>
  );
}
