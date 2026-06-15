import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7C4DFF', light: '#B388FF', dark: '#512DA8' },
    secondary: { main: '#00E5FF', light: '#6EFFFF', dark: '#00B2CC' },
    success: { main: '#00E676' },
    warning: { main: '#FFD740' },
    error: { main: '#FF5252' },
    background: {
      default: '#0A0E17',
      paper: 'rgba(18, 24, 38, 0.72)',
    },
    text: {
      primary: '#E8EAED',
      secondary: '#9AA0A6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0A0E17 0%, #12182A 50%, #0D1520 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(18, 24, 38, 0.55)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
  },
});

export const glassStyle = {
  background: 'rgba(18, 24, 38, 0.55)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 3,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
};

export const difficultyColors: Record<string, string> = {
  beginner: '#00E676',
  intermediate: '#FFD740',
  advanced: '#FF5252',
  easy: '#00E676',
  medium: '#FFD740',
  hard: '#FF5252',
};
