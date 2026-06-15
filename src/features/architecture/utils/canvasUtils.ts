import type { Node, Edge } from 'reactflow';
import type { ArchitectureGuideStep } from '../../../types';

export const nodeColors: Record<string, string> = {
  frontend: '#7C4DFF',
  gateway: '#00E5FF',
  lb: '#FFD740',
  service: '#00E676',
  database: '#FF5252',
  cache: '#FF6D00',
  queue: '#E040FB',
  cdn: '#40C4FF',
};

export function stepToCanvas(step: ArchitectureGuideStep): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = step.nodes.map((n) => ({
    id: n.nodeId,
    type: 'default',
    position: { x: n.x, y: n.y },
    data: { label: `${n.icon} ${n.label}` },
    style: {
      background: `${nodeColors[n.type] ?? '#7C4DFF'}22`,
      border: `2px solid ${nodeColors[n.type] ?? '#7C4DFF'}`,
      borderRadius: 12,
      padding: 12,
      color: '#E8EAED',
      fontSize: 13,
      fontWeight: 600,
      minWidth: 130,
    },
  }));

  const edges: Edge[] = step.edges.map((e, i) => ({
    id: `e-${e.from}-${e.to}-${i}`,
    source: e.from,
    target: e.to,
    label: e.label,
    animated: true,
    style: { stroke: '#7C4DFF', strokeWidth: 2 },
    labelStyle: { fill: '#9AA0A6', fontSize: 11 },
  }));

  return { nodes, edges };
}
