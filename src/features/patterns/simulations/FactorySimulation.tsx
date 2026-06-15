import { useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const products = [
  { type: 'car', label: 'Car', icon: '🚗', color: '#7C4DFF' },
  { type: 'bike', label: 'Bike', icon: '🚲', color: '#00E5FF' },
  { type: 'truck', label: 'Truck', icon: '🚛', color: '#00E676' },
];

export default function FactorySimulation() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);

  const steps = [
    'Request sent to Factory',
    'Factory analyzes request type',
    'Object instantiated in memory',
    'Product returned to client',
  ];

  const handleCreate = (type: string) => {
    setSelected(type);
    setStep(0);
    setCreated(null);
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= 3) {
          clearInterval(interval);
          setCreated(type);
          return 3;
        }
        return s + 1;
      });
    }, 800);
  };

  const product = products.find((p) => p.type === (created || selected));

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        {products.map((p) => (
          <Button key={p.type} variant="outlined" onClick={() => handleCreate(p.type)}>
            Request {p.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 200 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">Customer</Typography>
          <Box component={motion.div} animate={{ scale: selected ? [1, 1.1, 1] : 1 }} sx={{ fontSize: '3rem' }}>👤</Box>
        </Box>

        {selected && (
          <>
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }}>
              <Typography color="primary.main">→</Typography>
            </motion.div>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Factory</Typography>
              <Box
                component={motion.div}
                animate={step >= 1 ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5 }}
                sx={{ fontSize: '3rem', p: 2, borderRadius: 2, bgcolor: 'rgba(124,77,255,0.15)', border: '2px solid', borderColor: 'primary.main' }}
              >
                🏭
              </Box>
            </Box>

            {step >= 2 && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>→</motion.div>
                <Box
                  component={motion.div}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  sx={{
                    fontSize: '3rem', p: 2, borderRadius: 2,
                    bgcolor: `${product?.color}22`, border: '2px solid', borderColor: product?.color,
                  }}
                >
                  {product?.icon}
                </Box>
              </>
            )}
          </>
        )}
      </Box>

      <AnimatePresence>
        {selected && (
          <Box component={motion.div} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} sx={{ mt: 3 }}>
            <Chip label={`Step ${step + 1}/4: ${steps[step]}`} color="primary" sx={{ mb: 2 }} />
            {created && (
              <Typography variant="body2" color="success.main">
                ✅ {product?.label} created and returned via Vehicle interface!
              </Typography>
            )}
          </Box>
        )}
      </AnimatePresence>

      {step >= 2 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {['Memory Block', 'Object Ref', 'Heap Alloc'].map((block, i) => (
            <Box
              key={block}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              sx={{ p: 2, borderRadius: 1, bgcolor: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', minWidth: 100 }}
            >
              <Typography variant="caption" color="secondary.main">{block}</Typography>
              <Box sx={{ height: 30, bgcolor: 'secondary.dark', borderRadius: 0.5, mt: 0.5 }} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
