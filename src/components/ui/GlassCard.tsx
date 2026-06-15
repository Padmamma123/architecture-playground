import { Box, type SxProps, type Theme } from '@mui/material';
import { motion } from 'framer-motion';
import { glassStyle } from '../../theme/theme';

interface GlassCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  sx?: SxProps<Theme>;
  hover?: boolean;
}

export default function GlassCard({ children, onClick, sx, hover = true }: GlassCardProps) {
  return (
    <Box
      component={motion.div}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      sx={{
        ...glassStyle,
        p: 3,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.3s',
        '&:hover': hover
          ? { borderColor: 'rgba(124, 77, 255, 0.3)' }
          : undefined,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
