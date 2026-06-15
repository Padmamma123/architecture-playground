import { useState } from 'react';
import { Box, Typography, Chip, Button, Tabs, Tab } from '@mui/material';
import {
  ReactFlow, Background, Controls, useNodesState, useEdgesState, MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { caseStudies } from '../../data/caseStudies';
import { getSystemDesignStory } from '../../data/stories';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import StoryNarrator from '../../components/story/StoryNarrator';

const typeColors: Record<string, string> = {
  frontend: '#7C4DFF', gateway: '#00E5FF', lb: '#FFD740',
  service: '#00E676', database: '#FF5252', cache: '#FF6D00', queue: '#E040FB', cdn: '#40C4FF',
};

function buildFlow(study: typeof caseStudies[0]) {
  const cols: Record<string, number> = { frontend: 0, gateway: 1, lb: 1, service: 2, cache: 3, database: 3, queue: 3, cdn: 4 };
  const rowTracker: Record<number, number> = {};

  const nodes = study.components.map((comp) => {
    const col = cols[comp.type] ?? 2;
    const row = rowTracker[col] ?? 0;
    rowTracker[col] = row + 1;
    return {
      id: comp.id,
      position: { x: col * 200 + 50, y: row * 100 + 50 },
      data: { label: comp.label },
      style: {
        background: `${typeColors[comp.type]}22`,
        border: `2px solid ${typeColors[comp.type]}`,
        borderRadius: 10, padding: 10, color: '#E8EAED', fontSize: 12, fontWeight: 600,
      },
    };
  });

  const edges = study.flow.map((f, i) => ({
    id: `e-${i}`,
    source: f.from,
    target: f.to,
    label: f.label,
    animated: false,
    style: { stroke: '#7C4DFF' },
    labelStyle: { fill: '#9AA0A6', fontSize: 10 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#7C4DFF' },
  }));

  return { nodes, edges };
}

export default function CaseStudiesPage() {
  const [selected, setSelected] = useState(caseStudies[0]);
  const [tab, setTab] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const { nodes: initNodes, edges: initEdges } = buildFlow(selected);
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const { unlockBadge, addXp } = useAppStore();
  const story = getSystemDesignStory(selected.id);

  const selectStudy = (study: typeof caseStudies[0]) => {
    setSelected(study);
    setTab(0);
    const { nodes: n, edges: e } = buildFlow(study);
    setNodes(n);
    setEdges(e);
    unlockBadge('system-designer');
  };

  const animateFlow = () => {
    setSimulating(true);
    setEdges((eds) => eds.map((e) => ({ ...e, animated: true, style: { stroke: '#00E676', strokeWidth: 2 } })));
    addXp(50);
    setTimeout(() => {
      setSimulating(false);
      setEdges((eds) => eds.map((e) => ({ ...e, animated: false, style: { stroke: '#7C4DFF' } })));
    }, 4000);
  };

  return (
    <Box>
      <SectionHeader
        title="Real World Case Studies"
        subtitle="Learn system design through stories and animated architecture diagrams"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Case Studies' }]}
      />

      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {caseStudies.map((cs) => (
          <Chip
            key={cs.id}
            label={cs.name}
            onClick={() => selectStudy(cs)}
            color={selected.id === cs.id ? 'primary' : 'default'}
            variant={selected.id === cs.id ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer', fontSize: '0.9rem', py: 2.5 }}
          />
        ))}
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{selected.description}</Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {selected.patterns.map((p) => (
          <Chip key={p} label={p} size="small" variant="outlined" color="secondary" />
        ))}
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        {story && <Tab label="📖 Story Mode" />}
        <Tab label="Architecture Diagram" />
      </Tabs>

      {story && tab === 0 && (
        <StoryNarrator story={story} />
      )}

      {tab === (story ? 1 : 0) && (
        <>
          <Button variant="contained" onClick={animateFlow} disabled={simulating} sx={{ mb: 2 }}>
            {simulating ? 'Animating Request Flow...' : 'Animate Request Flow'}
          </Button>

          <GlassCard hover={false} sx={{ height: 450, p: 0, overflow: 'hidden' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              style={{ background: 'transparent' }}
            >
              <Background color="rgba(255,255,255,0.05)" gap={20} />
              <Controls />
            </ReactFlow>
          </GlassCard>
        </>
      )}
    </Box>
  );
}
