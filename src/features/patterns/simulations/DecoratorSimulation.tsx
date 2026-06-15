import { useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const addons = [
  { name: 'Milk', cost: 0.5, icon: '🥛' },
  { name: 'Chocolate', cost: 1.0, icon: '🍫' },
  { name: 'Whipped Cream', cost: 0.75, icon: '🍦' },
];

export default function DecoratorSimulation() {
  const [layers, setLayers] = useState<string[]>([]);
  const baseCost = 2.0;

  const totalCost = baseCost + layers.reduce((sum, l) => {
    const addon = addons.find((a) => a.name === l);
    return sum + (addon?.cost || 0);
  }, 0);

  const addLayer = (name: string) => {
    if (!layers.includes(name)) setLayers((prev) => [...prev, name]);
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 1 }}>☕</Typography>
      <Typography variant="subtitle1" gutterBottom>Base Coffee — ${baseCost.toFixed(2)}</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
        {addons.map((a) => (
          <Button key={a.name} variant="outlined" size="small" onClick={() => addLayer(a.name)} disabled={layers.includes(a.name)}>
            + {a.icon} {a.name}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, minHeight: 200 }}>
        <AnimatePresence>
          {layers.map((layer, i) => {
            const addon = addons.find((a) => a.name === layer)!;
            return (
              <Box
                key={layer}
                component={motion.div}
                initial={{ opacity: 0, y: -30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                sx={{
                  width: 160 - i * 10,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(124, 77, 255, 0.15)',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  mb: -0.5,
                  zIndex: layers.length - i,
                }}
              >
                <Typography variant="body2">{addon.icon} {addon.name} (+${addon.cost})</Typography>
              </Box>
            );
          })}
        </AnimatePresence>
        <Box sx={{ width: 120, py: 2, borderRadius: 2, bgcolor: 'rgba(139,69,19,0.3)', border: '2px solid #8B4513', mt: layers.length > 0 ? 1 : 0 }}>
          <Typography variant="caption">Coffee Base</Typography>
        </Box>
      </Box>

      <Chip
        label={`Total: $${totalCost.toFixed(2)}`}
        color="primary"
        sx={{ mt: 3, fontSize: '1.1rem', py: 2.5, px: 1 }}
      />
    </Box>
  );
}
