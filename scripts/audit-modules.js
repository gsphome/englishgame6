#!/usr/bin/env node
/**
 * Deep audit of learning modules coverage
 * Analyzes: activity types per level, categories, gaps, and balance
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const modules = JSON.parse(readFileSync('public/data/learningModules.json', 'utf-8'));
const appConfig = JSON.parse(readFileSync('public/data/app-config.json', 'utf-8'));

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
const MODES = ['reading', 'flashcard', 'matching', 'sorting', 'completion', 'quiz'];
const CATEGORIES = appConfig.learningSettings.categories;

// 1. Count modules per level
console.log('═══════════════════════════════════════════════════════════');
console.log('  MÓDULOS POR NIVEL CEFR');
console.log('═══════════════════════════════════════════════════════════');
const byLevel = {};
LEVELS.forEach(l => { byLevel[l] = modules.filter(m => {
  const lvl = Array.isArray(m.level) ? m.level : [m.level];
  return lvl.includes(l);
}); });

LEVELS.forEach(l => {
  console.log(`  ${l.toUpperCase()}: ${byLevel[l].length} módulos`);
});
console.log(`  TOTAL: ${modules.length} módulos\n`);

// 2. Activity types per level (matrix)
console.log('═══════════════════════════════════════════════════════════');
console.log('  MATRIZ: TIPO DE ACTIVIDAD × NIVEL');
console.log('═══════════════════════════════════════════════════════════');
const header = '  Mode        │ A1  │ A2  │ B1  │ B2  │ C1  │ C2  │ Total';
console.log(header);
console.log('  ────────────┼─────┼─────┼─────┼─────┼─────┼─────┼──────');

const modeByLevel = {};
MODES.forEach(mode => {
  modeByLevel[mode] = {};
  let total = 0;
  const row = LEVELS.map(l => {
    const count = byLevel[l].filter(m => m.learningMode === mode).length;
    modeByLevel[mode][l] = count;
    total += count;
    return String(count).padStart(3);
  }).join(' │ ');
  console.log(`  ${mode.padEnd(12)}│ ${row} │ ${String(total).padStart(4)}`);
});
console.log('');

// 3. Categories per level
console.log('═══════════════════════════════════════════════════════════');
console.log('  MATRIZ: CATEGORÍA × NIVEL');
console.log('═══════════════════════════════════════════════════════════');
const catHeader = '  Category     │ A1  │ A2  │ B1  │ B2  │ C1  │ C2  │ Total';
console.log(catHeader);
console.log('  ─────────────┼─────┼─────┼─────┼─────┼─────┼─────┼──────');

const usedCategories = [...new Set(modules.map(m => m.category))];
usedCategories.forEach(cat => {
  let total = 0;
  const row = LEVELS.map(l => {
    const count = byLevel[l].filter(m => m.category === cat).length;
    total += count;
    return String(count).padStart(3);
  }).join(' │ ');
  console.log(`  ${cat.padEnd(13)}│ ${row} │ ${String(total).padStart(4)}`);
});

// Show unused categories
const unusedCats = CATEGORIES.filter(c => !usedCategories.includes(c));
if (unusedCats.length > 0) {
  console.log(`\n  ⚠ Categorías definidas en app-config pero SIN módulos: ${unusedCats.join(', ')}`);
}
console.log('');

// 4. Identify gaps
console.log('═══════════════════════════════════════════════════════════');
console.log('  GAPS: COMBINACIONES FALTANTES (Mode × Level)');
console.log('═══════════════════════════════════════════════════════════');
let gapCount = 0;
MODES.forEach(mode => {
  LEVELS.forEach(l => {
    if (modeByLevel[mode][l] === 0) {
      console.log(`  ❌ ${l.toUpperCase()} no tiene módulos de tipo "${mode}"`);
      gapCount++;
    }
  });
});
if (gapCount === 0) console.log('  ✅ Todas las combinaciones tienen al menos 1 módulo');
console.log(`\n  Total gaps: ${gapCount} / ${MODES.length * LEVELS.length} combinaciones\n`);

// 5. JSON files without module registration
console.log('═══════════════════════════════════════════════════════════');
console.log('  ARCHIVOS JSON SIN REGISTRAR EN learningModules.json');
console.log('═══════════════════════════════════════════════════════════');
const registeredPaths = new Set(modules.map(m => m.dataPath));
let orphanCount = 0;
LEVELS.forEach(l => {
  const dir = `public/data/${l}`;
  try {
    const files = readdirSync(dir).filter(f => f.endsWith('.json'));
    files.forEach(f => {
      const dataPath = `data/${l}/${f}`;
      if (!registeredPaths.has(dataPath)) {
        console.log(`  📄 ${dataPath} (no registrado)`);
        orphanCount++;
      }
    });
  } catch (e) { /* dir doesn't exist */ }
});
if (orphanCount === 0) console.log('  ✅ Todos los archivos JSON están registrados');
console.log('');

