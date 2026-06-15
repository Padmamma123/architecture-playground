import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Avatar, LinearProgress, useMediaQuery, useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FactoryIcon from '@mui/icons-material/Factory';
import LayersIcon from '@mui/icons-material/Layers';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import QuizIcon from '@mui/icons-material/Quiz';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PublicIcon from '@mui/icons-material/Public';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SchoolIcon from '@mui/icons-material/School';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'System Design Academy', path: '/system-design', icon: <SchoolIcon /> },
  { label: 'SOLID Principles', path: '/solid', icon: <AccountTreeIcon /> },
  { label: 'Creational', path: '/patterns/creational', icon: <FactoryIcon /> },
  { label: 'Structural', path: '/patterns/structural', icon: <LayersIcon /> },
  { label: 'Behavioral', path: '/patterns/behavioral', icon: <SwapHorizIcon /> },
  { label: 'Architecture', path: '/architecture', icon: <ArchitectureIcon /> },
  { label: 'Case Studies', path: '/case-studies', icon: <PublicIcon /> },
  { label: 'Comparison Lab', path: '/comparison', icon: <CompareArrowsIcon /> },
  { label: 'Quiz', path: '/quiz', icon: <QuizIcon /> },
  { label: 'Story Library', path: '/stories', icon: <AutoStoriesIcon /> },
  { label: 'Code Playground', path: '/playground', icon: <CodeIcon /> },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { xp, level, badges } = useAppStore();
  const unlockedBadges = badges.filter((b) => b.unlocked).length;
  const xpInLevel = xp % 500;

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>AP</Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Architecture</Typography>
            <Typography variant="caption" color="primary.light">Playground</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Level {level}</Typography>
          <Typography variant="caption" color="text.secondary">{xp} XP</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(xpInLevel / 500) * 100}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.05)',
            '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #7C4DFF, #00E5FF)' },
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <EmojiEventsIcon sx={{ fontSize: 14, color: 'warning.main' }} />
          <Typography variant="caption" color="text.secondary">{unlockedBadges}/{badges.length} badges</Typography>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <ListItemButton
              key={item.path}
              onClick={() => { navigate(item.path); if (isMobile) onMobileClose(); }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                bgcolor: active ? 'rgba(124, 77, 255, 0.15)' : 'transparent',
                borderLeft: active ? '3px solid' : '3px solid transparent',
                borderColor: active ? 'primary.main' : 'transparent',
              }}
            >
              <ListItemIcon sx={{ color: active ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem', fontWeight: active ? 600 : 400 } }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            bgcolor: 'background.default',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            bgcolor: 'background.default',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export { DRAWER_WIDTH };
