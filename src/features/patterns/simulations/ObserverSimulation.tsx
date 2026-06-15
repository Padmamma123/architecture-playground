import { useState } from 'react';
import { Box, Typography, Button, Avatar, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const subscribers = [
  { name: 'Alice', avatar: 'A' },
  { name: 'Bob', avatar: 'B' },
  { name: 'Carol', avatar: 'C' },
  { name: 'Dave', avatar: 'D' },
];

export default function ObserverSimulation() {
  const [notified, setNotified] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setNotified([]);
    subscribers.forEach((sub, i) => {
      setTimeout(() => setNotified((prev) => [...prev, sub.name]), (i + 1) * 600);
    });
    setTimeout(() => setUploading(false), subscribers.length * 600 + 500);
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ mb: 4, p: 3, borderRadius: 3, bgcolor: 'rgba(255,0,0,0.1)', border: '2px solid rgba(255,0,0,0.3)', display: 'inline-block' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>📺 YouTube Channel</Typography>
        <Typography variant="caption" color="text.secondary">{subscribers.length} subscribers</Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="error" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload New Video'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
        {subscribers.map((sub) => {
          const isNotified = notified.includes(sub.name);
          return (
            <Box key={sub.name} sx={{ textAlign: 'center', position: 'relative' }}>
              <Avatar
                component={motion.div}
                animate={isNotified ? { scale: [1, 1.2, 1] } : {}}
                sx={{ width: 56, height: 56, bgcolor: isNotified ? 'success.main' : 'primary.dark', mx: 'auto', mb: 1 }}
              >
                {sub.avatar}
              </Avatar>
              <Typography variant="caption">{sub.name}</Typography>
              <AnimatePresence>
                {isNotified && (
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: -20, x: '-50%' }}
                    animate={{ opacity: 1, y: -60 }}
                    exit={{ opacity: 0 }}
                    sx={{ position: 'absolute', top: 0, left: '50%', zIndex: 10 }}
                  >
                    <Chip label="🔔 New Video!" size="small" color="success" />
                  </Box>
                )}
              </AnimatePresence>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
