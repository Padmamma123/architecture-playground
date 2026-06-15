import { useState } from 'react';
import { Box, Typography, Button, Alert, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { SolidPrinciple } from '../../../types';
import GlassCard from '../../../components/ui/GlassCard';
import { useAppStore } from '../../../store/useAppStore';

interface SandboxSectionProps {
  principle: SolidPrinciple;
}

export default function SandboxSection({ principle }: SandboxSectionProps) {
  const { sandbox } = principle;
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState(false);
  const addXp = useAppStore((s) => s.addXp);

  const unassigned = sandbox.methods.filter((m) => !assignments[m.id]);
  const isCorrect = sandbox.methods.every((m) => assignments[m.id] === m.correctClass);

  const handleDrop = (methodId: string, classId: string) => {
    setAssignments((prev) => ({ ...prev, [methodId]: classId }));
    setValidated(false);
  };

  const handleValidate = () => {
    setValidated(true);
    if (isCorrect) addXp(50);
  };

  return (
    <GlassCard hover={false}>
      <Typography variant="h5" gutterBottom color="primary.main">
        Section 4: Interactive Sandbox
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Drag methods into the correct classes
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>Unassigned Methods</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', minHeight: 48, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
          {unassigned.map((m) => (
            <Chip
              key={m.id}
              label={m.name}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('methodId', m.id)}
              sx={{ cursor: 'grab', bgcolor: 'primary.dark' }}
            />
          ))}
          {unassigned.length === 0 && (
            <Typography variant="caption" color="text.secondary">All methods assigned!</Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        {sandbox.classes.map((cls) => {
          const methodsInClass = sandbox.methods.filter((m) => assignments[m.id] === cls.id);
          return (
            <Box
              key={cls.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const methodId = e.dataTransfer.getData('methodId');
                if (methodId) handleDrop(methodId, cls.id);
              }}
              sx={{
                flex: '1 1 200px',
                minHeight: 120,
                border: '2px dashed',
                borderColor: validated
                  ? methodsInClass.every((m) => m.correctClass === cls.id) ? 'success.main' : 'error.main'
                  : 'rgba(124, 77, 255, 0.4)',
                borderRadius: 2,
                p: 2,
                bgcolor: 'rgba(124, 77, 255, 0.05)',
              }}
            >
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>{cls.name}</Typography>
              {methodsInClass.map((m) => (
                <Chip
                  key={m.id}
                  label={m.name}
                  size="small"
                  onDelete={() => {
                    setAssignments((prev) => {
                      const next = { ...prev };
                      delete next[m.id];
                      return next;
                    });
                    setValidated(false);
                  }}
                  sx={{ m: 0.3 }}
                  color={validated ? (m.correctClass === cls.id ? 'success' : 'error') : 'default'}
                />
              ))}
            </Box>
          );
        })}
      </Box>

      <Button variant="contained" onClick={handleValidate} disabled={unassigned.length > 0}>
        Validate Answer
      </Button>

      {validated && (
        <Alert
          severity={isCorrect ? 'success' : 'error'}
          icon={isCorrect ? <CheckCircleIcon /> : undefined}
          sx={{ mt: 2 }}
        >
          {isCorrect ? 'Perfect! Each class has a single responsibility. +50 XP' : 'Not quite — review which methods belong where.'}
        </Alert>
      )}
    </GlassCard>
  );
}
