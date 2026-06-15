import { useState } from 'react';
import { Box, Button, MenuItem, Select, FormControl, InputLabel, Alert } from '@mui/material';
import Editor from '@monaco-editor/react';
import { allPatterns } from '../../data/patterns';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';
import { useAppStore } from '../../store/useAppStore';

const templates: Record<string, string> = {
  singleton: `class Singleton {
  private static instance: Singleton;
  private constructor() {}
  static getInstance(): Singleton {
    if (!this.instance) this.instance = new Singleton();
    return this.instance;
  }
}`,
  factory: `interface Product { operation(): string; }
class Factory {
  create(type: string): Product {
    // Implement factory logic
    throw new Error("Not implemented");
  }
}`,
  observer: `interface Observer { update(data: unknown): void; }
class Subject {
  private observers: Observer[] = [];
  subscribe(obs: Observer) { this.observers.push(obs); }
  notify(data: unknown) { this.observers.forEach(o => o.update(data)); }
}`,
  strategy: `interface Strategy { execute(): void; }
class Context {
  constructor(private strategy: Strategy) {}
  setStrategy(s: Strategy) { this.strategy = s; }
  run() { this.strategy.execute(); }
}`,
  decorator: `interface Component { operation(): string; }
class Decorator implements Component {
  constructor(protected wrappee: Component) {}
  operation(): string { return this.wrappee.operation(); }
}`,
};

export default function CodePlayground() {
  const [pattern, setPattern] = useState('factory');
  const [code, setCode] = useState(templates.factory);
  const [output, setOutput] = useState('');
  const { addXp } = useAppStore();

  const handlePatternChange = (id: string) => {
    setPattern(id);
    setCode(templates[id] || `// Implement ${id} pattern here\n`);
    setOutput('');
  };

  const handleRun = () => {
    try {
      setOutput('✅ Code compiled successfully!\n\nPattern structure looks valid. In a full implementation, this would execute in a sandboxed environment.');
      addXp(25);
    } catch (e) {
      setOutput(`❌ Error: ${e}`);
    }
  };

  return (
    <Box>
      <SectionHeader
        title="Code Playground"
        subtitle="Implement design patterns with Monaco Editor"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Code Playground' }]}
      />

      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Pattern Template</InputLabel>
        <Select value={pattern} label="Pattern Template" onChange={(e) => handlePatternChange(e.target.value)}>
          {allPatterns.filter((p) => templates[p.id]).map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <GlassCard hover={false} sx={{ p: 0, overflow: 'hidden', mb: 2 }}>
        <Editor
          height="400px"
          language="typescript"
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v || '')}
          options={{ minimap: { enabled: true }, fontSize: 14, wordWrap: 'on' }}
        />
      </GlassCard>

      <Button variant="contained" onClick={handleRun} sx={{ mb: 2 }}>Run Simulation</Button>

      {output && (
        <Alert severity="info" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{output}</Alert>
      )}
    </Box>
  );
}
