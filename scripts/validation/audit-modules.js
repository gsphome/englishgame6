#!/usr/bin/env node
/**
 * Auditoría completa de módulos de aprendizaje.
 * 
 * Pasadas:
 *   AM-1  Cobertura Mode × Nivel (matriz 6×6)
 *   AM-2  Cobertura Category × Nivel
 *   AM-3  Anomalías de naming (ID no coincide con learningMode)
 *   AM-4  Cadena de prerequisites (ciclos, rotos, huérfanos)
 *   AM-5  Balance de contenido (items por módulo vs umbrales)
 *   AM-6  Tiempo estimado vs items reales
 *   AM-7  Resumen ejecutivo con recomendaciones
 *
 * Uso: node scripts/validation/audit-modules.js [--json]
 *   --json  Exporta resultados a scripts/validation/audit-modules-report.json
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { logHeader, logInfo, logSuccess, logWarning, logError, logDivider } from '../utils/logger.js';

const DATA_DIR = 'public/data';
const MODULES_PATH = join(DATA_DIR, 'learningModules.json');
const CONFIG_PATH = join(DATA_DIR, 'app-config.json');

const modules = JSON.parse(readFileSync(MODULES_PATH, 'utf-8'));
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
const MODES = ['reading', 'flashcard', 'matching', 'sorting', 'completion', 'quiz'];
const CATEGORIES = config.learningSettings.categories;

const MIN_ITEMS = { flashcard: 40, quiz: 20, completion: 25, sorting: 30, matching: 20, reading: 4, reordering: 5, transformation: 20, 'error-correction': 20, 'word-formation': 20 };

/** Time formulas matching validate-content.js */
const TIME_FORMULAS = {
  flashcard:          (c) => Math.max(1, Math.round(c * 5 / 60)),
  quiz:               (c) => Math.max(2, Math.round(Math.min(c, 15) * 20 / 60)),
  completion:         (c) => Math.max(2, Math.round(Math.min(c, 15) * 20 / 60)),
  sorting:            (c) => Math.max(2, Math.round(Math.min(c, 20) * 10 / 60)),
  matching:           (c) => Math.max(1, Math.round(Math.min(c, 10) * 15 / 60)),
  reading:            (c) => Math.max(3, Math.round(c * 0.9)),
  reordering:         (c) => Math.max(2, Math.round(Math.min(c, 12) * 15 / 60)),
  transformation:     (c) => Math.max(2, Math.round(Math.min(c, 12) * 20 / 60)),
  'error-correction': (c) => Math.max(2, Math.round(Math.min(c, 12) * 20 / 60)),
  'word-formation':   (c) => Math.max(2, Math.round(Math.min(c, 12) * 15 / 60)),
};

const exportJson = process.argv.includes('--json');
const report = { passes: {}, summary: { total: 0, warnings: 0, errors: 0 } };
let warnings = 0;
let errors = 0;

function getLevel(mod) {
  return Array.isArray(mod.level) ? mod.level[0] : mod.level;
}

function countItems(filePath, mode) {
  try {
    const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
    if (mode === 'reading') return raw.sections ? raw.sections.length : 0;
    if (Array.isArray(raw)) return raw.length;
    if (raw.data) return raw.data.length;
    return 0;
  } catch { return -1; }
}

// ─── AM-1: Mode × Level coverage ───────────────────────────────────────────
function passAM1() {
  logHeader('AM-1: Cobertura Mode × Nivel');
  const matrix = {};
  for (const mode of MODES) {
    matrix[mode] = {};
    for (const level of LEVELS) matrix[mode][level] = 0;
  }
  for (const mod of modules) {
    if (matrix[mod.learningMode]) matrix[mod.learningMode][getLevel(mod)]++;
  }

  // Print matrix
  const header = ['Mode', ...LEVELS.map(l => l.toUpperCase())].map(h => h.padEnd(12)).join('');
  logInfo(header);
  logDivider('-', 84);

  const gaps = [];
  for (const mode of MODES) {
    const row = [mode.padEnd(12), ...LEVELS.map(l => String(matrix[mode][l]).padEnd(12))].join('');
    console.log(row);
    for (const level of LEVELS) {
      if (matrix[mode][level] === 0) gaps.push({ mode, level });
    }
  }

  if (gaps.length > 0) {
    console.log('');
    for (const g of gaps) {
      logWarning(`Sin módulos: ${g.mode} en ${g.level.toUpperCase()}`);
      warnings++;
    }
  } else {
    console.log('');
    logSuccess('Todos los modos tienen al menos 1 módulo por nivel');
  }

  report.passes['AM-1'] = { matrix, gaps };
}

