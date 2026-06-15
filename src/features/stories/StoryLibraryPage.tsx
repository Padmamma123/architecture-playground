import { Box, Typography, Grid, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { patternStories, systemDesignStories } from '../../data/stories';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';

const patternRoutes: Record<string, string> = {
  strategy: '/patterns/behavioral/strategy',
  observer: '/patterns/behavioral/observer',
  decorator: '/patterns/structural/decorator',
  factory: '/patterns/creational/factory',
  singleton: '/patterns/creational/singleton',
  command: '/patterns/behavioral/command',
  adapter: '/patterns/structural/adapter',
  facade: '/patterns/structural/facade',
  state: '/patterns/behavioral/state',
  'chain-of-responsibility': '/patterns/behavioral/chain-of-responsibility',
  srp: '/solid/srp',
};

const systemRoutes: Record<string, string> = {
  tinyurl: '/case-studies',
  pastebin: '/case-studies',
};

export default function StoryLibraryPage() {
  const navigate = useNavigate();
  const allStories = [
    ...Object.values(patternStories),
    ...Object.values(systemDesignStories),
  ];

  return (
    <Box>
      <SectionHeader
        title="Story Library"
        subtitle="Head First-style narrated stories — learn patterns like watching a movie"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Story Library' }]}
      />

      <GlassCard hover={false} sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <AutoStoriesIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>How Story Mode Works</Typography>
            <Typography variant="body2" color="text.secondary">
              Characters tell each story line-by-line — like a visual novel. Press Play and watch
              SimUduck, the Starbuzz CEO, and others speak with animated portraits, typewriter dialogue,
              and "What would YOU do?" quizzes.
            </Typography>
          </Box>
        </Box>
      </GlassCard>

      <Grid container spacing={3}>
        {allStories.map((story) => {
          const route = patternRoutes[story.id] || systemRoutes[story.id] || '/';
          return (
            <Grid key={story.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <GlassCard onClick={() => navigate(route)}>
                <Typography variant="overline" color="primary.light">{story.bookReference}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{story.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{story.subtitle}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                  {story.characters.map((c) => (
                    <Chip key={c.id} label={`${c.avatar} ${c.name}`} size="small" variant="outlined" />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={`${story.scenes.length} scenes`} size="small" color="primary" />
                  <Typography variant="caption" color="secondary.main">📖 Watch Story →</Typography>
                </Box>
              </GlassCard>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
