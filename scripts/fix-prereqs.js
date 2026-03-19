import { readFileSync, writeFileSync } from 'fs';

const modulesPath = 'public/data/learningModules.json';
const modules = JSON.parse(readFileSync(modulesPath, 'utf-8'));

const byId = new Map();
modules.forEach(m => byId.set(m.id, m));

// The issue: in A1/A2/B1, the chain should be:
//   ... → PV_READING → PV_PRACTICE_1 → PV_PRACTICE_2 → ... → IDIOM_READING → IDIOM_PRACTICE_1 → ...
//
// But we set first PV practice prereq to idiom reading (which comes after PV practice).
// Fix: first PV practice prereq → PV reading
//      idiom reading prereq → last PV practice module

// A1: reading-phrasal-verbs-a1 → matching-basic-phrasal-verbs-a1 → completion-basic-phrasal-verbs-a1 → quiz-phrasal-verbs-a1 → reading-idioms-a1 → flashcard-basic-idioms-a1 → quiz-basic-idioms-a1
const a1Fix = [
  { id: 'matching-basic-phrasal-verbs-a1', prereq: 'reading-phrasal-verbs-a1' },
  { id: 'reading-idioms-a1', prereq: 'quiz-phrasal-verbs-a1' },
];

// A2: reading-phrasal-verbs-a2 → matching-elementary-phrasal-verbs-a2 → completion-elementary-phrasal-verbs-a2 → reading-idioms-a2 → flashcard-elementary-idioms-a2 → quiz-elementary-idioms-a2
const a2Fix = [
  { id: 'matching-elementary-phrasal-verbs-a2', prereq: 'reading-phrasal-verbs-a2' },
  { id: 'reading-idioms-a2', prereq: 'completion-elementary-phrasal-verbs-a2' },
];

// B1: reading-phrasal-verbs-b1 → matching-common-phrasal-verbs-b1 → completion-phrasal-verbs-practice-b1 → reading-idioms-b1 → flashcard-everyday-idioms-b1 → ...
const b1Fix = [
  { id: 'matching-common-phrasal-verbs-b1', prereq: 'reading-phrasal-verbs-b1' },
  { id: 'reading-idioms-b1', prereq: 'completion-phrasal-verbs-practice-b1' },
];

const allFixes = [...a1Fix, ...a2Fix, ...b1Fix];

for (const fix of allFixes) {
  const mod = byId.get(fix.id);
  if (!mod) { console.log(`❌ Not found: ${fix.id}`); continue; }
  const old = mod.prerequisites[0];
  mod.prerequisites = [fix.prereq];
  console.log(`✅ ${fix.id}: ${old} → ${fix.prereq}`);
}

writeFileSync(modulesPath, JSON.stringify(modules, null, 2) + '\n');
console.log('\n🎉 Prerequisites fixed.');

// Verify all prereqs
const idxMap = new Map();
modules.forEach((m, i) => idxMap.set(m.id, i));

let issues = 0;
for (const m of modules) {
  for (const prereq of m.prerequisites) {
    if (!idxMap.has(prereq)) {
      console.log(`❌ ${m.id}: prereq "${prereq}" not found!`);
      issues++;
    } else if (idxMap.get(prereq) >= idxMap.get(m.id)) {
      console.log(`❌ ${m.id} [${idxMap.get(m.id)}]: prereq "${prereq}" [${idxMap.get(prereq)}] comes after!`);
      issues++;
    }
  }
}

if (issues === 0) {
  console.log('✅ All prerequisite chains valid across all 156 modules');
} else {
  console.log(`❌ ${issues} issues remain`);
}