// ─── AM-2: Category × Level coverage ───────────────────────────────────────
function passAM2() {
  logHeader('AM-2: Cobertura Category × Nivel');
  const matrix = {};
  for (const cat of CATEGORIES) {
    matrix[cat] = {};
    for (const level of LEVELS) matrix[cat][level] = 0;
  }
  for (const mod of modules) {
    if (matrix[mod.category]) matrix[mod.category][getLevel(mod)]++;
  }

  const empty = [];
  const partial = [];

  for (const cat of CATEGORIES) {
    const counts = LEVELS.map(l => matrix[cat][l]);
    const total = counts.reduce((a, b) => a + b, 0);
    if (total === 0) {
      empty.push(cat);
    } else {
      const missing = LEVELS.filter(l => matrix[cat][l] === 0);
      if (missing.length > 0) partial.push({ cat, missing });
    }
  }

  if (empty.length > 0) {
    for (const cat of empty) {
      logWarning(`Categoría sin contenido en ningún nivel: ${cat}`);
      warnings++;
    }
  }
  if (partial.length > 0) {
    for (const p of partial) {
      logInfo(`${p.cat}: falta en ${p.missing.map(l => l.toUpperCase()).join(', ')}`);
    }
  }
  if (empty.length === 0 && partial.length === 0) {
    logSuccess('Todas las categorías cubiertas en todos los niveles');
  }

  report.passes['AM-2'] = { empty, partial: partial.map(p => ({ category: p.cat, missingLevels: p.missing })) };
}

// ─── AM-3: Naming anomalies ────────────────────────────────────────────────
function passAM3() {
  logHeader('AM-3: Anomalías de naming');
  const anomalies = [];

  // Modes with hyphens need special handling
  const HYPHENATED_MODES = ['error-correction', 'word-formation'];

  for (const mod of modules) {
    // Extract ID prefix: check hyphenated modes first, then fall back to first segment
    let idPrefix = mod.id.split('-')[0];
    for (const hm of HYPHENATED_MODES) {
      if (mod.id.startsWith(hm + '-')) {
        idPrefix = hm;
        break;
      }
    }
    const expectedPrefix = mod.learningMode;

    // Check if ID prefix matches learningMode
    if (idPrefix !== expectedPrefix) {
      anomalies.push({
        id: mod.id,
        idPrefix,
        learningMode: mod.learningMode,
        issue: `ID prefix "${idPrefix}" ≠ learningMode "${mod.learningMode}"`
      });
    }

    // Check dataPath matches learningMode
    const fileName = mod.dataPath.split('/').pop();
    if (!fileName.includes(mod.learningMode) && mod.learningMode !== 'reading') {
      anomalies.push({
        id: mod.id,
        dataPath: mod.dataPath,
        learningMode: mod.learningMode,
        issue: `dataPath no contiene "${mod.learningMode}"`
      });
    }
  }

  if (anomalies.length > 0) {
    for (const a of anomalies) {
      logWarning(`${a.id}: ${a.issue}`);
      warnings++;
    }
  } else {
    logSuccess('Todos los IDs coinciden con su learningMode');
  }

  report.passes['AM-3'] = { anomalies };
}

