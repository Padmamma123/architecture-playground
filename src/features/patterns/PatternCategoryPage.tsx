import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Chip } from '@mui/material';
import { getPatternsByCategory } from '../../data/patterns';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import { difficultyColors } from '../../theme/theme';

export default function PatternCategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const patterns = getPatternsByCategory(category || '');

  const titles: Record<string, string> = {
    creational: 'Creational Patterns',
    structural: 'Structural Patterns',
    behavioral: 'Behavioral Patterns',
  };

  return (
    <Box>
      <SectionHeader
        title={titles[category || ''] || 'Patterns'}
        subtitle="Select a pattern to explore visual simulations and code examples"
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: titles[category || ''] || 'Patterns' },
        ]}
      />
      <Grid container spacing={2}>
        {patterns.map((p) => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <GlassCard onClick={() => navigate(`/patterns/${category}/${p.id}`)}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ fontWeight: 600, fontSize: '1.1rem' }}>{p.name}</Box>
                <Chip
                  label={p.difficulty}
                  size="small"
                  sx={{ bgcolor: `${difficultyColors[p.difficulty]}22`, color: difficultyColors[p.difficulty], textTransform: 'capitalize' }}
                />
              </Box>
              <Box sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 2 }}>{p.description}</Box>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {p.useCases.slice(0, 2).map((uc) => (
                  <Chip key={uc} label={uc} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                ))}
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
