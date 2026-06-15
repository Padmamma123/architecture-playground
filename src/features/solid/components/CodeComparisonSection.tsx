import { Box, Typography, Grid } from '@mui/material';
import Editor from '@monaco-editor/react';
import type { SolidPrinciple } from '../../../types';
import GlassCard from '../../../components/ui/GlassCard';

interface CodeComparisonSectionProps {
  principle: SolidPrinciple;
}

export default function CodeComparisonSection({ principle }: CodeComparisonSectionProps) {
  return (
    <GlassCard hover={false}>
      <Typography variant="h5" gutterBottom>
        Section 5: Code Comparison
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="error.main" gutterBottom>❌ Bad Code</Typography>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,82,82,0.3)' }}>
            <Editor
              height="320px"
              language="typescript"
              theme="vs-dark"
              value={principle.code.bad}
              options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="success.main" gutterBottom>✅ Good Code</Typography>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(0,230,118,0.3)' }}>
            <Editor
              height="320px"
              language="typescript"
              theme="vs-dark"
              value={principle.code.good}
              options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
            />
          </Box>
        </Grid>
      </Grid>
    </GlassCard>
  );
}