// ─── AM-4: Prerequisites chain ─────────────────────────────────────────────
function passAM4() {
  logHeader('AM-4: Cadena de prerequisites');
  const idSet = new Set(modules.map(m => m.id));
  const issues = [];

  // Check broken references
  for (const mod of modules) {
    for (const prereq of mod.prerequisites) {
      if (!idSet.has(prereq)) {
        issues.push({ id: mod.id, type: 'broken', prereq });
        errors++;
      }
    }
  }

  // Check cycles (DFS)
  function hasCycle(startId, visited = new Set(), stack = new Set()) {
    if (stack.has(startId)) return true;
    if (visited.has(startId)) return false;
    visited.add(startId);
    stack.add(startId);
    const mod = modules.find(m => m.id === startId);
    if (mod) {
      for (const prereq of mod.prerequisites) {
        if (hasCycle(prereq, visited, stack)) return true;
      }
    }
    stack.delete(startId);
    return false;
  }

  for (const mod of modules) {
    if (hasCycle(mod.id)) {
      issues.push({ id: mod.id, type: 'cycle' });
      errors++;
    }
  }

  // Check orphans (modules not referenced by any other module's prerequisites, except last in chain)
  const referenced = new Set(modules.flatMap(m => m.prerequisites));
  const lastPerLevel = {};
  for (const mod of modules) {
    const level = getLevel(mod);
    lastPerLevel[level] = mod.id; // last one wins (linear order)
  }
  const lastIds = new Set(Object.values(lastPerLevel));

  for (const mod of modules) {
    if (!referenced.has(mod.id) && mod.prerequisites.length > 0 && !lastIds.has(mod.id)) {
      issues.push({ id: mod.id, type: 'unreachable', note: 'No es prerequisite de ningún otro módulo' });
      warnings++;
    }
  }

  // Check level transitions
  const reviewModules = modules.filter(m => m.category === 'Review');
  for (let i = 0; i < LEVELS.length - 1; i++) {
    const currentLevel = LEVELS[i];
    const nextLevel = LEVELS[i + 1];
    const review = reviewModules.find(m => getLevel(m) === currentLevel);
    if (!review) {
      issues.push({ type: 'missing-review', level: currentLevel });
      warnings++;
      continue;
    }
    const firstNext = modules.find(m => getLevel(m) === nextLevel && m.prerequisites.length > 0);
    if (firstNext && !firstNext.prerequisites.includes(review.id)) {
      issues.push({
        type: 'broken-transition',
        from: currentLevel,
        to: nextLevel,
        expected: review.id,
        actual: firstNext.prerequisites
      });
      warnings++;
    }
  }

  if (issues.length > 0) {
    for (const i of issues) {
      if (i.type === 'broken') logError(`${i.id}: prerequisite "${i.prereq}" no existe`);
      else if (i.type === 'cycle') logError(`${i.id}: ciclo detectado en prerequisites`);
      else if (i.type === 'unreachable') logWarning(`${i.id}: ${i.note}`);
      else if (i.type === 'missing-review') logWarning(`${i.level.toUpperCase()}: sin módulo Review`);
      else if (i.type === 'broken-transition') logWarning(`Transición ${i.from.toUpperCase()}→${i.to.toUpperCase()}: primer módulo no depende de ${i.expected}`);
    }
  } else {
    logSuccess('Cadena de prerequisites íntegra');
  }

  report.passes['AM-4'] = { issues };
}

// ─── AM-5: Content balance ─────────────────────────────────────────────────
function passAM5() {
  logHeader('AM-5: Balance de contenido');
  const issues = [];

  for (const mod of modules) {
    const filePath = join(DATA_DIR, mod.dataPath.replace('data/', ''));
    if (!existsSync(filePath)) continue;

    const count = countItems(filePath, mod.learningMode);
    if (count < 0) continue;

    const min = MIN_ITEMS[mod.learningMode] || 20;
    if (count < min) {
      issues.push({ id: mod.id, mode: mod.learningMode, count, min, deficit: min - count });
      logWarning(`${mod.id}: ${count} items (mínimo ${min}, faltan ${min - count})`);
      warnings++;
    }
  }

  if (issues.length === 0) {
    logSuccess('Todos los módulos cumplen umbrales mínimos');
  } else {
    logInfo(`${issues.length} módulo(s) bajo el umbral`);
  }

  report.passes['AM-5'] = { belowThreshold: issues, thresholds: MIN_ITEMS };
}

