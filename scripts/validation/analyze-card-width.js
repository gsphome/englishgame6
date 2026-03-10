#!/usr/bin/env node

/**
 * Card Width Analysis Script
 * Analiza si aumentar el ancho de las tarjetas mejoraría la legibilidad
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🔍 ANÁLISIS DE ANCHO DE TARJETAS\n');
console.log('='.repeat(60));

// Leer datos de módulos para analizar longitud de textos
const dataDir = path.join(__dirname, '../../public/data');
const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

let totalModules = 0;
let longTitles = 0;
let veryLongTitles = 0;
let maxTitleLength = 0;
let longestTitle = '';

console.log('\n📊 ANÁLISIS DE LONGITUD DE TÍTULOS:\n');

levels.forEach(level => {
  const levelDir = path.join(dataDir, level);
  if (!fs.existsSync(levelDir)) return;

  const files = fs.readdirSync(levelDir).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const filePath = path.join(levelDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (content.name) {
      totalModules++;
      const titleLength = content.name.length;
      
      if (titleLength > maxTitleLength) {
        maxTitleLength = titleLength;
        longestTitle = content.name;
      }
      
      // Títulos largos (>20 caracteres)
      if (titleLength > 20) {
        longTitles++;
        if (titleLength > 30) {
          veryLongTitles++;
        }
      }
    }
  });
});

console.log(`Total de módulos analizados: ${totalModules}`);
console.log(`Títulos largos (>20 chars): ${longTitles} (${((longTitles/totalModules)*100).toFixed(1)}%)`);
console.log(`Títulos muy largos (>30 chars): ${veryLongTitles} (${((veryLongTitles/totalModules)*100).toFixed(1)}%)`);
console.log(`Título más largo: "${longestTitle}" (${maxTitleLength} caracteres)`);

console.log('\n📐 DIMENSIONES ACTUALES:\n');
console.log('Mobile:  100px × 85px  (ratio 1.18:1)');
console.log('Tablet:  130px × 95px  (ratio 1.37:1)');
console.log('Desktop: 125px × 105px (ratio 1.19:1)');

console.log('\n💡 PROPUESTAS DE MEJORA:\n');

// Análisis de ratios
console.log('OPCIÓN 1: Aumentar ancho manteniendo altura');
console.log('  Mobile:  115px × 85px  (ratio 1.35:1) +15px ancho');
console.log('  Tablet:  145px × 95px  (ratio 1.53:1) +15px ancho');
console.log('  Desktop: 140px × 105px (ratio 1.33:1) +15px ancho');
console.log('  ✓ Más espacio horizontal para texto');
console.log('  ✓ Mejor ratio para lectura');
console.log('  ⚠ Menos tarjetas visibles por fila');

console.log('\nOPCIÓN 2: Aumentar ancho y reducir altura');
console.log('  Mobile:  120px × 80px  (ratio 1.50:1) +20px ancho, -5px alto');
console.log('  Tablet:  150px × 90px  (ratio 1.67:1) +20px ancho, -5px alto');
console.log('  Desktop: 145px × 100px (ratio 1.45:1) +20px ancho, -5px alto');
console.log('  ✓ Ratio más horizontal (mejor para texto)');
console.log('  ✓ Más compacto verticalmente');
console.log('  ⚠ Menos tarjetas visibles por fila');

console.log('\nOPCIÓN 3: Solo optimizar tipografía (sin cambiar dimensiones)');
console.log('  ✓ Reducir font-size del título');
console.log('  ✓ Ajustar line-height');
console.log('  ✓ Optimizar padding interno');
console.log('  ✓ Mantiene cantidad de tarjetas visibles');

console.log('\n🎯 RECOMENDACIÓN:\n');

if (longTitles > totalModules * 0.3) {
  console.log('⚠️  Más del 30% de títulos son largos.');
  console.log('📌 RECOMENDADO: OPCIÓN 2 (aumentar ancho, reducir altura)');
  console.log('   Mejor balance para textos largos sin sacrificar densidad vertical');
} else {
  console.log('✓ La mayoría de títulos son cortos/medianos.');
  console.log('📌 RECOMENDADO: OPCIÓN 3 (optimizar tipografía)');
  console.log('   Ajustar font-size y spacing es suficiente');
}

console.log('\n' + '='.repeat(60));
console.log('✅ Análisis completado\n');
