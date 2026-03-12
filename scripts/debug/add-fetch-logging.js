#!/usr/bin/env node

/**
 * Script para agregar logging temporal y detectar qué dispara los fetches
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

console.log('🔍 AGREGANDO LOGGING PARA DEBUG\n');

// Agregar logging en useModuleData
const useModuleDataPath = path.join(rootDir, 'src/hooks/useModuleData.ts');
let useModuleDataContent = fs.readFileSync(useModuleDataPath, 'utf-8');

// Verificar si ya tiene logging
if (!useModuleDataContent.includes('DEBUG: useModuleData called')) {
  // Agregar logging al inicio de useModuleData
  useModuleDataContent = useModuleDataContent.replace(
    'export const useModuleData = (moduleId: string) => {',
    `export const useModuleData = (moduleId: string) => {
  console.log('[DEBUG] useModuleData called for:', moduleId, new Error().stack);`
  );
  
  fs.writeFileSync(useModuleDataPath, useModuleDataContent);
  console.log('✅ Logging agregado a useModuleData');
} else {
  console.log('ℹ️  useModuleData ya tiene logging');
}

// Agregar logging en fetchModuleData
const apiServicePath = path.join(rootDir, 'src/services/api.ts');
let apiServiceContent = fs.readFileSync(apiServicePath, 'utf-8');

if (!apiServiceContent.includes('DEBUG: fetchModuleData called')) {
  // Buscar la función fetchModuleData y agregar logging
  apiServiceContent = apiServiceContent.replace(
    /export const fetchModuleData = async \(moduleId: string\): Promise<ApiResponse<LearningModule>> => \{/,
    `export const fetchModuleData = async (moduleId: string): Promise<ApiResponse<LearningModule>> => {
  console.log('[DEBUG] fetchModuleData called for:', moduleId, new Error().stack);`
  );
  
  fs.writeFileSync(apiServicePath, apiServiceContent);
  console.log('✅ Logging agregado a fetchModuleData');
} else {
  console.log('ℹ️  fetchModuleData ya tiene logging');
}

console.log('\n📋 INSTRUCCIONES:\n');
console.log('1. Ejecutar: npm run dev');
console.log('2. Abrir Chrome DevTools → Console');
console.log('3. Recargar la página');
console.log('4. Buscar logs que empiecen con [DEBUG]');
console.log('5. Revisar el stack trace para ver qué componente dispara cada fetch');
console.log('');
console.log('⚠️  IMPORTANTE: Revertir estos cambios después del debug');
console.log('   Ejecutar: node scripts/debug/remove-fetch-logging.js');
