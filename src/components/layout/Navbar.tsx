import { AppBar, Toolbar, Typography, IconButton, Box, Chip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppStore } from '../../store/useAppStore';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { level, xp } = useAppStore();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(10, 14, 23, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar>
        <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 2, display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Architecture Playground
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label={`Lv. ${level}`} size="small" color="primary" variant="outlined" />
          <Chip label={`${xp} XP`} size="small" sx={{ bgcolor: 'rgba(0, 229, 255, 0.1)', color: 'secondary.main' }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
