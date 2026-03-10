#!/usr/bin/env node

/**
 * Header Vertical Alignment Analysis
 * Analiza problemas de alineación vertical en header y score-display
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HEADER_CSS = path.join(__dirname, '../../src/styles/components/header.css');
const SCORE_CSS = path.join(__dirname, '../../src/styles/components/score-display.css');

console.log('🔍 ANÁLISIS DE ALINEACIÓN VERTICAL DEL HEADER\n');

const issues = [];

// Leer archivos
const headerContent = fs.readFileSync(HEADER_CSS, 'utf-8');
const scoreContent = fs.readFileSync(SCORE_CSS, 'utf-8');

// 1. Analizar alturas inconsistentes
console.log('📊 PASO 1: Alturas inconsistentes\n');

const heightRegex = /(min-)?height:\s*(\d+)px/g;
const headerHeights = {};
const scoreHeights = {};

let match;
while ((match = heightRegex.exec(headerContent)) !== null) {
  const height = match[2];
  headerHeights[height] = (headerHeights[height] || 0) + 1;
}

while ((match = heightRegex.exec(scoreContent)) !== null) {
  const height = match[2];
  scoreHeights[height] = (scoreHeights[height] || 0) + 1;
}

console.log('Alturas en header.css:');
Object.entries(headerHeights).sort((a, b) => b[1] - a[1]).forEach(([h, count]) => {
  console.log(`  ${h}px: ${count} veces`);
});

console.log('\nAlturas en score-display.css:');
Object.entries(scoreHeights).sort((a, b) => b[1] - a[1]).forEach(([h, count]) => {
  console.log(`  ${h}px: ${count} veces`);
});

// Detectar inconsistencias
const allHeights = new Set([...Object.keys(headerHeights), ...Object.keys(scoreHeights)]);
if (allHeights.size > 3) {
  issues.push(`⚠️  Demasiadas alturas diferentes: ${allHeights.size} valores únicos`);
  console.log(`\n⚠️  PROBLEMA: ${allHeights.size} alturas diferentes detectadas`);
}

console.log('\n');

// 2. Analizar line-height inconsistentes
console.log('📊 PASO 2: Line-height inconsistentes\n');

const lineHeightRegex = /line-height:\s*([^;]+);/g;
const headerLineHeights = new Set();
const scoreLineHeights = new Set();

while ((match = lineHeightRegex.exec(headerContent)) !== null) {
  headerLineHeights.add(match[1].trim());
}

while ((match = lineHeightRegex.exec(scoreContent)) !== null) {
  scoreLineHeights.add(match[1].trim());
}

console.log('Line-heights en header.css:');
headerLineHeights.forEach(lh => console.log(`  ${lh}`));

console.log('\nLine-heights en score-display.css:');
scoreLineHeights.forEach(lh => console.log(`  ${lh}`));

// Detectar line-heights problemáticos
const problematicLineHeights = [...headerLineHeights, ...scoreLineHeights].filter(lh => 
  lh !== '1' && lh !== '1.0' && !lh.includes('var(')
);

if (problematicLineHeights.length > 0) {
  issues.push(`⚠️  Line-heights problemáticos: ${problematicLineHeights.join(', ')}`);
  console.log(`\n⚠️  PROBLEMA: Line-heights diferentes de 1 detectados`);
}

console.log('\n');

// 3. Analizar padding vertical inconsistente
console.log('📊 PASO 3: Padding vertical inconsistente\n');

const paddingRegex = /padding:\s*([^;]+);/g;
const headerPaddings = [];
const scorePaddings = [];

while ((match = paddingRegex.exec(headerContent)) !== null) {
  headerPaddings.push(match[1].trim());
}

while ((match = paddingRegex.exec(scoreContent)) !== null) {
  scorePaddings.push(match[1].trim());
}

console.log('Paddings en header.css (primeros 10):');
headerPaddings.slice(0, 10).forEach(p => console.log(`  ${p}`));

console.log('\nPaddings en score-display.css (primeros 10):');
scorePaddings.slice(0, 10).forEach(p => console.log(`  ${p}`));

console.log('\n');

// 4. Buscar align-items que no sean center
console.log('📊 PASO 4: Align-items problemáticos\n');

const alignRegex = /align-items:\s*([^;]+);/g;
const nonCenterAligns = [];

while ((match = alignRegex.exec(headerContent)) !== null) {
  if (match[1].trim() !== 'center') {
    const lineNum = headerContent.substring(0, match.index).split('\n').length;
    nonCenterAligns.push(`header.css:${lineNum} - ${match[1].trim()}`);
  }
}

while ((match = alignRegex.exec(scoreContent)) !== null) {
  if (match[1].trim() !== 'center') {
    const lineNum = scoreContent.substring(0, match.index).split('\n').length;
    nonCenterAligns.push(`score-display.css:${lineNum} - ${match[1].trim()}`);
  }
}

if (nonCenterAligns.length > 0) {
  console.log('⚠️  Align-items que NO son center:');
  nonCenterAligns.forEach(a => console.log(`  ${a}`));
  issues.push(`⚠️  ${nonCenterAligns.length} align-items no centrados`);
} else {
  console.log('✅ Todos los align-items son center');
}

console.log('\n');

// 5. Buscar display: flex sin align-items
console.log('📊 PASO 5: Display flex sin align-items\n');

const flexWithoutAlign = [];
const flexRegex = /\.[\w-]+\s*\{[^}]*display:\s*flex[^}]*\}/g;

while ((match = flexRegex.exec(headerContent)) !== null) {
  if (!match[0].includes('align-items')) {
    const selector = match[0].match(/\.([\w-]+)/)?.[1];
    const lineNum = headerContent.substring(0, match.index).split('\n').length;
    flexWithoutAlign.push(`header.css:${lineNum} - .${selector}`);
  }
}

while ((match = flexRegex.exec(scoreContent)) !== null) {
  if (!match[0].includes('align-items')) {
    const selector = match[0].match(/\.([\w-]+)/)?.[1];
    const lineNum = scoreContent.substring(0, match.index).split('\n').length;
    flexWithoutAlign.push(`score-display.css:${lineNum} - .${selector}`);
  }
}

if (flexWithoutAlign.length > 0) {
  console.log('⚠️  Display flex sin align-items:');
  flexWithoutAlign.forEach(f => console.log(`  ${f}`));
  issues.push(`⚠️  ${flexWithoutAlign.length} flex containers sin align-items`);
} else {
  console.log('✅ Todos los flex tienen align-items');
}

console.log('\n');

// 6. Buscar font-size inconsistentes en elementos principales
console.log('📊 PASO 6: Font-size en elementos principales\n');

const mainElements = [
  'header-redesigned__title',
  'header-redesigned__username',
  'score-display-compact__correct',
  'score-display-compact__incorrect',
  'score-display-compact__points'
];

mainElements.forEach(elem => {
  const regex = new RegExp(`\\.${elem}[^{]*\\{[^}]*font-size:\\s*([^;]+);`, 'g');
  const headerMatch = regex.exec(headerContent);
  const scoreMatch = regex.exec(scoreContent);
  
  if (headerMatch) {
    console.log(`  .${elem}: ${headerMatch[1].trim()}`);
  }
  if (scoreMatch) {
    console.log(`  .${elem}: ${scoreMatch[1].trim()}`);
  }
});

console.log('\n');

// RESUMEN
console.log('═══════════════════════════════════════════════════════');
console.log('📊 RESUMEN DE PROBLEMAS');
console.log('═══════════════════════════════════════════════════════');

if (issues.length > 0) {
  issues.forEach(issue => console.log(issue));
  console.log(`\n⚠️  Total: ${issues.length} problemas detectados`);
  
  console.log('\n💡 RECOMENDACIONES:');
  console.log('1. Unificar todas las alturas a 36px');
  console.log('2. Usar line-height: 1 en todos los textos');
  console.log('3. Asegurar align-items: center en todos los flex');
  console.log('4. Eliminar padding vertical innecesario');
  console.log('5. Usar font-size consistente (0.875rem para texto normal)');
  
  process.exit(1);
} else {
  console.log('✅ No se detectaron problemas de alineación');
  process.exit(0);
}