// 6. Estimated time per level
console.log('═══════════════════════════════════════════════════════════');
console.log('  TIEMPO ESTIMADO POR NIVEL (minutos)');
console.log('═══════════════════════════════════════════════════════════');
LEVELS.forEach(l => {
  const totalTime = byLevel[l].reduce((sum, m) => sum + (m.estimatedTime || 0), 0);
  const avgTime = byLevel[l].length > 0 ? (totalTime / byLevel[l].length).toFixed(1) : 0;
  console.log(`  ${l.toUpperCase()}: ${totalTime} min total, ${avgTime} min promedio/módulo`);
});
console.log('');

// 7. Balance analysis
console.log('═══════════════════════════════════════════════════════════');
console.log('  ANÁLISIS DE BALANCE');
console.log('═══════════════════════════════════════════════════════════');
const counts = LEVELS.map(l => byLevel[l].length);
const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
const min = Math.min(...counts);
const max = Math.max(...counts);
const minLevel = LEVELS[counts.indexOf(min)].toUpperCase();
const maxLevel = LEVELS[counts.indexOf(max)].toUpperCase();

console.log(`  Promedio: ${avg.toFixed(1)} módulos/nivel`);
console.log(`  Mínimo: ${min} (${minLevel})`);
console.log(`  Máximo: ${max} (${maxLevel})`);
console.log(`  Desbalance: ${max - min} módulos de diferencia`);
console.log('');

// 8. Recommendations
console.log('═══════════════════════════════════════════════════════════');
console.log('  RECOMENDACIONES');
console.log('═══════════════════════════════════════════════════════════');

// Levels with fewer modules
const belowAvg = LEVELS.filter(l => byLevel[l].length < avg);
if (belowAvg.length > 0) {
  console.log(`\n  📊 Niveles por debajo del promedio (${avg.toFixed(0)}):`);
  belowAvg.forEach(l => {
    console.log(`     ${l.toUpperCase()}: ${byLevel[l].length} módulos (faltan ~${Math.ceil(avg - byLevel[l].length)})`);
  });
}

// Missing mode-level combos that would add variety
console.log('\n  🎯 Gaps prioritarios (tipos de actividad faltantes por nivel):');
const priorities = [];
MODES.forEach(mode => {
  LEVELS.forEach(l => {
    if (modeByLevel[mode][l] === 0) {
      // Check if other levels have this mode (so it's a real gap, not just unused)
      const otherLevelsHave = LEVELS.some(ol => ol !== l && modeByLevel[mode][ol] > 0);
      if (otherLevelsHave) {
        priorities.push({ mode, level: l, priority: 'HIGH' });
      }
    }
  });
});

if (priorities.length > 0) {
  priorities.forEach(p => {
    console.log(`     [${p.priority}] ${p.level.toUpperCase()} necesita "${p.mode}"`);
  });
} else {
  console.log('     ✅ No hay gaps prioritarios');
}

// Unused categories
if (unusedCats.length > 0) {
  console.log(`\n  📝 Categorías sin usar: ${unusedCats.join(', ')}`);
  console.log('     Considerar si vale la pena crear módulos para estas o eliminarlas de app-config');
}

console.log('\n═══════════════════════════════════════════════════════════\n');
