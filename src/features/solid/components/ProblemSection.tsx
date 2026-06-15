import { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Chip, Alert, Collapse, Button, Divider,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined';
import LinkIcon from '@mui/icons-material/Link';
import BuildIcon from '@mui/icons-material/Build';
import ScienceIcon from '@mui/icons-material/Science';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import type { SolidPrinciple } from '../../../types';
import GlassCard from '../../../components/ui/GlassCard';

const warningIcons: Record<string, React.ReactNode> = {
  coupled: <LinkIcon />,
  maintain: <BuildIcon />,
  test: <ScienceIcon />,
};

interface ProblemSectionProps {
  principle: SolidPrinciple;
}

export default function ProblemSection({ principle }: ProblemSectionProps) {
  const { problem } = principle;
  const [selectedWarning, setSelectedWarning] = useState<string | null>(null);
  const explanationRef = useRef<HTMLDivElement>(null);
  const details = problem.warningDetails ?? [];
  const activeDetail = details.find((d) => d.id === selectedWarning);

  useEffect(() => {
    if (selectedWarning && explanationRef.current) {
      explanationRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedWarning]);

  const handleWarningClick = (id: string) => {
    setSelectedWarning((prev) => (prev === id ? null : id));
  };

  return (
    <GlassCard hover={false}>
      <Typography variant="h5" gutterBottom color="error.main">
        Section 1: What Problem Exists
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {problem.title} — everything crammed into one class
      </Typography>
      <Alert severity="info" icon={<HelpOutlineIcon />} sx={{ mb: 3 }}>
        See the red warnings below? <strong>Click each one</strong> to understand what it actually means and <em>why</em> it happens — not just buzzwords.
      </Alert>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box
          component={motion.div}
          animate={{ boxShadow: ['0 0 20px rgba(255,82,82,0.3)', '0 0 40px rgba(255,82,82,0.5)', '0 0 20px rgba(255,82,82,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
          sx={{
            border: '3px solid',
            borderColor: 'error.main',
            borderRadius: 3,
            p: 4,
            minWidth: 300,
            bgcolor: 'rgba(255, 82, 82, 0.08)',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Typography variant="h6" color="error.main" gutterBottom sx={{ fontWeight: 700 }}>
            {problem.className}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            ⚠️ One class doing {problem.methods.length} different jobs
          </Typography>
          {problem.methods.map((method, i) => {
            const isHighlighted = activeDetail?.connectedMethods.includes(method);
            return (
              <Box
                key={method}
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: isHighlighted ? 1.03 : 1,
                  borderColor: isHighlighted ? '#FF5252' : 'rgba(255,82,82,0.3)',
                }}
                transition={{ delay: i * 0.1 }}
                sx={{
                  py: 1, px: 2, my: 0.5, borderRadius: 1,
                  bgcolor: isHighlighted ? 'rgba(255,82,82,0.2)' : 'rgba(255,255,255,0.05)',
                  border: '2px solid',
                  borderColor: isHighlighted ? 'error.main' : 'rgba(255,82,82,0.3)',
                }}
              >
                <Typography variant="body2">{method}</Typography>
              </Box>
            );
          })}

          {/* Coupling lines visualization when warning selected */}
          {activeDetail && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{ mt: 2, p: 1.5, borderRadius: 1, bgcolor: 'rgba(255,82,82,0.15)', border: '1px dashed', borderColor: 'error.main' }}
            >
              <Typography variant="caption" color="error.light">
                🔗 These methods are connected — touching one affects the others
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Interactive warning chips */}
      <Typography variant="subtitle2" gutterBottom sx={{ textAlign: 'center', mb: 1.5 }}>
        👇 Click a warning to learn WHY it's a problem
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
        {details.length > 0
          ? details.map((d) => (
            <Chip
              key={d.id}
              component="button"
              type="button"
              clickable
              icon={warningIcons[d.id] as React.ReactElement}
              label={d.label}
              color="error"
              variant={selectedWarning === d.id ? 'filled' : 'outlined'}
              onClick={() => handleWarningClick(d.id)}
              sx={{
                cursor: 'pointer',
                fontSize: '0.9rem',
                py: 2.5,
                px: 1,
                '&:hover': { bgcolor: 'rgba(255,82,82,0.2)' },
                ...(selectedWarning === null && {
                  animation: 'pulse-glow 2s ease-in-out infinite',
                }),
              }}
            />
          ))
          : problem.warnings.map((w) => (
            <Chip key={w} icon={<WarningAmberIcon />} label={w} color="error" variant="outlined" />
          ))}
      </Box>

      {/* Deep explanation panel */}
      <Collapse in={!!activeDetail} timeout={400} unmountOnExit>
        <Box ref={explanationRef} sx={{ mt: 2 }}>
          {activeDetail && (
            <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,82,82,0.08)', border: '2px solid rgba(255,82,82,0.3)' }}>
              <Typography variant="h6" color="error.main" gutterBottom sx={{ fontWeight: 700 }}>
                ❓ What is "{activeDetail.label}"?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontSize: '1.05rem' }}>
                {activeDetail.simpleDefinition}
              </Typography>

              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

              <Typography variant="subtitle2" color="warning.main" gutterBottom sx={{ fontWeight: 700 }}>
                🔍 Why does it happen HERE in {problem.className}?
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8 }}>
                {activeDetail.whyHere}
              </Typography>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.25)', mb: 2, borderLeft: '4px solid', borderColor: 'error.main' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  📋 Real scenario that actually happens:
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, fontStyle: 'italic' }}>
                  {activeDetail.realExample}
                </Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.3)' }}>
                <Typography variant="subtitle2" color="primary.light" gutterBottom sx={{ fontWeight: 600 }}>
                  🌍 Think of it like this:
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                  {activeDetail.analogy}
                </Typography>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Affected methods:</Typography>
                {activeDetail.connectedMethods.map((m) => (
                  <Chip key={m} label={m} size="small" color="error" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Collapse>

      {details.length > 0 && !selectedWarning && (
        <Collapse in>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<HelpOutlineIcon />}
              onClick={() => setSelectedWarning(details[0].id)}
            >
              Start with: What is "{details[0].label}"?
            </Button>
          </Box>
        </Collapse>
      )}

      {selectedWarning && details.findIndex((d) => d.id === selectedWarning) < details.length - 1 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              const idx = details.findIndex((d) => d.id === selectedWarning);
              if (idx < details.length - 1) setSelectedWarning(details[idx + 1].id);
            }}
          >
            Next: {details[details.findIndex((d) => d.id === selectedWarning) + 1]?.label}
          </Button>
        </Box>
      )}
    </GlassCard>
  );
}
