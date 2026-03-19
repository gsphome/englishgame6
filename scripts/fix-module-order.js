import { readFileSync, writeFileSync } from 'fs';

const modulesPath = 'public/data/learningModules.json';
const modules = JSON.parse(readFileSync(modulesPath, 'utf-8'));

// Build id->module map
const byId = new Map();
modules.forEach(m => byId.set(m.id, m));

function findIdx(id) {
  return modules.findIndex(m => m.id === id);
}

function removeModule(id) {
  const idx = findIdx(id);
  if (idx === -1) throw new Error(`Module not found: ${id}`);
  return modules.splice(idx, 1)[0];
}

function insertBefore(targetId, mod) {
  const idx = findIdx(targetId);
  if (idx === -1) throw new Error(`Target not found: ${targetId}`);
  modules.splice(idx, 0, mod);
}

// ============================================================
// REORDERING PLAN per level:
//
// The readings should introduce PV/idioms BEFORE practice.
// The vocab reinforcement modules (flashcard/quiz/completion/matching)
// stay after the practice as review/reinforcement — that's fine.
//
// New chain per level:
//   ... → [last before PV] → PV_READING → IDIOM_READING → [first PV practice] → ... → [last idiom practice] → [vocab reinforcement modules] → REVIEW
//
// For B2: idiom reading should go before first idiom module (flashcard-time-idioms-b2)
//         PV reading should go before first PV module (matching-phrasal-verbs-b2)
// ============================================================

const fixes = [
  // A1: readings before PV/idiom practice
  {
    level: 'A1',
    pvReading: 'reading-phrasal-verbs-a1',
    idiomReading: 'reading-idioms-a1',
    insertPVBefore: 'matching-basic-phrasal-verbs-a1',      // first PV practice
    insertIdiomBefore: 'flashcard-basic-idioms-a1',          // first idiom practice
    pvReadingPrereq: 'sorting-verb-tenses-a1',               // module right before first PV practice
    idiomReadingPrereq: 'reading-phrasal-verbs-a1',          // chain: PV reading → idiom reading
    firstPVNewPrereq: 'reading-idioms-a1',                   // first PV practice now requires idiom reading
    // The vocab modules that were after the readings need new prereqs
    vocabChainStart: 'flashcard-daily-life-vocab-a1',
    vocabChainStartPrereq: 'quiz-basic-idioms-a1',           // last idiom practice
  },
  // A2
  {
    level: 'A2',
    pvReading: 'reading-phrasal-verbs-a2',
    idiomReading: 'reading-idioms-a2',
    insertPVBefore: 'matching-elementary-phrasal-verbs-a2',
    insertIdiomBefore: 'flashcard-elementary-idioms-a2',
    pvReadingPrereq: 'completion-present-perfect-a2',
    idiomReadingPrereq: 'reading-phrasal-verbs-a2',
    firstPVNewPrereq: 'reading-idioms-a2',
    vocabChainStart: 'flashcard-culture-health-vocab-a2',
    vocabChainStartPrereq: 'quiz-elementary-idioms-a2',
  },
  // B1
  {
    level: 'B1',
    pvReading: 'reading-phrasal-verbs-b1',
    idiomReading: 'reading-idioms-b1',
    insertPVBefore: 'matching-common-phrasal-verbs-b1',
    insertIdiomBefore: 'flashcard-everyday-idioms-b1',
    pvReadingPrereq: 'quiz-passive-voice-b1',
    idiomReadingPrereq: 'reading-phrasal-verbs-b1',
    firstPVNewPrereq: 'reading-idioms-b1',
    vocabChainStart: 'flashcard-reading-vocab-b1',
    vocabChainStartPrereq: 'quiz-idioms-challenge-b1',
  },
  // B2: more complex — PV reading before PV practice, idiom reading before idiom practice
  // But idioms come before PV in B2's chain, so we need:
  //   ... completion-passive-advanced-b2 → reading-idioms-b2 → flashcard-time-idioms-b2 → ... → reading-phrasal-verbs-b2 → matching-phrasal-verbs-b2 → ...
  {
    level: 'B2',
    pvReading: 'reading-phrasal-verbs-b2',
    idiomReading: 'reading-idioms-b2',
    insertIdiomBefore: 'flashcard-time-idioms-b2',           // first idiom module
    insertPVBefore: 'matching-phrasal-verbs-b2',             // first PV practice
    idiomReadingPrereq: 'quiz-success-failure-b2',           // module before first idiom
    pvReadingPrereq: 'completion-passive-advanced-b2',       // module before first PV practice
    firstIdiomNewPrereq: 'reading-idioms-b2',
    firstPVNewPrereq: 'reading-phrasal-verbs-b2',
    vocabChainStart: 'flashcard-reading-vocab-b2',
    vocabChainStartPrereq: 'quiz-phrasal-verbs-b2',
    reverseOrder: true, // idiom reading goes first in B2
  },
  // C1: combined reading
  {
    level: 'C1',
    pvReading: 'reading-phrasal-verbs-idioms-c1',
    idiomReading: null, // combined into one
    insertPVBefore: 'matching-advanced-phrasal-verbs-c1',
    pvReadingPrereq: 'completion-advanced-grammar-subjunctive-c1',
    firstPVNewPrereq: 'reading-phrasal-verbs-idioms-c1',
    vocabChainStart: 'flashcard-reading-vocab-c1',
    vocabChainStartPrereq: 'quiz-phrasal-verbs-c1',
  },
  // C2: combined reading
  {
    level: 'C2',
    pvReading: 'reading-phrasal-verbs-idioms-c2',
    idiomReading: null,
    insertPVBefore: 'matching-mastery-phrasal-verbs-c2',
    pvReadingPrereq: 'sorting-nuance-vocabulary-c2',
    firstPVNewPrereq: 'reading-phrasal-verbs-idioms-c2',
    vocabChainStart: 'flashcard-reading-vocab-c2',
    vocabChainStartPrereq: 'quiz-mastery-idioms-c2',
  }
];

