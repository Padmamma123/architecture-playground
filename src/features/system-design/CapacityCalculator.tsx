import { useState, useMemo } from 'react';
import { Box, Typography, Grid, TextField, Slider, Alert } from '@mui/material';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';

export default function CapacityCalculator() {
  const [dau, setDau] = useState(1000000);
  const [actionsPerUser, setActionsPerUser] = useState(10);
  const [readWriteRatio, setReadWriteRatio] = useState(100);
  const [dataSizeBytes, setDataSizeBytes] = useState(500);
  const [retentionYears, setRetentionYears] = useState(5);

  const calc = useMemo(() => {
    const secondsPerDay = 86400;
    const totalActions = dau * actionsPerUser;
    const qps = totalActions / secondsPerDay;
    const readQps = qps * (readWriteRatio / (readWriteRatio + 1));
    const writeQps = qps / (readWriteRatio + 1);
    const dailyStorage = totalActions * dataSizeBytes;
    const totalStorage = dailyStorage * 365 * retentionYears;
    const bandwidth = readQps * dataSizeBytes;

    return {
      qps: Math.round(qps * 100) / 100,
      readQps: Math.round(readQps * 100) / 100,
      writeQps: Math.round(writeQps * 100) / 100,
      dailyStorage: formatBytes(dailyStorage),
      totalStorage: formatBytes(totalStorage),
      bandwidth: formatBytes(bandwidth) + '/sec',
      serversNeeded: Math.ceil(readQps / 1000),
      cacheSize: formatBytes(readQps * dataSizeBytes * 3600),
    };
  }, [dau, actionsPerUser, readWriteRatio, dataSizeBytes, retentionYears]);

  return (
    <Box>
      <SectionHeader
        title="Capacity Calculator"
        subtitle="Estimate QPS, storage, and bandwidth — the numbers that drive architecture decisions"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Architect Academy', path: '/system-design' }, { label: 'Calculator' }]}
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        Architects always estimate before designing. Plug in your numbers and see what infrastructure you need.
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <GlassCard hover={false}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Input Assumptions</Typography>

            <Typography variant="caption" color="text.secondary">Daily Active Users: {dau.toLocaleString()}</Typography>
            <Slider value={dau} onChange={(_, v) => setDau(v as number)} min={1000} max={100000000} step={1000} sx={{ mb: 2 }} />

            <Typography variant="caption" color="text.secondary">Actions per user per day: {actionsPerUser}</Typography>
            <Slider value={actionsPerUser} onChange={(_, v) => setActionsPerUser(v as number)} min={1} max={100} sx={{ mb: 2 }} />

            <Typography variant="caption" color="text.secondary">Read:Write Ratio: {readWriteRatio}:1</Typography>
            <Slider value={readWriteRatio} onChange={(_, v) => setReadWriteRatio(v as number)} min={1} max={1000} sx={{ mb: 2 }} />

            <TextField label="Data size per record (bytes)" type="number" fullWidth size="small" value={dataSizeBytes}
              onChange={(e) => setDataSizeBytes(Number(e.target.value))} sx={{ mb: 2 }} />

            <Typography variant="caption" color="text.secondary">Retention: {retentionYears} years</Typography>
            <Slider value={retentionYears} onChange={(_, v) => setRetentionYears(v as number)} min={1} max={10} step={1} />
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <GlassCard hover={false}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>📊 Results</Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Total QPS', value: calc.qps, color: '#7C4DFF' },
                { label: 'Read QPS', value: calc.readQps, color: '#00E5FF' },
                { label: 'Write QPS', value: calc.writeQps, color: '#00E676' },
                { label: 'Daily Storage', value: calc.dailyStorage, color: '#FFD740' },
                { label: 'Total Storage (' + retentionYears + 'yr)', value: calc.totalStorage, color: '#FF5252' },
                { label: 'Read Bandwidth', value: calc.bandwidth, color: '#E040FB' },
                { label: 'API Servers Needed', value: `~${calc.serversNeeded}`, color: '#7C4DFF' },
                { label: '1hr Cache Size', value: calc.cacheSize, color: '#00E5FF' },
              ].map((r) => (
                <Grid key={r.label} size={{ xs: 6 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: `${r.color}15`, border: `1px solid ${r.color}33`, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: r.color }}>{r.value}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(255,215,64,0.08)' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>💡 Architect Recommendation</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {calc.readQps > 1000
                  ? `At ${calc.readQps} reads/sec, you NEED Redis caching + load balancer. DB alone cannot handle this.`
                  : calc.readQps > 100
                    ? `At ${calc.readQps} reads/sec, add caching soon. Start with load balancer + 2 API servers.`
                    : `At ${calc.readQps} reads/sec, a single server with a DB is fine for now. Plan for caching at 10x growth.`}
              </Typography>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e12) return (bytes / 1e12).toFixed(1) + ' TB';
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + ' GB';
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + ' MB';
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(1) + ' KB';
  return bytes + ' B';
}
