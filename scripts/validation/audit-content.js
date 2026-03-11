#!/usr/bin/env node
/**
 * Auditoría de contenido por módulo y nivel CEFR.
 * Compara módulos registrados en learningModules.json contra archivos JSON existentes.
 * Reporta: items por archivo, archivos huérfanos, módulos con poco contenido.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const DATA_DIR = 'public/data';
const MODULES_PATH = join(DATA_DIR, 'learningModules.json');

const modules = JSON.parse(readFileSync(MODULES_PATH, 'utf-8'));
const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

// Umbrales mínimos por modo
const MIN_ITEMS = {
  flashcard: 40,
  quiz: 20,
  completion: 25,
  sorting: 30,
  matching: 20,
  reading: 4, // sections dentro del objeto reading
};

function countItems(filePath) {
  try {
    const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
    if (Array.isArray(raw)) return { count: raw.length, type: 'array' };
    if (raw.sections) return { count: raw.sections.length, type: 'reading-obj' };
    if (raw.data) return { count: raw.data.length, type: 'data-prop' };
    return { count: Object.keys(raw).length, type: 'object' };
  } catch {
    return { count: -1, type: 'error' };
  }
}

console.log('=== AUDITORÍA DE CONTENIDO ===\n');

// 1. Resumen por nivel
const summary = {};
const issues = [];

for (const level of levels) {
  const levelModules = modules.filter(m => {
    const lvl = Array.isArray(m.level) ? m.level : [m.level];
    return lvl.includes(level);
  });

  const modeCount = {};
  let totalItems = 0;

  for (const mod of levelModules) {
    const filePath = join(DATA_DIR, mod.dataPath.replace('data/', ''));
    const exists = existsSync(filePath);

    if (!exists) {
      issues.push(`❌ FALTA ARCHIVO: ${mod.dataPath} (módulo: ${mod.id})`);
      continue;
    }

    const { count, type } = countItems(filePath);
    const mode = mod.learningMode;
    if (!modeCount[mode]) modeCount[mode] = [];
    modeCount[mode].push({ id: mod.id, file: basename(filePath), count, type });
    totalItems += Math.max(count, 0);

    const min = MIN_ITEMS[mode] || 20;
    if (count < min) {
      issues.push(`⚠️  BAJO: ${basename(filePath)} → ${count} items (mínimo ${min}) [${mode}]`);
    }
  }

  summary[level.toUpperCase()] = { modules: levelModules.length, totalItems, modes: modeCount };
}

// 2. Imprimir resumen
for (const [level, data] of Object.entries(summary)) {
  console.log(`📚 ${level}: ${data.modules} módulos, ${data.totalItems} items totales`);
  for (const [mode, files] of Object.entries(data.modes)) {
    const counts = files.map(f => `${f.file}(${f.count})`).join(', ');
    console.log(`   ${mode}: ${files.length} archivo(s) → ${counts}`);
  }
  console.log('');
}

// 3. Archivos huérfanos (existen en disco pero no en learningModules.json)
console.log('=== ARCHIVOS HUÉRFANOS ===\n');
const registeredPaths = new Set(modules.map(m => m.dataPath.replace('data/', '')));
let orphanCount = 0;

for (const level of levels) {
  const dir = join(DATA_DIR, level);
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const rel = join(level, file);
    if (!registeredPaths.has(rel)) {
      console.log(`  🔸 ${rel} (no registrado en learningModules.json)`);
      orphanCount++;
    }
  }
}
if (orphanCount === 0) console.log('  ✅ Ninguno\n');
else console.log(`\n  Total: ${orphanCount} archivo(s) huérfano(s)\n`);

// 4. Issues
if (issues.length > 0) {
  console.log('=== PROBLEMAS DETECTADOS ===\n');
  issues.forEach(i => console.log(`  ${i}`));
  console.log(`\n  Total: ${issues.length} problema(s)\n`);
} else {
  console.log('=== ✅ SIN PROBLEMAS ===\n');
}

// 5. Cobertura de modos por nivel
console.log('=== COBERTURA DE MODOS POR NIVEL ===\n');
const allModes = ['reading', 'flashcard', 'matching', 'sorting', 'completion', 'quiz'];
for (const level of levels) {
  const levelModes = new Set(
    modules
      .filter(m => (Array.isArray(m.level) ? m.level : [m.level]).includes(level))
      .map(m => m.learningMode)
  );
  const missing = allModes.filter(m => !levelModes.has(m));
  if (missing.length > 0) {
    console.log(`  ${level.toUpperCase()}: falta ${missing.join(', ')}`);
  } else {
    console.log(`  ${level.toUpperCase()}: ✅ todos los modos cubiertos`);
  }
}
console.log('');