for (const fix of fixes) {
  console.log(`\n--- ${fix.level} ---`);
  
  if (fix.reverseOrder) {
    // B2 special case: idiom reading and PV reading are separate insertions
    
    // 1. Remove both readings
    const idiomMod = removeModule(fix.idiomReading);
    const pvMod = removeModule(fix.pvReading);
    
    // 2. Insert idiom reading before first idiom practice
    idiomMod.prerequisites = [fix.idiomReadingPrereq];
    insertBefore(fix.insertIdiomBefore, idiomMod);
    // Update first idiom's prereq
    byId.get(fix.insertIdiomBefore).prerequisites = [fix.idiomReading];
    console.log(`  ✅ Moved ${fix.idiomReading} before ${fix.insertIdiomBefore}`);
    
    // 3. Insert PV reading before first PV practice
    pvMod.prerequisites = [fix.pvReadingPrereq];
    insertBefore(fix.insertPVBefore, pvMod);
    byId.get(fix.insertPVBefore).prerequisites = [fix.pvReading];
    console.log(`  ✅ Moved ${fix.pvReading} before ${fix.insertPVBefore}`);
    
    // 4. Update vocab chain
    byId.get(fix.vocabChainStart).prerequisites = [fix.vocabChainStartPrereq];
    console.log(`  ✅ Updated ${fix.vocabChainStart} prereq → ${fix.vocabChainStartPrereq}`);
    
  } else if (fix.idiomReading) {
    // A1, A2, B1: two separate readings, PV first then idiom
    
    // 1. Remove both readings
    const pvMod = removeModule(fix.pvReading);
    const idiomMod = removeModule(fix.idiomReading);
    
    // 2. Insert PV reading before first PV practice
    pvMod.prerequisites = [fix.pvReadingPrereq];
    insertBefore(fix.insertPVBefore, pvMod);
    console.log(`  ✅ Moved ${fix.pvReading} before ${fix.insertPVBefore}`);
    
    // 3. Insert idiom reading before first idiom practice
    idiomMod.prerequisites = [fix.idiomReadingPrereq];
    insertBefore(fix.insertIdiomBefore, idiomMod);
    console.log(`  ✅ Moved ${fix.idiomReading} before ${fix.insertIdiomBefore}`);
    
    // 4. Update first PV practice prereq to point to idiom reading
    byId.get(fix.insertPVBefore).prerequisites = [fix.firstPVNewPrereq];
    console.log(`  ✅ Updated ${fix.insertPVBefore} prereq → ${fix.firstPVNewPrereq}`);
    
    // 5. Update vocab chain start prereq
    byId.get(fix.vocabChainStart).prerequisites = [fix.vocabChainStartPrereq];
    console.log(`  ✅ Updated ${fix.vocabChainStart} prereq → ${fix.vocabChainStartPrereq}`);
    
  } else {
    // C1, C2: single combined reading
    
    // 1. Remove reading
    const pvMod = removeModule(fix.pvReading);
    
    // 2. Insert before first PV practice
    pvMod.prerequisites = [fix.pvReadingPrereq];
    insertBefore(fix.insertPVBefore, pvMod);
    console.log(`  ✅ Moved ${fix.pvReading} before ${fix.insertPVBefore}`);
    
    // 3. Update first PV practice prereq
    byId.get(fix.insertPVBefore).prerequisites = [fix.firstPVNewPrereq];
    console.log(`  ✅ Updated ${fix.insertPVBefore} prereq → ${fix.firstPVNewPrereq}`);
    
    // 4. Update vocab chain
    byId.get(fix.vocabChainStart).prerequisites = [fix.vocabChainStartPrereq];
    console.log(`  ✅ Updated ${fix.vocabChainStart} prereq → ${fix.vocabChainStartPrereq}`);
  }
}

