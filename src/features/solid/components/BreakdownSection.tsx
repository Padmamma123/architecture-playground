import { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { motion, AnimatePresence } from 'framer-motion';
import type { SolidPrinciple } from '../../../types';
import GlassCard from '../../../components/ui/GlassCard';

interface BreakdownSectionProps {
  principle: SolidPrinciple;
}

export default function BreakdownSection({ principle }: BreakdownSectionProps) {
  const [activeAction, setActiveAction] = useState<number | null>(null);
  const [broken, setBroken] = useState(false);

  const handleAction = (index: number) => {
    setActiveAction(index);
    setBroken(true);
  };

  return (
    <GlassCard hover={false}>
      <Typography variant="h5" gutterBottom color="warning.main">
        Section 2: What Goes Wrong
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {principle.breakdown.description}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {principle.breakdown.actions.map((action, i) => (
          <Button
            key={action.label}
            variant={activeAction === i ? 'contained' : 'outlined'}
            color="warning"
            onClick={() => handleAction(i)}
          >
            {action.label}
          </Button>
        ))}
      </Box>

      <AnimatePresence>
        {activeAction !== null && (
          <Alert severity="error" sx={{ mb: 3 }} icon={<ErrorOutlineIcon />}>
            {principle.breakdown.actions[activeAction].effect}
          </Alert>
        )}
      </AnimatePresence>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          component={motion.div}
          animate={broken ? { rotate: [0, -2, 2, -1, 0], borderColor: '#FF5252' } : {}}
          transition={{ duration: 0.5 }}
          sx={{
            border: '3px solid',
            borderColor: broken ? 'error.main' : 'warning.main',
            borderRadius: 3,
            p: 4,
            minWidth: 280,
            bgcolor: broken ? 'rgba(255, 82, 82, 0.12)' : 'rgba(255, 215, 64, 0.08)',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            {principle.problem.className}
          </Typography>
          {principle.problem.methods.map((method, i) => (
            <Box
              key={method}
              component={motion.div}
              animate={broken ? { x: [0, -5, 5, 0], opacity: [1, 0.5, 1] } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              sx={{
                py: 1, px: 2, my: 0.5, borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: `1px solid ${broken ? 'rgba(255,82,82,0.5)' : 'rgba(255,215,64,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              }}
            >
              {broken && <ErrorOutlineIcon sx={{ fontSize: 16, color: 'error.main' }} />}
              <Typography variant="body2">{method}</Typography>
            </Box>
          ))}
          {broken && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ position: 'absolute', top: -12, right: -12 }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 32, color: 'error.main' }} />
            </motion.div>
          )}
        </Box>
      </Box>
    </GlassCard>
  );
}
