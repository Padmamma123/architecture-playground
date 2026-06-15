import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export default function SectionHeader({ title, subtitle, breadcrumbs }: SectionHeaderProps) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ mb: 4 }}
    >
      {breadcrumbs && (
        <Breadcrumbs sx={{ mb: 1 }}>
          {breadcrumbs.map((bc) =>
            bc.path ? (
              <Link key={bc.label} component={RouterLink} to={bc.path} underline="hover" color="text.secondary">
                {bc.label}
              </Link>
            ) : (
              <Typography key={bc.label} color="text.primary">{bc.label}</Typography>
            )
          )}
        </Breadcrumbs>
      )}
      <Typography
        variant="h3"
        sx={{
          background: 'linear-gradient(135deg, #E8EAED 0%, #7C4DFF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary">{subtitle}</Typography>
      )}
    </Box>
  );
}