// Write back
writeFileSync(modulesPath, JSON.stringify(modules, null, 2) + '\n');
console.log(`\n🎉 learningModules.json updated. Total: ${modules.length} modules.`);

// Verify: re-check order
console.log('\n============================================================');
console.log('🔍 VERIFICACIÓN POST-FIX');
console.log('============================================================\n');

const idxMap2 = new Map();
modules.forEach((m, i) => idxMap2.set(m.id, i));

const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
let issues = 0;

for (const level of levels) {
  const levelModules = modules.filter(m => m.level.includes(level));
  
  // Find reading modules
  const pvReadings = levelModules.filter(m => 
    (m.id.includes('reading-phrasal-verb') || m.id.includes('reading-phrasal-verbs-idioms')) && 
    m.id.endsWith(level)
  );
  const idiomReadings = levelModules.filter(m => 
    m.id.includes('reading-idiom') && m.id.endsWith(level)
  );
  
  // Find practice modules
  const pvPractice = levelModules.filter(m => m.category === 'PhrasalVerbs' && !m.id.includes('reading-'));
  const idiomPractice = levelModules.filter(m => m.category === 'Idioms' && !m.id.includes('reading-'));
  
  for (const r of pvReadings) {
    if (pvPractice.length > 0) {
      const rIdx = idxMap2.get(r.id);
      const pIdx = idxMap2.get(pvPractice[0].id);
      if (rIdx >= pIdx) {
        console.log(`❌ ${level.toUpperCase()}: ${r.id} [${rIdx}] still after ${pvPractice[0].id} [${pIdx}]`);
        issues++;
      } else {
        console.log(`✅ ${level.toUpperCase()}: PV reading [${rIdx}] before PV practice [${pIdx}]`);
      }
    }
  }
  
  for (const r of idiomReadings) {
    if (idiomPractice.length > 0) {
      const rIdx = idxMap2.get(r.id);
      const pIdx = idxMap2.get(idiomPractice[0].id);
      if (rIdx >= pIdx) {
        console.log(`❌ ${level.toUpperCase()}: ${r.id} [${rIdx}] still after ${idiomPractice[0].id} [${pIdx}]`);
        issues++;
      } else {
        console.log(`✅ ${level.toUpperCase()}: Idiom reading [${rIdx}] before idiom practice [${pIdx}]`);
      }
    }
  }
  
  // Verify prereq chain integrity
  for (const m of levelModules) {
    for (const prereq of m.prerequisites) {
      if (!idxMap2.has(prereq)) {
        console.log(`❌ ${m.id}: prereq "${prereq}" not found!`);
        issues++;
      } else if (idxMap2.get(prereq) >= idxMap2.get(m.id)) {
        console.log(`❌ ${m.id} [${idxMap2.get(m.id)}]: prereq "${prereq}" [${idxMap2.get(prereq)}] comes after!`);
        issues++;
      }
    }
  }
}

if (issues === 0) {
  console.log('\n✅ All readings now correctly placed before practice modules');
  console.log('✅ All prerequisite chains valid');
} else {
  console.log(`\n❌ ${issues} issues remain`);
}
