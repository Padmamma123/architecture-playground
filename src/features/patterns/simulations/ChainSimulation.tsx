import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const handlers = [
  { level: 'Level 1 Agent', icon: '👤', canResolve: false },
  { level: 'Level 2 Specialist', icon: '🧑‍💻', canResolve: false },
  { level: 'Manager', icon: '👔', canResolve: true },
  { level: 'Director', icon: '🎩', canResolve: true },
];

export default function ChainSimulation() {
  const [ticketPosition, setTicketPosition] = useState(-1);
  const [resolved, setResolved] = useState(false);
  const [moving, setMoving] = useState(false);

  const handleEscalate = () => {
    setMoving(true);
    setResolved(false);
    setTicketPosition(0);
    let pos = 0;
    const interval = setInterval(() => {
      pos++;
      if (pos >= handlers.length) {
        clearInterval(interval);
        setMoving(false);
        setResolved(true);
        return;
      }
      if (handlers[pos].canResolve) {
        clearInterval(interval);
        setTicketPosition(pos);
        setMoving(false);
        setResolved(true);
        return;
      }
      setTicketPosition(pos);
    }, 1200);
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Button variant="contained" onClick={handleEscalate} disabled={moving} sx={{ mb: 4 }}>
        Create Support Ticket
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {handlers.map((h, i) => (
          <Box key={h.level} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                p: 2, borderRadius: 2, minWidth: 120, position: 'relative',
                bgcolor: ticketPosition === i ? 'rgba(124,77,255,0.2)' : 'rgba(255,255,255,0.03)',
                border: '2px solid',
                borderColor: ticketPosition === i ? 'primary.main' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s',
              }}
            >
              <Box sx={{ fontSize: '2rem' }}>{h.icon}</Box>
              <Typography variant="caption" sx={{ display: 'block' }}>{h.level}</Typography>
              <AnimatePresence>
                {ticketPosition === i && !resolved && (
                  <Box
                    component={motion.div}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    sx={{ position: 'absolute', top: -10, right: -10, fontSize: '1.5rem' }}
                  >
                    🎫
                  </Box>
                )}
              </AnimatePresence>
            </Box>
            {i < handlers.length - 1 && (
              <Typography color="text.secondary" sx={{ fontSize: '1.2rem' }}>↓</Typography>
            )}
          </Box>
        ))}
      </Box>

      {resolved && (
        <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ mt: 3 }}>
          <Typography color="success.main" variant="h6">
            ✅ Ticket resolved by {handlers[ticketPosition]?.level}!
          </Typography>
        </Box>
      )}
    </Box>
  );
}
