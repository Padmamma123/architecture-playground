import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Badge } from '../types';
import { systemDesignTopics, designProblems } from '../data/systemDesign';

interface AppState {
  xp: number;
  level: number;
  progress: Record<string, number>;
  completed: string[];
  badges: Badge[];
  addXp: (amount: number) => void;
  markComplete: (id: string) => void;
  setProgress: (id: string, value: number) => void;
  unlockBadge: (badgeId: string) => void;
}

const defaultBadges: Badge[] = [
  { id: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', unlocked: false },
  { id: 'solid-expert', name: 'SOLID Expert', description: 'Complete all SOLID principles', icon: '🏛️', unlocked: false },
  { id: 'pattern-master', name: 'Pattern Master', description: 'Complete 10 design patterns', icon: '🧩', unlocked: false },
  { id: 'architect', name: 'Architect', description: 'Build an architecture diagram', icon: '🏗️', unlocked: false },
  { id: 'quiz-champion', name: 'Quiz Champion', description: 'Score 100% on a quiz', icon: '🏆', unlocked: false },
  { id: 'system-designer', name: 'System Designer', description: 'Study 3 case studies', icon: '🌐', unlocked: false },
  { id: 'architect-fundamentals', name: 'Foundation Architect', description: 'Complete all system design fundamentals', icon: '📐', unlocked: false },
  { id: 'architect-builder', name: 'Building Blocks Master', description: 'Master load balancers, caching, databases, and queues', icon: '🧱', unlocked: false },
  { id: 'architect-interview', name: 'Interview Ready', description: 'Complete 3 design problems end-to-end', icon: '🎯', unlocked: false },
  { id: 'senior-architect', name: 'Senior Architect', description: 'Complete the full System Design Academy', icon: '👑', unlocked: false },
];

function calcLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      progress: {},
      completed: [],
      badges: defaultBadges,

      addXp: (amount) => {
        const newXp = get().xp + amount;
        set({ xp: newXp, level: calcLevel(newXp) });
        if (newXp >= 100) get().unlockBadge('first-lesson');
      },

      markComplete: (id) => {
        const { completed } = get();
        if (!completed.includes(id)) {
          const updated = [...completed, id];
          set({ completed: updated });
          get().addXp(100);

          if (id.startsWith('solid-') && updated.filter((c) => c.startsWith('solid-')).length >= 5) {
            get().unlockBadge('solid-expert');
          }
          if (updated.filter((c) => c.includes('pattern')).length >= 10) {
            get().unlockBadge('pattern-master');
          }

          const sdTopics = updated.filter((c) => c.startsWith('sd-topic-'));
          const sdProblems = updated.filter((c) => c.startsWith('sd-problem-'));
          const fundamentals = systemDesignTopics.filter((t) => t.phase === 'fundamentals');
          const buildingBlocks = systemDesignTopics.filter((t) => t.phase === 'building-blocks');

          if (fundamentals.every((t) => updated.includes(`sd-topic-${t.id}`))) {
            get().unlockBadge('architect-fundamentals');
          }
          if (buildingBlocks.every((t) => updated.includes(`sd-topic-${t.id}`))) {
            get().unlockBadge('architect-builder');
          }
          if (sdProblems.length >= 3) {
            get().unlockBadge('architect-interview');
          }
          if (sdTopics.length >= systemDesignTopics.length && sdProblems.length >= designProblems.length) {
            get().unlockBadge('senior-architect');
          }
        }
      },

      setProgress: (id, value) => {
        set({ progress: { ...get().progress, [id]: value } });
      },

      unlockBadge: (badgeId) => {
        set({
          badges: get().badges.map((b) =>
            b.id === badgeId ? { ...b, unlocked: true } : b
          ),
        });
        get().addXp(250);
      },
    }),
    { name: 'architecture-playground' }
  )
);
