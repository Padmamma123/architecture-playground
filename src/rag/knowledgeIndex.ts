import type { KnowledgeChunk } from './types';
import { solidPrinciples } from '../data/solid';
import { creationalPatterns, structuralPatterns, behavioralPatterns } from '../data/patterns';
import { systemDesignTopics, designProblems, architectDecisions } from '../data/systemDesign';
import { architectureGuides } from '../data/architectureGuides';
import { caseStudies } from '../data/caseStudies';
import { aiKnowledgeBase } from '../data/architecture';
import { quizQuestions } from '../data/quizzes';
import { comparisons } from '../data/comparisons';

function chunk(
  id: string,
  category: string,
  title: string,
  content: string,
  tags: string[],
  source: string,
): KnowledgeChunk {
  return { id, category, title, content: content.trim(), tags, source };
}

/** Rebuild index on every call so curriculum edits are picked up in real time */
export function buildKnowledgeIndex(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  for (const p of solidPrinciples) {
    chunks.push(chunk(
      `solid-${p.id}`,
      'solid',
      `${p.acronym} — ${p.name}`,
      `${p.tagline}\nProblem: ${p.problem.title} — ${p.problem.className} with methods: ${p.problem.methods.join(', ')}. Warnings: ${p.problem.warnings.join(', ')}.\n${p.breakdown.description}`,
      [p.id, p.acronym.toLowerCase(), p.name.toLowerCase(), 'solid'],
      `solid/${p.id}`,
    ));

    for (const wd of p.problem.warningDetails ?? []) {
      chunks.push(chunk(
        `solid-${p.id}-warn-${wd.id}`,
        'solid',
        `${p.name}: ${wd.label}`,
        `Definition: ${wd.simpleDefinition}\nWhy here: ${wd.whyHere}\nReal example: ${wd.realExample}\nAnalogy: ${wd.analogy}`,
        [p.id, wd.label.toLowerCase(), wd.id, 'solid', 'warning'],
        `solid/${p.id}/warnings`,
      ));
    }

    chunks.push(chunk(
      `solid-${p.id}-code`,
      'solid',
      `${p.name} — Code Example`,
      `Bad code pattern:\n${p.code.bad}\n\nGood code pattern:\n${p.code.good}`,
      [p.id, 'solid', 'code'],
      `solid/${p.id}/code`,
    ));

    for (const rw of p.realWorld) {
      chunks.push(chunk(
        `solid-${p.id}-rw-${rw.company}`,
        'solid',
        `${p.name} at ${rw.company}`,
        rw.usage,
        [p.id, rw.company.toLowerCase(), 'real-world'],
        `solid/${p.id}/real-world`,
      ));
    }
  }

  const allPatterns = [...creationalPatterns, ...structuralPatterns, ...behavioralPatterns];
  for (const pat of allPatterns) {
    chunks.push(chunk(
      `pattern-${pat.id}`,
      'pattern',
      `${pat.name} (${pat.category})`,
      `${pat.description}\nPurpose: ${pat.purpose}\nUse cases: ${pat.useCases.join(', ')}\nSteps: ${pat.steps.map((s) => s.title + ': ' + s.description).join(' | ')}\nReal world: ${pat.realWorld.join(', ')}`,
      [pat.id, pat.category, pat.name.toLowerCase(), 'design pattern'],
      `patterns/${pat.category}/${pat.id}`,
    ));

    if (pat.code.good) {
      chunks.push(chunk(
        `pattern-${pat.id}-code`,
        'pattern',
        `${pat.name} — Code`,
        pat.code.good,
        [pat.id, pat.name.toLowerCase(), 'code'],
        `patterns/${pat.id}/code`,
      ));
    }
  }

  for (const topic of systemDesignTopics) {
    chunks.push(chunk(
      `sd-topic-${topic.id}`,
      'system-design',
      topic.title,
      `${topic.subtitle}\nWhat: ${topic.whatItIs}\nWhy: ${topic.whyItMatters}\nHow: ${topic.howItWorks.map((h) => h.step + ': ' + h.detail).join('\n')}\nReal world: ${topic.realWorld.join(', ')}\nTip: ${topic.architectTip}`,
      [topic.id, topic.phase, topic.title.toLowerCase(), 'system design', 'scalability', 'architecture'],
      `system-design/topic/${topic.id}`,
    ));
  }

  for (const problem of designProblems) {
    chunks.push(chunk(
      `sd-problem-${problem.id}`,
      'system-design',
      `Design: ${problem.name}`,
      `${problem.description}\nFunctional: ${problem.requirements.functional.join('; ')}\nNon-functional: ${problem.requirements.nonFunctional.join('; ')}\nCapacity: ${JSON.stringify(problem.capacity)}\nArchitecture: ${problem.architecture.map((a) => a.component + ' — ' + a.role).join('; ')}\nPitfalls: ${problem.pitfalls.join('; ')}`,
      [problem.id, problem.name.toLowerCase(), 'design problem', 'system design'],
      `system-design/problem/${problem.id}`,
    ));

    for (const step of problem.steps) {
      chunks.push(chunk(
        `sd-problem-${problem.id}-step-${step.title}`,
        'system-design',
        `${problem.name}: ${step.title}`,
        `${step.content}\nWhy: ${step.why}`,
        [problem.id, problem.name.toLowerCase(), step.title.toLowerCase()],
        `system-design/problem/${problem.id}/steps`,
      ));
    }
  }

  for (const dec of architectDecisions) {
    chunks.push(chunk(
      `sd-decision-${dec.id}`,
      'system-design',
      dec.question,
      `Option A (${dec.optionA.label}): ${dec.optionA.when}. Pros: ${dec.optionA.pros.join(', ')}. Cons: ${dec.optionA.cons.join(', ')}.\nOption B (${dec.optionB.label}): ${dec.optionB.when}. Pros: ${dec.optionB.pros.join(', ')}. Cons: ${dec.optionB.cons.join(', ')}.\nVerdict: ${dec.verdict}`,
      [dec.id, 'decision', 'trade-off', 'architecture'],
      `system-design/decisions/${dec.id}`,
    ));
  }

  for (const guide of architectureGuides) {
    chunks.push(chunk(
      `arch-guide-${guide.id}`,
      'architecture',
      `${guide.name} Architecture`,
      `${guide.description}. Scale: ${guide.scale}. Patterns: ${guide.patterns.join(', ')}`,
      [guide.id, guide.name.toLowerCase(), 'architecture', 'guided build'],
      `architecture/guide/${guide.id}`,
    ));

    for (const step of guide.steps) {
      chunks.push(chunk(
        `arch-guide-${guide.id}-${step.id}`,
        'architecture',
        `${guide.name}: ${step.title}`,
        `${step.tutorIntro}\nProblem: ${step.problem}\nSolution: ${step.solution}\nArchitect tip: ${step.architectTip}\nComponents: ${step.nodes.map((n) => n.label).join(', ')}`,
        [guide.id, guide.name.toLowerCase(), step.id, step.title.toLowerCase(), 'architecture'],
        `architecture/guide/${guide.id}/${step.id}`,
      ));
    }
  }

  for (const cs of caseStudies) {
    chunks.push(chunk(
      `case-${cs.id}`,
      'case-study',
      `${cs.name} Case Study`,
      `${cs.description}\nComponents: ${cs.components.map((c) => c.label).join(', ')}\nFlow: ${cs.flow.map((f) => f.from + ' → ' + f.to + ' (' + f.label + ')').join('; ')}\nPatterns: ${cs.patterns.join(', ')}`,
      [cs.id, cs.name.toLowerCase(), 'case study', 'architecture'],
      `case-studies/${cs.id}`,
    ));
  }

  for (const [key, entry] of Object.entries(aiKnowledgeBase)) {
    chunks.push(chunk(
      `kb-${key.replace(/\s+/g, '-')}`,
      'knowledge-base',
      key,
      entry.text,
      key.split(' ').concat(['faq', 'architecture', 'pattern']),
      `knowledge-base/${key}`,
    ));
  }

  for (const q of quizQuestions) {
    chunks.push(chunk(
      `quiz-${q.id}`,
      'quiz',
      `Quiz: ${q.question.slice(0, 80)}`,
      `Q: ${q.question}\nOptions: ${q.options.join(' | ')}\nAnswer: ${q.options[q.correctIndex]}\nExplanation: ${q.explanation}`,
      [q.patternId, q.difficulty, 'quiz'],
      `quiz/${q.id}`,
    ));
  }

  for (const cmp of comparisons) {
    chunks.push(chunk(
      `compare-${cmp.id}`,
      'comparison',
      `${cmp.patternA} vs ${cmp.patternB}`,
      `Purpose A: ${cmp.purpose.a}\nPurpose B: ${cmp.purpose.b}\nAdvantages A: ${cmp.advantages.a.join(', ')}\nAdvantages B: ${cmp.advantages.b.join(', ')}\nDisadvantages A: ${cmp.disadvantages.a.join(', ')}\nDisadvantages B: ${cmp.disadvantages.b.join(', ')}\nUse cases A: ${cmp.useCases.a.join(', ')}\nUse cases B: ${cmp.useCases.b.join(', ')}`,
      [cmp.patternA.toLowerCase(), cmp.patternB.toLowerCase(), 'comparison'],
      `comparison/${cmp.id}`,
    ));
  }

  return chunks;
}

export function getKnowledgeIndex(): KnowledgeChunk[] {
  return buildKnowledgeIndex();
}

export function getChunkCount(): number {
  return buildKnowledgeIndex().length;
}
