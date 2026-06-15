export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type PatternCategory =
  | 'solid'
  | 'creational'
  | 'structural'
  | 'behavioral'
  | 'architecture'
  | 'quiz'
  | 'comparison'
  | 'case-studies';

export interface ProgressItem {
  id: string;
  completed: boolean;
  progress: number;
}

export interface PatternItem {
  id: string;
  name: string;
  category: PatternCategory;
  difficulty: Difficulty;
  useCases: string[];
  description: string;
  icon: string;
}

export interface SolidPrinciple {
  id: string;
  acronym: string;
  name: string;
  tagline: string;
  difficulty: Difficulty;
  problem: {
    title: string;
    className: string;
    methods: string[];
    warnings: string[];
    warningDetails?: {
      id: string;
      label: string;
      simpleDefinition: string;
      whyHere: string;
      realExample: string;
      analogy: string;
      connectedMethods: string[];
    }[];
  };
  breakdown: {
    actions: { label: string; effect: string }[];
    description: string;
  };
  solution: {
    before: string[];
    after: { className: string; methods: string[] }[];
  };
  sandbox: {
    methods: { id: string; name: string; correctClass: string }[];
    classes: { id: string; name: string }[];
  };
  code: {
    bad: string;
    good: string;
  };
  realWorld: { company: string; usage: string; icon: string }[];
}

export interface PatternDetail {
  id: string;
  name: string;
  category: PatternCategory;
  difficulty: Difficulty;
  description: string;
  purpose: string;
  useCases: string[];
  steps: { title: string; description: string }[];
  realWorld: string[];
  code: { bad?: string; good: string };
  simulationType:
    | 'factory'
    | 'decorator'
    | 'adapter'
    | 'observer'
    | 'strategy'
    | 'chain'
    | 'generic';
}

export interface ComparisonPair {
  id: string;
  patternA: string;
  patternB: string;
  purpose: { a: string; b: string };
  complexity: { a: Difficulty; b: Difficulty };
  advantages: { a: string[]; b: string[] };
  disadvantages: { a: string[]; b: string[] };
  useCases: { a: string[]; b: string[] };
}

export interface QuizQuestion {
  id: string;
  patternId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CaseStudy {
  id: string;
  name: string;
  description: string;
  components: { id: string; label: string; type: string }[];
  flow: { from: string; to: string; label: string }[];
  patterns: string[];
}

export interface ArchitectureNode {
  id: string;
  type: string;
  label: string;
  icon: string;
}

export interface ArchitectureGuideNode {
  nodeId: string;
  label: string;
  type: string;
  icon: string;
  x: number;
  y: number;
}

export interface ArchitectureGuideEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ArchitectureGuideStep {
  id: string;
  title: string;
  tutorIntro: string;
  problem: string;
  solution: string;
  architectTip: string;
  nodes: ArchitectureGuideNode[];
  edges: ArchitectureGuideEdge[];
}

export interface ArchitectureGuide {
  id: string;
  name: string;
  icon: string;
  description: string;
  scale: string;
  difficulty: Difficulty;
  steps: ArchitectureGuideStep[];
  patterns: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface AiResponse {
  text: string;
  relatedPattern?: string;
  diagram?: string;
}

export type StoryMood = 'neutral' | 'problem' | 'conflict' | 'insight' | 'solution' | 'celebration';

export interface StoryCharacter {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
}

export interface StoryVisual {
  emoji: string;
  label: string;
  position?: 'left' | 'center' | 'right';
  animation?: 'enter' | 'shake' | 'glow' | 'split' | 'merge' | 'flow' | 'bounce';
}

export interface StoryLine {
  characterId: string;
  text: string;
}

export interface StoryScene {
  id: string;
  title: string;
  /** @deprecated Use lines — characters speak the story */
  narrator?: string;
  /** Character-driven dialogue — the primary way scenes are narrated */
  lines?: StoryLine[];
  /** @deprecated Merged into lines */
  dialogue?: { characterId: string; text: string }[];
  visuals: StoryVisual[];
  mood: StoryMood;
  insight?: string;
  insightCharacterId?: string;
  quiz?: { question: string; options: string[]; correctIndex: number; explanation: string };
  moralCharacterId?: string;
}

export interface PatternStory {
  id: string;
  title: string;
  subtitle: string;
  bookReference: string;
  characters: StoryCharacter[];
  scenes: StoryScene[];
  moral: string;
}

export interface SystemDesignTopic {
  id: string;
  phase: 'fundamentals' | 'building-blocks' | 'patterns' | 'interview';
  title: string;
  subtitle: string;
  icon: string;
  difficulty: Difficulty;
  whatItIs: string;
  whyItMatters: string;
  howItWorks: { step: string; detail: string }[];
  realWorld: string[];
  tradeoffs?: { pros: string[]; cons: string[] };
  keyNumbers?: { label: string; value: string }[];
  architectTip: string;
}

export interface DesignProblemStep {
  title: string;
  content: string;
  why: string;
  diagram?: { nodes: string[]; flow: string };
}

export interface DesignProblem {
  id: string;
  name: string;
  difficulty: Difficulty;
  description: string;
  icon: string;
  requirements: { functional: string[]; nonFunctional: string[] };
  capacity: { users: string; qps: string; storage: string; bandwidth: string };
  steps: DesignProblemStep[];
  architecture: { component: string; role: string; why: string }[];
  patterns: string[];
  pitfalls: string[];
}

export interface ArchitectDecision {
  id: string;
  question: string;
  optionA: { label: string; when: string; pros: string[]; cons: string[] };
  optionB: { label: string; when: string; pros: string[]; cons: string[] };
  verdict: string;
}
