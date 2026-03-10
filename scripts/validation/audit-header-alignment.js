#!/usr/bin/env node

/**
 * Header Alignment Audit Script
 * Detecta problemas de alineación y CSS heredados en header.css
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HEADER_CSS = path.join(__dirname, '../../src/styles/components/header.css');

console.log('🔍 HEADER ALIGNMENT AUDIT\n');

const content = fs.readFileSync(HEADER_CSS, 'utf-8');
const lines = content.split('\n');

const issues = [];

// 1. Detectar múltiples definiciones del mismo selector
const selectorCount = {};
const selectorLines = {};

lines.forEach((line, idx) => {
  const match = line.match(/^\.header-redesigned[^\s{]*\s*{/);
  if (match) {
    const selector = match[0].replace(/\s*{$/, '').trim();
    selectorCount[selector] = (selectorCount[selector] || 0) + 1;
    if (!selectorLines[selector]) selectorLines[selector] = [];
    selectorLines[selector].push(idx + 1);
  }
});

console.log('📊 PASO 1: Selectores duplicados\n');
let duplicates = 0;
Object.entries(selectorCount).forEach(([selector, count]) => {
  if (count > 1) {
    duplicates++;
    console.log(`❌ ${selector}`);
    console.log(`   Aparece ${count} veces en líneas: ${selectorLines[selector].join(', ')}`);
  }
});
if (duplicates === 0) console.log('✅ No hay selectores duplicados');
console.log('');

// 2. Detectar propiedades de alineación conflictivas
console.log('📊 PASO 2: Propiedades de alineación conflictivas\n');

const alignmentProps = [
  'display',
  'align-items',
  'justify-content',
  'grid-template-columns',
  'flex-direction',
  'gap'
];

const blockRegex = /\.header-redesigned[^\{]*\{[^\}]*\}/gs;
const blocks = content.match(blockRegex) || [];

let alignmentIssues = 0;
blocks.forEach(block => {
  const selector = block.match(/^[^{]+/)[0].trim();
  const props = {};
  
  alignmentProps.forEach(prop => {
    const regex = new RegExp(`${prop}\\s*:\\s*([^;]+);`, 'g');
    const matches = [...block.matchAll(regex)];
    if (matches.length > 1) {
      alignmentIssues++;
      console.log(`❌ ${selector}`);
      console.log(`   Propiedad "${prop}" definida ${matches.length} veces:`);
      matches.forEach(m => console.log(`     - ${m[1].trim()}`));
    }
  });
});

if (alignmentIssues === 0) console.log('✅ No hay propiedades de alineación duplicadas');
console.log('');

// 3. Detectar media queries con reglas idénticas a base
console.log('📊 PASO 3: Media queries con reglas heredadas\n');

const mediaQueryRegex = /@media[^{]+\{[^}]*\.header-redesigned[^}]*\}/gs;
const mediaQueries = content.match(mediaQueryRegex) || [];

let inheritedRules = 0;
mediaQueries.forEach(mq => {
  const mqSelector = mq.match(/\.header-redesigned[^\{]*/)?.[0]?.trim();
  if (!mqSelector) return;
  
  // Buscar selector base
  const baseRegex = new RegExp(`^${mqSelector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{[^}]*\\}`, 'm');
  const baseBlock = content.match(baseRegex)?.[0];
  
  if (baseBlock) {
    const baseProps = [...baseBlock.matchAll(/([a-z-]+)\s*:\s*([^;]+);/g)];
    const mqProps = [...mq.matchAll(/([a-z-]+)\s*:\s*([^;]+);/g)];
    
    const inherited = mqProps.filter(mqProp => {
      return baseProps.some(baseProp => 
        baseProp[1] === mqProp[1] && baseProp[2].trim() === mqProp[2].trim()
      );
    });
    
    if (inherited.length > 0) {
      inheritedRules++;
      console.log(`❌ ${mqSelector} en media query`);
      console.log(`   ${inherited.length} propiedades idénticas a base:`);
      inherited.forEach(prop => console.log(`     - ${prop[1]}: ${prop[2].trim()}`));
    }
  }
});

if (inheritedRules === 0) console.log('✅ No hay reglas heredadas en media queries');
console.log('');

// 4. Detectar !important innecesarios
console.log('📊 PASO 4: !important innecesarios\n');

const importantRegex = /([a-z-]+)\s*:\s*([^;]+!important[^;]*);/g;
const importants = [...content.matchAll(importantRegex)];

if (importants.length > 0) {
  console.log(`⚠️  Encontrados ${importants.length} usos de !important:`);
  importants.forEach(match => {
    const lineNum = content.substring(0, match.index).split('\n').length;
    console.log(`   Línea ${lineNum}: ${match[1]}: ${match[2].trim()}`);
  });
} else {
  console.log('✅ No hay !important en header.css');
}
console.log('');

// 5. Detectar grid-template-columns inconsistentes
console.log('📊 PASO 5: Grid template columns inconsistentes\n');

const gridTemplates = [...content.matchAll(/grid-template-columns\s*:\s*([^;]+);/g)];
const uniqueTemplates = new Set(gridTemplates.map(m => m[1].trim()));

console.log(`📋 Encontrados ${gridTemplates.length} definiciones de grid-template-columns`);
console.log(`📋 ${uniqueTemplates.size} valores únicos:\n`);

uniqueTemplates.forEach(template => {
  const count = gridTemplates.filter(m => m[1].trim() === template).length;
  console.log(`   ${count}x: ${template}`);
});
console.log('');

// RESUMEN
console.log('═══════════════════════════════════════════════════════');
console.log('📊 RESUMEN');
console.log('═══════════════════════════════════════════════════════');
console.log(`Selectores duplicados: ${duplicates}`);
console.log(`Propiedades de alineación duplicadas: ${alignmentIssues}`);
console.log(`Media queries con reglas heredadas: ${inheritedRules}`);
console.log(`Usos de !important: ${importants.length}`);
console.log(`Grid templates únicos: ${uniqueTemplates.size} de ${gridTemplates.length}`);
console.log('═══════════════════════════════════════════════════════\n');

const totalIssues = duplicates + alignmentIssues + inheritedRules + importants.length;

if (totalIssues > 0) {
  console.log(`⚠️  Total de problemas encontrados: ${totalIssues}`);
  process.exit(1);
} else {
  console.log('✅ Header CSS está limpio y bien estructurado');
  process.exit(0);
}
