#!/usr/bin/env node

/**
 * Script maestro de validación - ejecuta todas las verificaciones
 */

import { checkAllLinks } from './validate-data-paths.js';
import { fixModuleTypes } from './fix-module-types.js';

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

async function main() {
  log.title('🔍 VALIDACIÓN COMPLETA DE MODOS DE APRENDIZAJE');

  try {
    // 1. Verificar y corregir tipos de módulos
    log.info('Paso 1: Verificando tipos de módulos...');
    await fixModuleTypes();

    // 2. Verificar todos los links y rutas
    log.info('Paso 2: Verificando links y rutas...');
    await checkAllLinks();

    log.title('✅ VALIDACIÓN COMPLETA EXITOSA');
    console.log('Todos los modos de aprendizaje han sido verificados y están funcionando correctamente.');
    
  } catch (error) {
    log.error(`Error durante la validación: ${error.message}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as validateAll };