// ─── AM-6: Estimated time vs actual items ──────────────────────────────────
function passAM6() {
  logHeader('AM-6: Tiempo estimado vs items');
  const issues = [];

  for (const mod of modules) {
    if (!mod.estimatedTime) continue;
    const filePath = join(DATA_DIR, mod.dataPath.replace('data/', ''));
    if (!existsSync(filePath)) continue;

    const count = countItems(filePath, mod.learningMode);
    if (count <= 0) continue;

    const formula = TIME_FORMULAS[mod.learningMode];
    if (!formula) continue;
    const expectedTime = formula(count);
    const diff = Math.abs(mod.estimatedTime - expectedTime);

    // Flag if estimated time differs from formula
    if (diff > 1) {
      issues.push({
        id: mod.id,
        mode: mod.learningMode,
        items: count,
        estimated: mod.estimatedTime,
        calculated: expectedTime,
      });
      logWarning(`${mod.id}: estimado ${mod.estimatedTime}min, calculado ${expectedTime}min (${count} items)`);
      warnings++;
    }
  }

  if (issues.length === 0) {
    logSuccess('Tiempos estimados razonables');
  } else {
    logInfo(`${issues.length} módulo(s) con tiempo estimado desajustado`);
  }

  report.passes['AM-6'] = { timeIssues: issues };
}

// ─── AM-7: Executive summary ───────────────────────────────────────────────
function passAM7() {
  logHeader('AM-7: Resumen ejecutivo');

  const totalByLevel = {};
  const totalTimeByLevel = {};
  for (const level of LEVELS) {
    const levelMods = modules.filter(m => getLevel(m) === level);
    totalByLevel[level] = levelMods.length;
    totalTimeByLevel[level] = levelMods.reduce((sum, m) => sum + (m.estimatedTime || 0), 0);
  }

  logInfo(`Total módulos: ${modules.length}`);
  console.log('');
  for (const level of LEVELS) {
    logInfo(`${level.toUpperCase()}: ${totalByLevel[level]} módulos, ~${totalTimeByLevel[level]} min`);
  }

  console.log('');
  logDivider('─', 50);

  // Recommendations
  const recs = [];

  // Check for naming anomalies
  const am3 = report.passes['AM-3'];
  if (am3?.anomalies?.length > 0) {
    recs.push(`Corregir ${am3.anomalies.length} anomalía(s) de naming (IDs con prefijo incorrecto)`);
  }

  // Check for empty categories
  const am2 = report.passes['AM-2'];
  if (am2?.empty?.length > 0) {
    recs.push(`Categorías sin contenido: ${am2.empty.join(', ')} (requieren componentes nuevos o decisión de eliminar)`);
  }

  // Check for mode gaps
  const am1 = report.passes['AM-1'];
  if (am1?.gaps?.length > 0) {
    const actionable = am1.gaps.filter(g => !['Pronunciation', 'Listening', 'Writing', 'Speaking'].includes(g.mode));
    if (actionable.length > 0) {
      recs.push(`Gaps de modo cubribles: ${actionable.map(g => `${g.mode}@${g.level.toUpperCase()}`).join(', ')}`);
    }
  }

  // Check content balance
  const am5 = report.passes['AM-5'];
  if (am5?.belowThreshold?.length > 0) {
    recs.push(`${am5.belowThreshold.length} módulo(s) bajo umbral mínimo de items`);
  }

  if (recs.length > 0) {
    logInfo('Recomendaciones:');
    recs.forEach((r, i) => logInfo(`  ${i + 1}. ${r}`));
  } else {
    logSuccess('Sin recomendaciones pendientes');
  }

  report.summary = { total: modules.length, warnings, errors, recommendations: recs };
}

// ─── Main ──────────────────────────────────────────────────────────────────
function main() {
  logHeader('🔍 AUDITORÍA DE MÓDULOS DE APRENDIZAJE');
  logInfo(`${modules.length} módulos, ${LEVELS.length} niveles, ${MODES.length} modos\n`);

  passAM1();
  passAM2();
  passAM3();
  passAM4();
  passAM5();
  passAM6();
  passAM7();

  console.log('');
  logDivider('═', 60);
  if (errors > 0) logError(`${errors} error(es), ${warnings} advertencia(s)`);
  else if (warnings > 0) logWarning(`0 errores, ${warnings} advertencia(s)`);
  else logSuccess('Auditoría completada sin problemas');

  if (exportJson) {
    const outPath = 'scripts/validation/audit-modules-report.json';
    writeFileSync(outPath, JSON.stringify(report, null, 2));
    logInfo(`Reporte exportado: ${outPath}`);
  }

  return errors === 0;
}

const passed = main();
process.exit(passed ? 0 : 1);
