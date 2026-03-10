#!/usr/bin/env node

/**
 * Análisis profundo de altura de tarjetas de módulos
 * Identifica TODOS los problemas que causan altura excesiva
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssPath = path.join(__dirname, '../../src/styles/components/module-card.css');

console.log('🔍 ANÁLISIS PROFUNDO DE ALTURA DE TARJETAS\n');

const content = fs.readFileSync(cssPath, 'utf-8');
const lines = content.split('\n');

const problems = {
  heights: [],
  paddings: [],
  margins: [],
  gaps: [],
  minHeights: [],
  lineHeights: []
};

let currentSelector = '';
let inMediaQuery = '';
let lineNumber = 0;

lines.forEach((line, index) => {
  lineNumber = index + 1;
  const trimmed = line.trim();
  
  // Detectar media queries
  if (trimmed.startsWith('@media')) {
    inMediaQuery = trimmed.match(/@media[^{]+/)?.[0] || '';
  }
  
  // Detectar selectores
  if (trimmed.match(/^[.#\w-]+.*{/) && !trimmed.startsWith('@')) {
    currentSelector = trimmed.replace('{', '').trim();
  }
  
  // Detectar cierre de bloques
  if (trimmed === '}') {
    if (inMediaQuery && currentSelector) {
      currentSelector = '';
    } else if (inMediaQuery) {
      inMediaQuery = '';
    } else {
      currentSelector = '';
    }
  }
  
  // Buscar propiedades problemáticas
  if (trimmed.match(/^height:\s*\d+/)) {
    problems.heights.push({
      line: lineNumber,
      selector: currentSelector,
      media: inMediaQuery,
      value: trimmed
    });
  }
  
  if (trimmed.match(/^min-height:\s*\d+/)) {
    problems.minHeights.push({
      line: lineNumber,
      selector: currentSelector,
      media: inMediaQuery,
      value: trimmed
    });
  }
  
  if (trimmed.match(/^padding(-top|-bottom)?:\s*[^;]+;/)) {
    const value = trimmed.match(/:\s*([^;]+)/)?.[1];
    if (value && !value.includes('0')) {
      problems.paddings.push({
        line: lineNumber,
        selector: currentSelector,
        media: inMediaQuery,
        value: trimmed
      });
    }
  }
  
  if (trimmed.match(/^margin(-top|-bottom)?:\s*[^;]+;/)) {
    const value = trimmed.match(/:\s*([^;]+)/)?.[1];
    if (value && !value.includes('0') && value !== 'auto') {
      problems.margins.push({
        line: lineNumber,
        selector: currentSelector,
        media: inMediaQuery,
        value: trimmed
      });
    }
  }
  
  if (trimmed.match(/^gap:\s*[^;]+;/)) {
    const value = trimmed.match(/:\s*([^;]+)/)?.[1];
    if (value && !value.includes('0')) {
      problems.gaps.push({
        line: lineNumber,
        selector: currentSelector,
        media: inMediaQuery,
        value: trimmed
      });
    }
  }
  
  if (trimmed.match(/^line-height:\s*[^;]+;/)) {
    const value = trimmed.match(/:\s*([^;]+)/)?.[1];
    if (value && !value.includes('1;') && !value.includes('1 ')) {
      problems.lineHeights.push({
        line: lineNumber,
        selector: currentSelector,
        media: inMediaQuery,
        value: trimmed
      });
    }
  }
});

console.log('🔴 ALTURAS FIJAS (height):');
if (problems.heights.length === 0) {
  console.log('  ✅ Ninguna encontrada');
} else {
  problems.heights.forEach(p => {
    console.log(`  Línea ${p.line}: ${p.selector}`);
    if (p.media) console.log(`    ${p.media}`);
    console.log(`    ${p.value}`);
  });
}

console.log('\n🟠 MIN-HEIGHTS:');
if (problems.minHeights.length === 0) {
  console.log('  ✅ Ninguno encontrado');
} else {
  problems.minHeights.forEach(p => {
    console.log(`  Línea ${p.line}: ${p.selector}`);
    if (p.media) console.log(`    ${p.media}`);
    console.log(`    ${p.value}`);
  });
}

console.log('\n🟡 PADDINGS (no cero):');
if (problems.paddings.length === 0) {
  console.log('  ✅ Ninguno encontrado');
} else {
  problems.paddings.slice(0, 15).forEach(p => {
    console.log(`  Línea ${p.line}: ${p.selector}`);
    if (p.media) console.log(`    ${p.media}`);
    console.log(`    ${p.value}`);
  });
  if (problems.paddings.length > 15) {
    console.log(`  ... y ${problems.paddings.length - 15} más`);
  }
}

console.log('\n🟢 MARGINS (no cero):');
if (problems.margins.length === 0) {
  console.log('  ✅ Ninguno encontrado');
} else {
  problems.margins.forEach(p => {
    console.log(`  Línea ${p.line}: ${p.selector}`);
    if (p.media) console.log(`    ${p.media}`);
    console.log(`    ${p.value}`);
  });
}

console.log('\n🔵 GAPS (no cero):');
if (problems.gaps.length === 0) {
  console.log('  ✅ Ninguno encontrado');
} else {
  problems.gaps.forEach(p => {
    console.log(`  Línea ${p.line}: ${p.selector}`);
    if (p.media) console.log(`    ${p.media}`);
    console.log(`    ${p.value}`);
  });
}

console.log('\n🟣 LINE-HEIGHTS (> 1):');
if (problems.lineHeights.length === 0) {
  console.log('  ✅ Todos son 1');
} else {
  problems.lineHeights.forEach(p => {
    console.log(`  Línea ${p.line}: ${p.selector}`);
    if (p.media) console.log(`    ${p.media}`);
    console.log(`    ${p.value}`);
  });
}

console.log('\n\n═'.repeat(60));
console.log('📊 RESUMEN DE PROBLEMAS');
console.log('═'.repeat(60));
console.log(`Heights fijos: ${problems.heights.length}`);
console.log(`Min-heights: ${problems.minHeights.length}`);
console.log(`Paddings no-cero: ${problems.paddings.length}`);
console.log(`Margins no-cero: ${problems.margins.length}`);
console.log(`Gaps no-cero: ${problems.gaps.length}`);
console.log(`Line-heights > 1: ${problems.lineHeights.length}`);

const totalProblems = 
  problems.heights.length +
  problems.minHeights.length +
  problems.paddings.length +
  problems.margins.length +
  problems.gaps.length +
  problems.lineHeights.length;

console.log(`\n⚠️  TOTAL PROBLEMAS: ${totalProblems}`);

console.log('\n💡 ACCIONES RECOMENDADAS:');
console.log('1. Eliminar TODOS los paddings verticales innecesarios');
console.log('2. Eliminar TODOS los margins entre elementos');
console.log('3. Eliminar TODOS los gaps');
console.log('4. Cambiar TODOS los line-height a 1');
console.log('5. Reducir min-heights al mínimo absoluto');
console.log('6. Verificar que no haya height: 100% causando expansión');
