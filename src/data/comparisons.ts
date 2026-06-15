import type { ComparisonPair } from '../types';

export const comparisons: ComparisonPair[] = [
  {
    id: 'factory-vs-builder',
    patternA: 'Factory',
    patternB: 'Builder',
    purpose: {
      a: 'Create objects without specifying exact class — focuses on WHAT to create',
      b: 'Construct complex objects step by step — focuses on HOW to assemble',
    },
    complexity: { a: 'beginner', b: 'intermediate' },
    advantages: {
      a: ['Simple creation logic', 'Easy to add new types', 'Hides instantiation'],
      b: ['Fluent API', 'Immutable results', 'Step-by-step validation'],
    },
    disadvantages: {
      a: ['Limited customization', 'All products share interface', 'Can become complex with many types'],
      b: ['More boilerplate', 'Overkill for simple objects', 'Requires builder per product'],
    },
    useCases: {
      a: ['Payment providers', 'Notification channels', 'Database connections'],
      b: ['SQL queries', 'HTTP requests', 'Complex configuration objects'],
    },
  },
  {
    id: 'strategy-vs-state',
    patternA: 'Strategy',
    patternB: 'State',
    purpose: {
      a: 'Swap algorithms at runtime — client chooses the strategy',
      b: 'Change behavior based on internal state — object transitions automatically',
    },
    complexity: { a: 'beginner', b: 'intermediate' },
    advantages: {
      a: ['Runtime algorithm switching', 'Eliminates conditionals', 'Easy to test strategies'],
      b: ['State-specific behavior', 'Clean state transitions', 'Eliminates state flags'],
    },
    disadvantages: {
      a: ['Client must know strategies', 'More classes', 'Strategy selection logic'],
      b: ['Many state classes', 'Complex transitions', 'Can be overkill for few states'],
    },
    useCases: {
      a: ['Sorting algorithms', 'Navigation modes', 'Compression methods'],
      b: ['Vending machines', 'Media players', 'Workflow engines'],
    },
  },
  {
    id: 'adapter-vs-facade',
    patternA: 'Adapter',
    patternB: 'Facade',
    purpose: {
      a: 'Make incompatible interfaces work together — translation layer',
      b: 'Simplify access to complex subsystem — unified entry point',
    },
    complexity: { a: 'beginner', b: 'beginner' },
    advantages: {
      a: ['Integrates legacy code', 'Single responsibility', 'Open/closed compliant'],
      b: ['Reduces complexity', 'Loose coupling', 'Easy to use API'],
    },
    disadvantages: {
      a: ['Adds indirection', 'Performance overhead', 'Multiple adapters needed'],
      b: ['Can become god object', 'Hides useful details', 'Tight to subsystem changes'],
    },
    useCases: {
      a: ['Legacy API integration', 'Third-party library wrappers', 'Format converters'],
      b: ['Home theater systems', 'Compiler front-ends', 'Microservice orchestration'],
    },
  },
  {
    id: 'decorator-vs-proxy',
    patternA: 'Decorator',
    patternB: 'Proxy',
    purpose: {
      a: 'Add responsibilities dynamically — enhances behavior',
      b: 'Control access to object — manages access/lazy loading',
    },
    complexity: { a: 'intermediate', b: 'intermediate' },
    advantages: {
      a: ['Runtime extension', 'Composable features', 'Single responsibility per decorator'],
      b: ['Access control', 'Lazy initialization', 'Remote object handling'],
    },
    disadvantages: {
      a: ['Many small classes', 'Hard to remove decorators', 'Order matters'],
      b: ['Added latency', 'Complexity for simple cases', 'Can hide real object issues'],
    },
    useCases: {
      a: ['I/O streams', 'UI theming', 'Middleware pipelines'],
      b: ['Image lazy loading', 'API gateways', 'Security proxies'],
    },
  },
];
