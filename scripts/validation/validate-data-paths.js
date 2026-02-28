#!/usr/bin/env node

/**
 * Script para verificar todos los links y rutas de los modos de aprendizaje
 * Revisa que todos los archivos referenciados en learningModules.json existan
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
 * Verifica si un archivo existe
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normaliza la ruta de datos
 */
function normalizeDataPath(dataPath) {
  // Si ya incluye 'data/', lo removemos para evitar duplicación
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
 * Verifica la estructura de un archivo de datos
 */
async function validateDataFile(filePath, learningMode) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Los archivos pueden ser arrays directos o objetos con propiedad 'data'
    const items = Array.isArray(data) ? data : (data.data || []);

    // Verificaciones básicas
    const checks = {
      hasData: Array.isArray(items) && items.length > 0,
      hasValidStructure: true // Se puede expandir según el modo
    };

    if (!checks.hasData) {
      return {
        valid: false,
        itemCount: 0,
        checks,
        error: 'No data array found or empty'
      };
    }

    // Verificaciones específicas por modo
    switch (learningMode) {
      case 'flashcard':
        checks.hasValidStructure = items.every(item => 
          (item.word && item.translation) || 
          (item.front && item.back) ||
          (item.en && item.es)
        );
        break;
      case 'quiz':
        checks.hasValidStructure = items.every(item => 
          item.question && Array.isArray(item.options) && 
          (typeof item.correct === 'number' || typeof item.correct === 'string')
        );
        break;
      case 'matching':
        checks.hasValidStructure = items.every(item => 
          (item.term && item.definition) || (item.left && item.right)
        );
        break;
      case 'completion':
        checks.hasValidStructure = items.every(item => 
          item.sentence && item.correct
        );
        break;
      case 'sorting':
        // Para sorting, verificar si tiene estructura con categories o es array directo
        if (data.categories && Array.isArray(data.categories)) {
          // Estructura con categories separadas
          checks.hasValidStructure = items.every(item => 
            (item.item && item.category) || (item.word && item.category)
          );
        } else {
          // Array directo
          checks.hasValidStructure = items.every(item => 
            (item.item && item.category) || (item.word && item.category)
          );
        }
        break;
    }

    return {
      valid: checks.hasData && checks.hasValidStructure,
      itemCount: items.length,
      checks
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      itemCount: 0,
      checks: {}
    };
  }
}

/**
 * Función principal
 */
async function main() {
  log.title('🔍 VERIFICACIÓN DE LINKS Y RUTAS DE MODOS DE APRENDIZAJE');

  // 1. Verificar que learningModules.json existe
  const modulesPath = path.join(projectRoot, 'public', 'data', 'learningModules.json');
  
  if (!(await fileExists(modulesPath))) {
    log.error('learningModules.json no encontrado');
    process.exit(1);
  }

  log.success('learningModules.json encontrado');

  // 2. Cargar y parsear learningModules.json
  let modules;
  try {
    const content = await fs.readFile(modulesPath, 'utf-8');
    modules = JSON.parse(content);
    log.success(`${modules.length} módulos cargados`);
  } catch (error) {
    log.error(`Error al parsear learningModules.json: ${error.message}`);
    process.exit(1);
  }

  // 3. Verificar cada módulo
  log.title('📋 VERIFICACIÓN DE MÓDULOS');

  const results = {
    total: modules.length,
    valid: 0,
    invalid: 0,
    missing: 0,
    byMode: {}
  };

  for (const module of modules) {
    const { id, name, learningMode, dataPath } = module;
    
    log.info(`Verificando: ${id} (${learningMode})`);

    if (!dataPath) {
      log.warning(`  Sin dataPath definido`);
      results.invalid++;
      continue;
    }

    // Construir ruta completa
    const fullPath = buildFullPath(dataPath);
    const exists = await fileExists(fullPath);

    if (!exists) {
      log.error(`  Archivo no encontrado: ${dataPath}`);
      log.error(`  Ruta completa: ${fullPath}`);
      results.missing++;
      continue;
    }

    // Validar contenido del archivo
    const validation = await validateDataFile(fullPath, learningMode);

    if (validation.valid) {
      log.success(`  ✓ Válido (${validation.itemCount} elementos)`);
      results.valid++;
    } else {
      log.error(`  ✗ Inválido: ${validation.error || 'Estructura incorrecta'}`);
      if (validation.checks) {
        Object.entries(validation.checks).forEach(([check, passed]) => {
          if (!passed) {
            log.error(`    - ${check}: FALLO`);
          }
        });
      }
      results.invalid++;
    }

    // Estadísticas por modo
    if (!results.byMode[learningMode]) {
      results.byMode[learningMode] = { total: 0, valid: 0, invalid: 0 };
    }
    results.byMode[learningMode].total++;
    if (validation.valid) {
      results.byMode[learningMode].valid++;
    } else {
      results.byMode[learningMode].invalid++;
    }
  }

  // 4. Verificar archivos huérfanos (archivos que existen pero no están referenciados)
  log.title('🔍 VERIFICACIÓN DE ARCHIVOS HUÉRFANOS');

  const dataDir = path.join(projectRoot, 'public', 'data');
  const referencedFiles = new Set(modules.map(m => normalizeDataPath(m.dataPath || '')));
  
  async function checkDirectory(dir, relativePath = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        await checkDirectory(
          path.join(dir, entry.name), 
          path.join(relativePath, entry.name)
        );
      } else if (entry.name.endsWith('.json') && entry.name !== 'learningModules.json' && entry.name !== 'app-config.json') {
        const filePath = path.join(relativePath, entry.name);
        if (!referencedFiles.has(filePath)) {
          log.warning(`Archivo huérfano encontrado: ${filePath}`);
        }
      }
    }
  }

  await checkDirectory(dataDir);

  // 5. Resumen final
  log.title('📊 RESUMEN FINAL');

  console.log(`Total de módulos: ${results.total}`);
  console.log(`${colors.green}Válidos: ${results.valid}${colors.reset}`);
  console.log(`${colors.red}Inválidos: ${results.invalid}${colors.reset}`);
  console.log(`${colors.red}Archivos faltantes: ${results.missing}${colors.reset}`);

  console.log('\nPor modo de aprendizaje:');
  Object.entries(results.byMode).forEach(([mode, stats]) => {
    console.log(`  ${mode}: ${stats.valid}/${stats.total} válidos`);
  });

  // 6. Verificar configuración de rutas en el código
  log.title('🔧 VERIFICACIÓN DE CONFIGURACIÓN DE RUTAS');

  const pathUtilsPath = path.join(projectRoot, 'src', 'utils', 'pathUtils.ts');
  if (await fileExists(pathUtilsPath)) {
    log.success('pathUtils.ts encontrado');
    
    const pathUtilsContent = await fs.readFile(pathUtilsPath, 'utf-8');
    
    // Verificar que getAssetPath maneja correctamente el prefijo 'data/'
    if (pathUtilsContent.includes('data/')) {
      log.success('getAssetPath maneja correctamente el prefijo data/');
    } else {
      log.warning('Verificar manejo del prefijo data/ en getAssetPath');
    }
  } else {
    log.error('pathUtils.ts no encontrado');
  }

  // Código de salida
  const hasErrors = results.invalid > 0 || results.missing > 0;
  if (hasErrors) {
    log.error('\n❌ Se encontraron errores en la verificación');
    process.exit(1);
  } else {
    log.success('\n✅ Todos los links y rutas son válidos');
    process.exit(0);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Error durante la verificación:', error);
    process.exit(1);
  });
}

export { main as checkAllLinks };