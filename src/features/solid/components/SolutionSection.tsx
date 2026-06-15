import { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion, AnimatePresence } from 'framer-motion';
import type { SolidPrinciple } from '../../../types';
import GlassCard from '../../../components/ui/GlassCard';

interface SolutionSectionProps {
  principle: SolidPrinciple;
}

export default function SolutionSection({ principle }: SolutionSectionProps) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <GlassCard hover={false}>
      <Typography variant="h5" gutterBottom color="success.main">
        Section 3: Solution
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Split responsibilities into focused, single-purpose classes
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => setShowAfter(!showAfter)}
          endIcon={<ArrowForwardIcon />}
        >
          {showAfter ? 'Show Before' : 'Show After — Split Classes'}
        </Button>
      </Box>

      <AnimatePresence mode="wait">
        {!showAfter ? (
          <Box
            key="before"
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Box sx={{
              border: '3px solid', borderColor: 'error.main', borderRadius: 3, p: 3,
              bgcolor: 'rgba(255,82,82,0.08)', textAlign: 'center', minWidth: 300,
            }}>
              <Typography variant="overline" color="error.main">BEFORE</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{principle.problem.className}</Typography>
              {principle.problem.methods.map((m) => (
                <Typography key={m} variant="body2" sx={{ py: 0.5 }}>{m}</Typography>
              ))}
            </Box>
          </Box>
        ) : (
          <Grid
            key="after"
            container
            spacing={2}
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            sx={{ justifyContent: 'center' }}
          >
            {principle.solution.after.map((cls, i) => (
              <Grid key={cls.className} size={{ xs: 6, sm: 3 }}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  sx={{
                    border: '2px solid', borderColor: 'success.main', borderRadius: 2, p: 2,
                    bgcolor: 'rgba(0, 230, 118, 0.08)', textAlign: 'center', height: '100%',
                  }}
                >
                  <Typography variant="overline" color="success.main" sx={{ fontSize: '0.6rem' }}>AFTER</Typography>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>{cls.className}</Typography>
                  {cls.methods.map((m) => (
                    <Typography key={m} variant="caption" sx={{ display: 'block', py: 0.3 }}>{m}</Typography>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
