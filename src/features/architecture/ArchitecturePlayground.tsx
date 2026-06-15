import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap, addEdge,
  useNodesState, useEdgesState, type Connection, type Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Typography, Button, Chip, Tabs, Tab, Grid } from '@mui/material';
import { architectureComponents } from '../../data/architecture';
import { architectureGuides } from '../../data/architectureGuides';
import { useAppStore } from '../../store/useAppStore';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import GuidedBuildPanel from './components/GuidedBuildPanel';
import ArchitectureTutor from './components/ArchitectureTutor';
import { nodeColors, stepToCanvas } from './utils/canvasUtils';

let freeBuildNodeId = 0;

export default function ArchitecturePlayground() {
  const [mode, setMode] = useState<'guided' | 'free'>('guided');
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [simulating, setSimulating] = useState(false);
  const { unlockBadge, addXp, markComplete } = useAppStore();

  const selectedGuide = architectureGuides.find((g) => g.id === selectedGuideId) ?? null;
  const currentStep = selectedGuide?.steps[stepIndex] ?? null;

  useEffect(() => {
    if (mode === 'guided' && currentStep) {
      const { nodes: stepNodes, edges: stepEdges } = stepToCanvas(currentStep);
      setNodes(stepNodes);
      setEdges(stepEdges);
    }
  }, [mode, selectedGuideId, stepIndex, currentStep, setNodes, setEdges]);

  const addComponent = (comp: typeof architectureComponents[0]) => {
    const id = `${comp.type}-free-${++freeBuildNodeId}`;
    const newNode: Node = {
      id,
      type: 'default',
      position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 300 },
      data: { label: `${comp.icon} ${comp.label}` },
      style: {
        background: `${nodeColors[comp.type]}22`,
        border: `2px solid ${nodeColors[comp.type]}`,
        borderRadius: 12,
        padding: 12,
        color: '#E8EAED',
        fontSize: 13,
        fontWeight: 600,
        minWidth: 140,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    if (nodes.length === 0) unlockBadge('architect');
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#7C4DFF' } }, eds)),
    [setEdges]
  );

  const simulateFlow = () => {
    if (edges.length === 0) return;
    setSimulating(true);
    setEdges((eds) => eds.map((e) => ({ ...e, animated: true, style: { stroke: '#00E676', strokeWidth: 2 } })));
    addXp(75);
    setTimeout(() => setSimulating(false), 3000);
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    freeBuildNodeId = 0;
  };

  const selectGuide = (id: string) => {
    setSelectedGuideId(id);
    setStepIndex(0);
    setMode('guided');
  };

  const handleNextStep = () => {
    if (!selectedGuide) return;
    if (stepIndex < selectedGuide.steps.length - 1) {
      setStepIndex((i) => i + 1);
      addXp(50);
    } else {
      markComplete(`arch-guide-${selectedGuide.id}`);
      addXp(200);
      unlockBadge('architect');
    }
  };

  const handlePrevStep = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const handleResetGuide = () => {
    setSelectedGuideId(null);
    setStepIndex(0);
    setNodes([]);
    setEdges([]);
  };

  return (
    <Box>
      <SectionHeader
        title="Architecture Playground"
        subtitle="Build system architectures with Alex, your AI tutor — Instagram, Snapchat, YouTube, WhatsApp, Uber, Amazon, and more"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Architecture Playground' }]}
      />

      <Tabs value={mode} onChange={(_, v) => setMode(v)} sx={{ mb: 3 }}>
        <Tab value="guided" label="🎓 Guided Build + AI Tutor" />
        <Tab value="free" label="🔧 Free Build" />
      </Tabs>

      {mode === 'guided' && !selectedGuide && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            Choose a system to build with your AI Tutor
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            I'll walk you through each component step-by-step — explaining problems, solutions, and why architects make these choices.
          </Typography>
          <Grid container spacing={2}>
            {architectureGuides.map((guide) => (
              <Grid key={guide.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <GlassCard onClick={() => selectGuide(guide.id)}>
                  <Typography variant="h3" sx={{ mb: 1 }}>{guide.icon}</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{guide.name}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {guide.scale}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                    {guide.description}
                  </Typography>
                  <Chip label={`${guide.steps.length} steps`} size="small" color="primary" variant="outlined" />
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {mode === 'free' && (
        <>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {architectureComponents.map((comp) => (
              <Chip
                key={comp.id}
                label={`${comp.icon} ${comp.label}`}
                onClick={() => addComponent(comp)}
                sx={{
                  cursor: 'pointer',
                  bgcolor: `${nodeColors[comp.type]}15`,
                  border: `1px solid ${nodeColors[comp.type]}44`,
                  '&:hover': { bgcolor: `${nodeColors[comp.type]}30` },
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button variant="contained" onClick={simulateFlow} disabled={edges.length === 0 || simulating}>
              {simulating ? 'Simulating...' : 'Simulate Request Flow'}
            </Button>
            <Button variant="outlined" color="error" onClick={clearCanvas}>Clear Canvas</Button>
          </Box>
        </>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: mode === 'guided' && selectedGuide ? 7 : 12 }}>
          <GlassCard hover={false} sx={{ height: mode === 'guided' && selectedGuide ? 520 : 500, p: 0, overflow: 'hidden' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              style={{ background: 'transparent' }}
            >
              <Background color="rgba(255,255,255,0.05)" gap={20} />
              <Controls />
              <MiniMap
                nodeColor={(n) => nodeColors[n.id.split('-')[0]] || '#7C4DFF'}
                style={{ background: 'rgba(10,14,23,0.8)' }}
              />
            </ReactFlow>
          </GlassCard>
          {mode === 'guided' && selectedGuide && (
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button variant="outlined" size="small" onClick={simulateFlow} disabled={edges.length === 0}>
                Simulate Flow
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                Drag nodes to rearrange · Connect nodes to add your own paths
              </Typography>
            </Box>
          )}
        </Grid>

        {mode === 'guided' && selectedGuide && currentStep && (
          <Grid size={{ xs: 12, lg: 5 }}>
            <GlassCard hover={false} sx={{ height: 520, p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Tabs value={0} sx={{ borderBottom: 1, borderColor: 'divider', px: 2, minHeight: 42 }}>
                <Tab label="📋 Step Guide" sx={{ minHeight: 42 }} />
              </Tabs>
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                <GuidedBuildPanel
                  guide={selectedGuide}
                  step={currentStep}
                  stepIndex={stepIndex}
                  totalSteps={selectedGuide.steps.length}
                  onPrev={handlePrevStep}
                  onNext={handleNextStep}
                  onReset={handleResetGuide}
                />
              </Box>
            </GlassCard>
          </Grid>
        )}
      </Grid>

      {mode === 'guided' && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12 }}>
            <GlassCard hover={false} sx={{ p: 0, overflow: 'hidden', minHeight: 320 }}>
              <ArchitectureTutor
                guide={selectedGuide}
                step={currentStep}
                stepIndex={stepIndex}
              />
            </GlassCard>
          </Grid>
        </Grid>
      )}

      {mode === 'free' && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Click components above to add them. Drag between nodes to connect. Switch to Guided Build for step-by-step tutorials.
        </Typography>
      )}
    </Box>
  );
}
