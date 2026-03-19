import { readFileSync } from 'fs';

const modules = JSON.parse(readFileSync('public/data/learningModules.json', 'utf-8'));

// Build a map of id -> index for quick lookup
const idxMap = new Map();
modules.forEach((m, i) => idxMap.set(m.id, i));

console.log('============================================================');
console.log('🔍 ANÁLISIS DE ORDEN DE MÓDULOS');
console.log('============================================================\n');

// 1. Check reading modules that introduce phrasal verbs/idioms
// They should come BEFORE the practice modules for those topics
const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

for (const level of levels) {
  const levelModules = modules.filter(m => m.level.includes(level));
  console.log(`\n--- ${level.toUpperCase()} (${levelModules.length} modules) ---`);
  console.log('Order:');
  levelModules.forEach((m, i) => {
    const globalIdx = idxMap.get(m.id);
    const marker = m.id.includes('reading-phrasal') || m.id.includes('reading-idiom') ? ' 📖 NEW READING' :
                   m.category === 'PhrasalVerbs' ? ' 🔤 PV' :
                   m.category === 'Idioms' ? ' 💬 IDIOM' :
                   m.category === 'Review' ? ' 📝 REVIEW' : '';
    console.log(`  ${i+1}. [${globalIdx}] ${m.id} (${m.learningMode}/${m.category})${marker}`);
  });
}

console.log('\n\n============================================================');
console.log('🔍 ANÁLISIS DE PROBLEMAS DE ORDEN');
console.log('============================================================\n');

// For each level, check if reading-phrasal-verbs and reading-idioms
// come BEFORE the first PhrasalVerbs/Idioms practice module
for (const level of levels) {
  const levelModules = modules.filter(m => m.level.includes(level));
  
  // Find new reading modules
  const pvReading = levelModules.find(m => m.id.includes('reading-phrasal-verb') && m.id.includes(level));
  const idiomReading = levelModules.find(m => m.id.includes('reading-idiom') && m.id.includes(level));
  
  // Find first PV practice and first Idiom practice
  const pvPractice = levelModules.filter(m => m.category === 'PhrasalVerbs' && !m.id.includes('reading-'));
  const idiomPractice = levelModules.filter(m => m.category === 'Idioms' && !m.id.includes('reading-'));
  
  if (pvReading && pvPractice.length > 0) {
    const readingIdx = idxMap.get(pvReading.id);
    const firstPracticeIdx = idxMap.get(pvPractice[0].id);
    const status = readingIdx < firstPracticeIdx ? '✅' : '❌ WRONG ORDER';
    console.log(`${level.toUpperCase()} PV Reading [${readingIdx}] vs First PV Practice [${firstPracticeIdx}]: ${status}`);
    if (readingIdx > firstPracticeIdx) {
      console.log(`   → ${pvReading.id} should come BEFORE ${pvPractice[0].id}`);
    }
  }
  
  if (idiomReading && idiomPractice.length > 0) {
    const readingIdx = idxMap.get(idiomReading.id);
    const firstPracticeIdx = idxMap.get(idiomPractice[0].id);
    const status = readingIdx < firstPracticeIdx ? '✅' : '❌ WRONG ORDER';
    console.log(`${level.toUpperCase()} Idiom Reading [${readingIdx}] vs First Idiom Practice [${firstPracticeIdx}]: ${status}`);
    if (readingIdx > firstPracticeIdx) {
      console.log(`   → ${idiomReading.id} should come BEFORE ${idiomPractice[0].id}`);
    }
  }
  
  // Also check: new vocab flashcards should come before their quizzes
  const newFlashcard = levelModules.find(m => 
    (m.id.includes('flashcard-daily-life-vocab') || 
     m.id.includes('flashcard-culture-health') || 
     m.id.includes('flashcard-reading-vocab')) && 
    m.id.includes(level)
  );
  const newQuiz = levelModules.find(m => 
    (m.id.includes('quiz-daily-life-vocab') || 
     m.id.includes('quiz-culture-health') || 
     m.id.includes('quiz-reading-vocab')) && 
    m.id.includes(level)
  );
  
  if (newFlashcard && newQuiz) {
    const fIdx = idxMap.get(newFlashcard.id);
    const qIdx = idxMap.get(newQuiz.id);
    const status = fIdx < qIdx ? '✅' : '❌ WRONG ORDER';
    console.log(`${level.toUpperCase()} New Flashcard [${fIdx}] vs New Quiz [${qIdx}]: ${status}`);
  }
}

console.log('\n\n============================================================');
console.log('🔍 ANÁLISIS DE PREREQUISITOS');
console.log('============================================================\n');

// Check prerequisite chain integrity
let prereqIssues = 0;
for (const m of modules) {
  for (const prereq of m.prerequisites) {
    if (!idxMap.has(prereq)) {
      console.log(`❌ ${m.id}: prerequisite "${prereq}" does not exist!`);
      prereqIssues++;
    } else {
      const prereqIdx = idxMap.get(prereq);
      const moduleIdx = idxMap.get(m.id);
      if (prereqIdx >= moduleIdx) {
        console.log(`❌ ${m.id} [${moduleIdx}]: prerequisite "${prereq}" [${prereqIdx}] comes AFTER it!`);
        prereqIssues++;
      }
    }
  }
}
if (prereqIssues === 0) {
  console.log('✅ All prerequisites are valid and in correct order');
} else {
  console.log(`\n❌ Found ${prereqIssues} prerequisite issues`);
}

console.log('\n\n============================================================');
console.log('🔍 PROPUESTA DE REORDENAMIENTO');
console.log('============================================================\n');

// For each level, propose the correct order
for (const level of levels) {
  const levelModules = modules.filter(m => m.level.includes(level));
  
  const pvReading = levelModules.find(m => m.id.includes('reading-phrasal-verb') && m.id.endsWith(level));
  const idiomReading = levelModules.find(m => m.id.includes('reading-idiom') && m.id.endsWith(level));
  
  const firstPV = levelModules.find(m => m.category === 'PhrasalVerbs' && !m.id.includes('reading-'));
  const firstIdiom = levelModules.find(m => m.category === 'Idioms' && !m.id.includes('reading-'));
  
  if (pvReading && firstPV) {
    const readingIdx = idxMap.get(pvReading.id);
    const practiceIdx = idxMap.get(firstPV.id);
    if (readingIdx > practiceIdx) {
      // Find what comes before the first PV practice
      const beforePV = modules[practiceIdx - 1];
      console.log(`${level.toUpperCase()}: Move ${pvReading.id} to BEFORE ${firstPV.id}`);
      console.log(`   Current prerequisite of PV reading: ${pvReading.prerequisites.join(', ')}`);
      console.log(`   Should chain: ${beforePV?.id} → ${pvReading.id} → ${firstPV.id}`);
    }
  }
  
  if (idiomReading && firstIdiom) {
    const readingIdx = idxMap.get(idiomReading.id);
    const practiceIdx = idxMap.get(firstIdiom.id);
    if (readingIdx > practiceIdx) {
      const pvReadingForLevel = pvReading ? pvReading.id : null;
      console.log(`${level.toUpperCase()}: Move ${idiomReading.id} to BEFORE ${firstIdiom.id}`);
      console.log(`   Should chain after PV reading: ${pvReadingForLevel} → ${idiomReading.id} → ${firstIdiom.id}`);
    }
  }
}
