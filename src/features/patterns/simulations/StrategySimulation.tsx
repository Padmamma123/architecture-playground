import { useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { motion } from 'framer-motion';

const strategies = {
  car: { icon: '🚗', label: 'Car', route: 'Highway → Exit 42 → Main St', time: '15 min', color: '#7C4DFF' },
  bike: { icon: '🚲', label: 'Bike', route: 'Bike Lane → Park Path → Trail', time: '25 min', color: '#00E676' },
  walk: { icon: '🚶', label: 'Walking', route: 'Sidewalk → Pedestrian Bridge → Plaza', time: '45 min', color: '#00E5FF' },
};

type StrategyKey = keyof typeof strategies;

export default function StrategySimulation() {
  const [strategy, setStrategy] = useState<StrategyKey>('car');
  const [calculating, setCalculating] = useState(false);
  const current = strategies[strategy];

  const handleSwitch = (_: unknown, val: StrategyKey | null) => {
    if (!val) return;
    setCalculating(true);
    setStrategy(val);
    setTimeout(() => setCalculating(false), 1000);
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="subtitle1" gutterBottom>🗺️ Navigation App</Typography>

      <ToggleButtonGroup value={strategy} exclusive onChange={handleSwitch} sx={{ mb: 3 }}>
        {Object.entries(strategies).map(([key, s]) => (
          <ToggleButton key={key} value={key}>{s.icon} {s.label}</ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Box
        component={motion.div}
        animate={calculating ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          p: 4, borderRadius: 3, mx: 'auto', maxWidth: 400,
          bgcolor: `${current.color}15`, border: '2px solid', borderColor: current.color,
        }}
      >
        <Box sx={{ fontSize: '3rem', mb: 1 }}>{current.icon}</Box>
        <Typography variant="h6" sx={{ color: current.color }}>{current.label} Strategy</Typography>
        <Typography variant="body2" sx={{ my: 2, fontFamily: 'monospace' }}>{current.route}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>⏱️ {current.time}</Typography>
      </Box>
    </Box>
  );
}
