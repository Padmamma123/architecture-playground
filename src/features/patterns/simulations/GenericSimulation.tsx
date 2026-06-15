import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { PatternDetail } from '../../../types';

interface GenericSimulationProps {
  pattern: PatternDetail;
}

export default function GenericSimulation({ pattern }: GenericSimulationProps) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        component={motion.div}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        sx={{ fontSize: '4rem', mb: 2 }}
      >
        {pattern.category === 'creational' ? '🏭' : pattern.category === 'structural' ? '🏗️' : '🔄'}
      </Box>
      <Typography variant="h6" gutterBottom>{pattern.name} Pattern</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
        {pattern.purpose}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        {pattern.steps.map((step, i) => (
          <Box
            key={step.title}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            sx={{
              p: 2, borderRadius: 2, minWidth: 140,
              bgcolor: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.3)',
            }}
          >
            <Typography variant="caption" color="primary.light">Step {i + 1}</Typography>
            <Typography variant="subtitle2">{step.title}</Typography>
            <Typography variant="caption" color="text.secondary">{step.description}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
