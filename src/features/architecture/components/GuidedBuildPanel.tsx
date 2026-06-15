import {
  Box, Typography, Button, Chip, Alert, LinearProgress, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import LightbulbIcon from '@mui/icons-material/LightbulbOutlined';
import type { ArchitectureGuide, ArchitectureGuideStep } from '../../../types';

interface GuidedBuildPanelProps {
  guide: ArchitectureGuide;
  step: ArchitectureGuideStep;
  stepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
}

export default function GuidedBuildPanel({
  guide,
  step,
  stepIndex,
  totalSteps,
  onPrev,
  onNext,
  onReset,
}: GuidedBuildPanelProps) {
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h4">{guide.icon}</Typography>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{guide.name}</Typography>
            <Typography variant="caption" color="text.secondary">{guide.scale}</Typography>
          </Box>
          <Button size="small" variant="text" onClick={onReset}>Switch System</Button>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            mb: 0.5,
            '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #7C4DFF, #00E5FF)' },
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Step {stepIndex + 1} of {totalSteps} · {progress}% complete
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.light' }}>
        {step.title}
      </Typography>

      <Alert
        severity="error"
        icon={<ErrorOutlineIcon />}
        sx={{ bgcolor: 'rgba(255,82,82,0.08)', '& .MuiAlert-message': { width: '100%' } }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>🚫 The Problem</Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{step.problem}</Typography>
      </Alert>

      <Alert
        severity="success"
        icon={<CheckCircleOutlineIcon />}
        sx={{ bgcolor: 'rgba(0,230,118,0.08)', '& .MuiAlert-message': { width: '100%' } }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>✅ The Solution</Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{step.solution}</Typography>
      </Alert>

      <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.25)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LightbulbIcon sx={{ color: 'primary.light', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.light' }}>Architect Tip</Typography>
        </Box>
        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{step.architectTip}</Typography>
      </Box>

      {step.nodes.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Components added this step (edit canvas freely):
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {step.nodes.map((n) => (
              <Chip key={n.nodeId} label={`${n.icon} ${n.label}`} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onPrev}
          disabled={isFirst}
          sx={{ flex: 1 }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={onNext}
          sx={{ flex: 1 }}
        >
          {isLast ? 'Complete! 🎉' : 'Next Step'}
        </Button>
      </Box>

      {isLast && (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
          {guide.patterns.map((p) => (
            <Chip key={p} label={p} size="small" color="secondary" variant="outlined" />
          ))}
        </Box>
      )}
    </Box>
  );
}
