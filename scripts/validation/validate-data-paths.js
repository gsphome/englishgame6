#!/usr/bin/env node

/**
 * Verifica que todos los archivos referenciados en learningModules.json
 * existan y tengan estructura válida. Detecta archivos huérfanos.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logHeader, logInfo, logSuccess, logWarning, logError } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

function normalizeDataPath(dataPath) {
  return dataPath.startsWith('data/') ? dataPath.substring(5) : dataPath;
}

function buildFullPath(dataPath) {
  return path.join(projectRoot, 'public', 'data', normalizeDataPath(dataPath));
}

async function fileExists(filePath) {
  try { await fs.access(filePath); return true; } catch { return false; }
}

/**
 * Valida la estructura de un archivo de datos según su learningMode
 */
async function validateDataFile(filePath, learningMode) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Reading tiene estructura diferente (sections, no array)
    if (learningMode === 'reading') {
      const hasTitle = typeof data.title === 'string';
      const hasSections = Array.isArray(data.sections) && data.sections.length > 0;
      return { valid: hasTitle && hasSections, itemCount: data.sections?.length || 0 };
    }

    const items = Array.isArray(data) ? data : (data.data || []);
    if (!Array.isArray(items) || items.length === 0) {
      return { valid: false, itemCount: 0, error: 'No data array found or empty' };
    }

    let structureValid = true;
    switch (learningMode) {
      case 'flashcard':
        structureValid = items.every(i => (i.word && i.translation) || (i.front && i.back) || (i.en && i.es));
        break;
      case 'quiz':
        structureValid = items.every(i => i.question && Array.isArray(i.options));
        break;
      case 'matching':
        structureValid = items.every(i => (i.term && i.definition) || (i.left && i.right));
        break;
      case 'completion':
        structureValid = items.every(i => i.sentence && i.correct);
        break;
      case 'sorting':
        structureValid = items.every(i => (i.item && i.category) || (i.word && i.category));
        break;
    }

    return { valid: structureValid, itemCount: items.length };
  } catch (error) {
    return { valid: false, error: error.message, itemCount: 0 };
  }
}


/**
 * Función principal
 */
async function main() {
  logHeader('🔍 VERIFICACIÓN DE DATOS');

  const modulesPath = path.join(projectRoot, 'public', 'data', 'learningModules.json');

  if (!(await fileExists(modulesPath))) {
    logError('learningModules.json no encontrado');
    return false;
  }

  let modules;
  try {
    const content = await fs.readFile(modulesPath, 'utf-8');
    modules = JSON.parse(content);
    logSuccess(`${modules.length} módulos cargados`);
  } catch (error) {
    logError(`Error al parsear learningModules.json: ${error.message}`);
    return false;
  }

  // Verificar cada módulo
  const results = { total: modules.length, valid: 0, invalid: 0, missing: 0, byMode: {} };

  for (const module of modules) {
    const { id, learningMode, dataPath } = module;

    if (!dataPath) { logWarning(`${id}: sin dataPath`); results.invalid++; continue; }

    const fullPath = buildFullPath(dataPath);
    if (!(await fileExists(fullPath))) {
      logError(`${id}: archivo no encontrado (${dataPath})`);
      results.missing++;
      continue;
    }

    const validation = await validateDataFile(fullPath, learningMode);
    if (validation.valid) {
      logSuccess(`${id}: ${learningMode} (${validation.itemCount} items)`);
      results.valid++;
    } else {
      logError(`${id}: ${validation.error || 'estructura incorrecta'}`);
      results.invalid++;
    }

    if (!results.byMode[learningMode]) results.byMode[learningMode] = { total: 0, valid: 0 };
    results.byMode[learningMode].total++;
    if (validation.valid) results.byMode[learningMode].valid++;
  }

  // Archivos huérfanos
  logInfo('Buscando archivos huérfanos...');
  const dataDir = path.join(projectRoot, 'public', 'data');
  const referencedFiles = new Set(modules.map(m => normalizeDataPath(m.dataPath || '')));

  async function checkOrphans(dir, relativePath = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        await checkOrphans(path.join(dir, entry.name), path.join(relativePath, entry.name));
      } else if (entry.name.endsWith('.json') && !['learningModules.json', 'app-config.json'].includes(entry.name)) {
        const filePath = path.join(relativePath, entry.name);
        if (!referencedFiles.has(filePath)) logWarning(`Huérfano: ${filePath}`);
      }
    }
  }
  await checkOrphans(dataDir);

  // Resumen
  logHeader('📊 RESUMEN');
  logInfo(`Total: ${results.total} | Válidos: ${results.valid} | Inválidos: ${results.invalid} | Faltantes: ${results.missing}`);
  Object.entries(results.byMode).forEach(([mode, s]) => logInfo(`  ${mode}: ${s.valid}/${s.total}`));

  const hasErrors = results.invalid > 0 || results.missing > 0;
  if (hasErrors) { logError('Se encontraron errores'); } else { logSuccess('Todos los datos son válidos'); }
  return !hasErrors;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(passed => process.exit(passed ? 0 : 1)).catch(e => { console.error(e); process.exit(1); });
}

export { main as checkAllLinks };
