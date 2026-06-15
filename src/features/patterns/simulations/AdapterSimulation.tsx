import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdapterSimulation() {
  const [converting, setConverting] = useState(false);
  const [done, setDone] = useState(false);

  const handleRequest = () => {
    setConverting(true);
    setDone(false);
    setTimeout(() => { setConverting(false); setDone(true); }, 2000);
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Button variant="contained" onClick={handleRequest} sx={{ mb: 4 }}>
        Send New API Request
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'rgba(0,229,255,0.1)', border: '2px solid', borderColor: 'secondary.main', minWidth: 140 }}>
          <Typography variant="caption" color="secondary.main">New Application</Typography>
          <Box sx={{ fontSize: '2.5rem' }}>📱</Box>
          <Typography variant="caption" sx={{ display: 'block' }}>{`{ amount: 49.99 }`}</Typography>
        </Box>

        <motion.div animate={converting ? { x: [0, 10, 0] } : {}} transition={{ duration: 0.5, repeat: converting ? Infinity : 0 }}>
          <Typography color="primary.main" sx={{ fontSize: '1.5rem' }}>→</Typography>
        </motion.div>

        <Box
          component={motion.div}
          animate={converting ? { scale: [1, 1.1, 1], borderColor: ['#7C4DFF', '#00E5FF', '#7C4DFF'] } : {}}
          transition={{ duration: 0.8, repeat: converting ? Infinity : 0 }}
          sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'rgba(124,77,255,0.15)', border: '2px solid', borderColor: 'primary.main', minWidth: 140 }}
        >
          <Typography variant="caption" color="primary.main">Adapter</Typography>
          <Box sx={{ fontSize: '2.5rem' }}>🔄</Box>
          <Typography variant="caption" sx={{ display: 'block' }}>Converts format</Typography>
        </Box>

        <motion.div animate={converting ? { x: [0, 10, 0] } : {}} transition={{ duration: 0.5, repeat: converting ? Infinity : 0 }}>
          <Typography color="warning.main" sx={{ fontSize: '1.5rem' }}>→</Typography>
        </motion.div>

        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: 'rgba(255,215,64,0.1)', border: '2px solid', borderColor: 'warning.main', minWidth: 140 }}>
          <Typography variant="caption" color="warning.main">Old API</Typography>
          <Box sx={{ fontSize: '2.5rem' }}>🗄️</Box>
          <Typography variant="caption" sx={{ display: 'block' }}>{`{ cents: 4999 }`}</Typography>
        </Box>
      </Box>

      <AnimatePresence>
        {done && (
          <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ mt: 3 }}>
            <Typography color="success.main">✅ Payment processed via legacy API through adapter!</Typography>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}
