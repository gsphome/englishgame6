#!/usr/bin/env node

/**
 * Script para corregir los tipos de módulos en learningModules.json
 * Detecta automáticamente el tipo correcto basado en la estructura del archivo
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`)
};

/**
 * Detecta el tipo de aprendizaje basado en la estructura del archivo
 */
async function detectLearningMode(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    // Los archivos pueden ser arrays directos o objetos con propiedad 'data'
    const items = Array.isArray(data) ? data : (data.data || []);
    
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }

    const firstItem = items[0];

    // Detectar flashcard
    if ((firstItem.word && firstItem.translation) || 
        (firstItem.front && firstItem.back) ||
        (firstItem.en && firstItem.es)) {
      return 'flashcard';
    }

    // Detectar quiz
    if (firstItem.question && Array.isArray(firstItem.options)) {
      return 'quiz';
    }

    // Detectar matching
    if ((firstItem.term && firstItem.definition) || 
        (firstItem.left && firstItem.right)) {
      return 'matching';
    }

    // Detectar completion
    if (firstItem.sentence && firstItem.correct) {
      return 'completion';
    }

    // Detectar sorting
    if ((firstItem.item && firstItem.category) || 
        (firstItem.word && firstItem.category)) {
      return 'sorting';
    }

    return null;
  } catch (error) {
    console.error(`Error al detectar tipo para ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Normaliza la ruta de datos
 */
function normalizeDataPath(dataPath) {
  if (dataPath.startsWith('data/')) {
    return dataPath.substring(5);
  }
  return dataPath;
}

/**
 * Construye la ruta completa del archivo
 */
function buildFullPath(dataPath) {
  const normalizedPath = normalizeDataPath(dataPath);
  return path.join(projectRoot, 'public', 'data', normalizedPath);
}

/**
 * Función principal
 */
async function main() {
  log.title('🔧 CORRECCIÓN DE TIPOS DE MÓDULOS');

  // 1. Cargar learningModules.json
  const modulesPath = path.join(projectRoot, 'public', 'data', 'learningModules.json');
  
  let modules;
  try {
    const content = await fs.readFile(modulesPath, 'utf-8');
    modules = JSON.parse(content);
    log.success(`${modules.length} módulos cargados`);
  } catch (error) {
    log.error(`Error al cargar learningModules.json: ${error.message}`);
    process.exit(1);
  }

  // 2. Verificar y corregir cada módulo
  const corrections = [];
  
  for (const module of modules) {
    const { id, learningMode, dataPath } = module;
    
    if (!dataPath) {
      log.warning(`Módulo ${id} sin dataPath, omitiendo`);
      continue;
    }

    const fullPath = buildFullPath(dataPath);
    const detectedMode = await detectLearningMode(fullPath);
    
    if (!detectedMode) {
      log.error(`No se pudo detectar el tipo para ${id}`);
      continue;
    }

    if (learningMode !== detectedMode) {
      log.warning(`${id}: ${learningMode} → ${detectedMode}`);
      corrections.push({
        id,
        oldMode: learningMode,
        newMode: detectedMode,
        module
      });
      
      // Actualizar el módulo
      module.learningMode = detectedMode;
    } else {
      log.success(`${id}: ${learningMode} ✓`);
    }
  }

  // 3. Mostrar resumen de correcciones
  if (corrections.length > 0) {
    log.title('📋 CORRECCIONES REALIZADAS');
    
    corrections.forEach(({ id, oldMode, newMode }) => {
      console.log(`  ${id}: ${colors.red}${oldMode}${colors.reset} → ${colors.green}${newMode}${colors.reset}`);
    });

    // 4. Guardar archivo corregido
    await fs.writeFile(modulesPath, JSON.stringify(modules, null, 2));
    log.success(`learningModules.json actualizado con ${corrections.length} correcciones`);

    // 5. Mostrar estadísticas por modo
    log.title('📊 ESTADÍSTICAS POR MODO');
    
    const modeStats = {};
    modules.forEach(module => {
      const mode = module.learningMode;
      modeStats[mode] = (modeStats[mode] || 0) + 1;
    });

    Object.entries(modeStats).forEach(([mode, count]) => {
      console.log(`  ${mode}: ${count} módulos`);
    });

  } else {
    log.success('No se necesitaron correcciones');
  }

  log.title('✅ PROCESO COMPLETADO');
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Error durante la corrección:', error);
    process.exit(1);
  });
}

export { main as fixModuleTypes };