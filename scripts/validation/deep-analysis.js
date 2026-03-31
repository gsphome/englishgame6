#!/usr/bin/env node
/**
 * Deep analysis consolidado — 30 pasadas en 3 grupos.
 *
 * Uso:
 *   node scripts/validation/deep-analysis.js           # Ejecuta los 3 grupos
 *   node scripts/validation/deep-analysis.js --da      # Solo DA-1..DA-10
 *   node scripts/validation/deep-analysis.js --db      # Solo DB-1..DB-10
 *   node scripts/validation/deep-analysis.js --dc      # Solo DC-1..DC-10
 *
 * Grupo DA (CSS/TSX quality):
 *   DA-1:  CSS properties overridden in same rule (excludes fallback patterns)
 *   DA-2:  Hardcoded colors outside design tokens (informational)
 *   DA-3:  z-index sprawl (informational)
 *   DA-4:  CSS rules with too many properties (informational)
 *   DA-5:  Inline styles in TSX (informational)
 *   DA-6:  Unused @keyframes animations
 *   DA-7:  Duplicate CSS custom properties in top-level :root
 *   DA-8:  TypeScript any/as any usage (informational)
 *   DA-9:  TODO/FIXME/HACK comments
 *   DA-10: Empty CSS rules
 *
 * Grupo DB (cross-file & runtime):
 *   DB-1:  CSS var() references to undefined custom properties
 *   DB-2:  Orphan CSS files not @imported anywhere
 *   DB-3:  addEventListener without cleanup in useEffect
 *   DB-4:  Timers without cleanup in useEffect
 *   DB-5:  Hardcoded strings in TSX (i18n candidates)
 *   DB-6:  CSS selector specificity conflicts (cross-file)
 *   DB-7:  Contradictory @media queries
 *   DB-8:  localStorage/sessionStorage without try-catch
 *   DB-9:  var() fallback coverage (informational)
 *   DB-10: Bundle size hotspots (informational)
 *
 * Grupo DC (JSON data integrity):
 *   DC-1:  JSON dataPath integrity
 *   DC-2:  Prerequisite chain integrity + circular deps
 *   DC-3:  Orphan JSON data files
 *   DC-4:  learningMode vs dataPath naming consistency
 *   DC-5:  Large component files >300 lines (informational)
 *   DC-6:  CSS files without matching component
 *   DC-7:  Duplicate module IDs
 *   DC-8:  JSON data file schema validation
 *   DC-9:  app-config.json consistency with learningModules.json
 *   DC-10: Module progression completeness
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, basename } from 'path';

// ── CLI args ──
const args = process.argv.slice(2);
const runDA = args.length === 0 || args.includes('--da');
const runDB = args.length === 0 || args.includes('--db');
const runDC = args.length === 0 || args.includes('--dc');

// ── Shared utilities ──
const SRC = 'src';
const STYLES = 'src/styles';
const PUBLIC_DATA = 'public/data';

function walk(dir, exts) {
  const r = [];
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (e === 'node_modules' || e === '.git' || e === 'dist') continue;
    if (statSync(f).isDirectory()) r.push(...walk(f, exts));
    else if (exts.some(ext => f.endsWith(ext))) r.push(f);
  }
  return r;
}

let totalIssues = 0;
function passOk(id, label, detail) {
  console.log(`   ✅ ${id}: ${label}${detail ? ` — ${detail}` : ''}`);
}
function passIssue(id, label, count) {
  console.log(`   ❌ ${id}: ${label} (${count})`);
  totalIssues += count;
}

// Lazy-loaded file lists
let _cssFiles, _tsxFiles;
function getCssFiles() { return _cssFiles || (_cssFiles = walk(STYLES, ['.css'])); }
function getTsxFiles() { return _tsxFiles || (_tsxFiles = walk(SRC, ['.tsx', '.ts'])); }

// ╔═══════════════════════════════════════════════════════╗
// ║  GRUPO DA: CSS/TSX Quality (DA-1 .. DA-10)           ║
// ╚═══════════════════════════════════════════════════════╝

function runGroupDA() {
  console.log('\n══ DA: CSS/TSX Quality ══\n');
  const cssFiles = getCssFiles();
  const tsxFiles = getTsxFiles();

  // DA-1: CSS properties overridden in same rule block
  const FALLBACK_PATTERNS = {
    'min-height': [/100vh/, /100dvh/],
    'height': [/100vh/, /100dvh/],
    'display': [/-webkit-flex/, /\bflex\b/],
  };
  function isFallbackPair(prop, values) {
    const patterns = FALLBACK_PATTERNS[prop];
    if (!patterns || values.length !== 2) return false;
    return patterns[0].test(values[0]) && patterns[1].test(values[1]);
  }

  const duplicateProps = [];
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf-8');
    let inComment = false, braceDepth = 0;
    const propsInBlock = new Map();
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      let effective = '';
      let j = 0;
      while (j < lines[i].length) {
        if (inComment) {
          if (lines[i][j] === '*' && lines[i][j + 1] === '/') { inComment = false; j += 2; continue; }
          j++;
        } else {
          if (lines[i][j] === '/' && lines[i][j + 1] === '*') { inComment = true; j += 2; continue; }
          if (lines[i][j] === '/' && lines[i][j + 1] === '/') break;
          effective += lines[i][j]; j++;
        }
      }
      const trimmed = effective.trim();
      if (!trimmed) continue;
      for (const ch of effective) {
        if (ch === '{') { braceDepth++; propsInBlock.clear(); }
        else if (ch === '}') {
          for (const [prop, entries] of propsInBlock) {
            if (entries.length > 1) {
              const values = entries.map(e => e.value);
              if (!isFallbackPair(prop, values)) {
                duplicateProps.push({ file: relative('.', file), prop, lines: entries.map(e => e.line), count: entries.length });
              }
            }
          }
          propsInBlock.clear(); braceDepth--;
        }
      }
      if (braceDepth > 0 && trimmed.includes(':') && !trimmed.startsWith('@') && !trimmed.includes('{')) {
        const colonIdx = trimmed.indexOf(':');
        const prop = trimmed.substring(0, colonIdx).trim();
        const value = trimmed.substring(colonIdx + 1).replace(/;$/, '').trim();
        if (prop && !prop.startsWith('/*') && !prop.startsWith('//') && /^[a-z-]+$/.test(prop)) {
          if (!propsInBlock.has(prop)) propsInBlock.set(prop, []);
          propsInBlock.get(prop).push({ line: i + 1, value });
        }
      }
    }
  }
  if (duplicateProps.length === 0) passOk('DA-1', 'Propiedades CSS duplicadas en mismo bloque');
  else {
    passIssue('DA-1', 'Propiedades CSS duplicadas en mismo bloque', duplicateProps.length);
    for (const { file, prop, lines } of duplicateProps.slice(0, 15)) console.log(`      ${prop} (×${lines.length}) L${lines.join(',')}  ← ${file}`);
    if (duplicateProps.length > 15) console.log(`      ... +${duplicateProps.length - 15} más`);
  }

  // DA-2: Hardcoded hex colors
  const hardcodedColors = new Map();
  const HEX_RE = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/g;
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let inRoot = false, inComment = false, count = 0;
    for (const line of lines) {
      if (line.includes('/*')) inComment = true;
      if (line.includes('*/')) { inComment = false; continue; }
      if (inComment) continue;
      if (/:root\s*\{/.test(line)) inRoot = true;
      if (inRoot && line.includes('}')) { inRoot = false; continue; }
      if (inRoot || line.trim().startsWith('--')) continue;
      const matches = line.match(HEX_RE);
      if (matches) count += matches.length;
    }
    if (count > 0) hardcodedColors.set(relative('.', file), count);
  }
  const totalHC = [...hardcodedColors.values()].reduce((a, b) => a + b, 0);
  const topHC = [...hardcodedColors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  console.log(`   ℹ️  DA-2: Colores hex hardcodeados — ${totalHC} total en ${hardcodedColors.size} archivos`);
  for (const [file, count] of topHC) console.log(`      ${file}: ${count}`);

  // DA-3: z-index sprawl
  const zIndexValues = [];
  const ZINDEX_RE = /z-index:\s*(-?\d+)/g;
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf-8');
    let m;
    while ((m = ZINDEX_RE.exec(content)) !== null) zIndexValues.push({ file: relative('.', file), value: parseInt(m[1]) });
  }
  const uniqueZ = [...new Set(zIndexValues.map(z => z.value))].sort((a, b) => a - b);
  if (uniqueZ.length <= 5) passOk('DA-3', `z-index sprawl — ${uniqueZ.length} valores únicos [${uniqueZ.join(', ')}]`);
  else {
    console.log(`   ⚠️  DA-3: z-index sprawl — ${uniqueZ.length} valores únicos [${uniqueZ.join(', ')}]`);
    const byFile = {};
    for (const { file, value } of zIndexValues) { if (!byFile[file]) byFile[file] = []; byFile[file].push(value); }
    for (const [file, values] of Object.entries(byFile).sort((a, b) => b[1].length - a[1].length).slice(0, 5))
      console.log(`      ${file}: [${[...new Set(values)].sort((a,b) => a-b).join(', ')}]`);
  }

  // DA-4: CSS rules with too many properties (>15)
  const complexRules = [];
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let inComment = false, braceDepth = 0, propCount = 0, ruleSelector = '', ruleLine = 0;
    for (let i = 0; i < lines.length; i++) {
      let effective = '';
      let j = 0;
      while (j < lines[i].length) {
        if (inComment) { if (lines[i][j] === '*' && lines[i][j + 1] === '/') { inComment = false; j += 2; continue; } j++; }
        else { if (lines[i][j] === '/' && lines[i][j + 1] === '*') { inComment = true; j += 2; continue; } if (lines[i][j] === '/' && lines[i][j + 1] === '/') break; effective += lines[i][j]; j++; }
      }
      const trimmed = effective.trim();
      if (!trimmed) continue;
      for (const ch of effective) {
        if (ch === '{') { braceDepth++; if (braceDepth === 2 || (braceDepth === 1 && !trimmed.startsWith('@'))) { ruleSelector = trimmed.split('{')[0].trim(); ruleLine = i + 1; propCount = 0; } }
        else if (ch === '}') { if ((braceDepth === 2 || (braceDepth === 1 && !ruleSelector.startsWith('@'))) && propCount > 15) complexRules.push({ file: relative('.', file), selector: ruleSelector.substring(0, 60), line: ruleLine, props: propCount }); braceDepth--; }
      }
      if (trimmed.includes(':') && !trimmed.startsWith('@') && !trimmed.includes('{') && braceDepth > 0) { const prop = trimmed.split(':')[0].trim(); if (/^[a-z-]+$/.test(prop)) propCount++; }
    }
  }
  if (complexRules.length === 0) passOk('DA-4', 'Reglas CSS complejas (>15 props)');
  else {
    console.log(`   ⚠️  DA-4: Reglas CSS complejas >15 props (${complexRules.length})`);
    for (const { file, selector, line, props } of complexRules.sort((a, b) => b.props - a.props).slice(0, 10))
      console.log(`      ${selector} (${props} props) L${line}  ← ${file}`);
  }

  // DA-5: Inline styles in TSX
  const inlineStyles = [];
  for (const file of tsxFiles) {
    if (!file.endsWith('.tsx')) continue;
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let count = 0; const sampleLines = [];
    for (let i = 0; i < lines.length; i++) { if (/\bstyle\s*=\s*\{/.test(lines[i])) { count++; if (sampleLines.length < 3) sampleLines.push(i + 1); } }
    if (count > 0) inlineStyles.push({ file: relative('.', file), count, lines: sampleLines });
  }
  const totalInline = inlineStyles.reduce((a, b) => a + b.count, 0);
  if (totalInline === 0) passOk('DA-5', 'Inline styles en TSX');
  else {
    console.log(`   ⚠️  DA-5: Inline styles en TSX — ${totalInline} en ${inlineStyles.length} archivos`);
    for (const { file, count, lines } of inlineStyles.sort((a, b) => b.count - a.count).slice(0, 8))
      console.log(`      ${file}: ${count} (L${lines.join(',')}...)`);
  }

  // DA-6: Unused @keyframes
  const definedKF = new Map(), usedAnims = new Set();
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf-8');
    let m;
    const kfRe = /@keyframes\s+([a-zA-Z0-9_-]+)/g;
    while ((m = kfRe.exec(content)) !== null) definedKF.set(m[1], relative('.', file));
    const animRe = /animation(?:-name)?:\s*([^;{}\n]+)/g;
    while ((m = animRe.exec(content)) !== null) {
      for (const part of m[1].trim().split(/[\s,]+/)) {
        if (/^[a-zA-Z]/.test(part) && !['ease','linear','ease-in','ease-out','ease-in-out','infinite','alternate','forwards','backwards','both','none','normal','reverse','paused','running','inherit','initial','unset'].includes(part))
          usedAnims.add(part);
      }
    }
  }
  const unusedKF = [...definedKF.entries()].filter(([name]) => !usedAnims.has(name));
  if (unusedKF.length === 0) passOk('DA-6', `@keyframes sin uso — ${definedKF.size} definidas, todas usadas`);
  else { passIssue('DA-6', '@keyframes sin uso', unusedKF.length); for (const [name, file] of unusedKF) console.log(`      ${name}  ← ${file}`); }

  // DA-7: Duplicate CSS custom properties in :root (top-level only)
  const rootVars = new Map();
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let inRoot = false, atRuleDepth = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^@(media|supports)\b/.test(line) && line.includes('{')) atRuleDepth++;
      if (atRuleDepth > 0 && line.includes('}') && !line.includes('{') && !inRoot) atRuleDepth = Math.max(0, atRuleDepth - 1);
      if (/:root\s*\{/.test(line)) inRoot = true;
      if (inRoot && line.includes('}') && !line.includes('{')) { inRoot = false; if (atRuleDepth > 0) atRuleDepth = Math.max(0, atRuleDepth - 1); continue; }
      if (!inRoot || atRuleDepth > 0) continue;
      const m = line.match(/^(--[a-zA-Z0-9_-]+)\s*:/);
      if (m) { if (!rootVars.has(m[1])) rootVars.set(m[1], []); rootVars.get(m[1]).push({ file: relative('.', file), line: i + 1 }); }
    }
  }
  const dupeVars = [...rootVars.entries()].filter(([, locs]) => locs.length > 1);
  if (dupeVars.length === 0) passOk('DA-7', `Custom properties duplicadas en :root — ${rootVars.size} únicas`);
  else { passIssue('DA-7', 'Custom properties duplicadas en :root', dupeVars.length); for (const [v, locs] of dupeVars.slice(0, 10)) console.log(`      ${v} (×${locs.length}): ${locs.map(l => `${l.file}:${l.line}`).join(', ')}`); }

  // DA-8: TypeScript any/as any
  const anyUsage = [];
  for (const file of tsxFiles) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let count = 0; const sampleLines = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;
      if (/\b(:\s*any\b|as\s+any\b|<any>)/.test(line)) { count++; if (sampleLines.length < 3) sampleLines.push(i + 1); }
    }
    if (count > 0) anyUsage.push({ file: relative('.', file), count, lines: sampleLines });
  }
  const totalAny = anyUsage.reduce((a, b) => a + b.count, 0);
  if (totalAny === 0) passOk('DA-8', 'TypeScript any/as any');
  else {
    console.log(`   ⚠️  DA-8: TypeScript any/as any — ${totalAny} en ${anyUsage.length} archivos`);
    for (const { file, count, lines } of anyUsage.sort((a, b) => b.count - a.count).slice(0, 10)) console.log(`      ${file}: ${count} (L${lines.join(',')}...)`);
  }

  // DA-9: TODO/FIXME/HACK comments
  const todoComments = [];
  for (const file of [...tsxFiles, ...cssFiles]) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/\b(TODO|FIXME|HACK|XXX|TEMP)\b/i);
      if (m) todoComments.push({ file: relative('.', file), line: i + 1, type: m[1].toUpperCase(), text: lines[i].trim().substring(0, 80) });
    }
  }
  if (todoComments.length === 0) passOk('DA-9', 'TODO/FIXME/HACK en código');
  else {
    console.log(`   ⚠️  DA-9: TODO/FIXME/HACK — ${todoComments.length} comentarios`);
    const byType = {};
    for (const t of todoComments) byType[t.type] = (byType[t.type] || 0) + 1;
    console.log(`      ${Object.entries(byType).map(([k, v]) => `${k}:${v}`).join(' ')}`);
    for (const t of todoComments.slice(0, 8)) console.log(`      ${t.file}:${t.line} ${t.text}`);
    if (todoComments.length > 8) console.log(`      ... +${todoComments.length - 8} más`);
  }

  // DA-10: Empty CSS rules
  const emptyRules = [];
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf-8');
    const re = /([^{}]+)\{\s*(\/\*[^*]*\*\/\s*)?\}/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      const sel = m[1].trim();
      if (sel && !sel.startsWith('@') && sel.length < 80) {
        const lineNum = content.substring(0, m.index).split('\n').length;
        emptyRules.push({ file: relative('.', file), selector: sel, line: lineNum });
      }
    }
  }
  if (emptyRules.length === 0) passOk('DA-10', 'Reglas CSS vacías');
  else { passIssue('DA-10', 'Reglas CSS vacías', emptyRules.length); for (const { file, selector, line } of emptyRules.slice(0, 10)) console.log(`      ${selector} L${line}  ← ${file}`); }
}

// ╔═══════════════════════════════════════════════════════╗
// ║  GRUPO DB: Cross-file & Runtime (DB-1 .. DB-10)      ║
// ╚═══════════════════════════════════════════════════════╝

function runGroupDB() {
  console.log('\n══ DB: Cross-file & Runtime ══\n');
  const cssFiles = getCssFiles();
  const tsxFiles = getTsxFiles();

  // DB-1: CSS var() references to undefined custom properties
  const definedVars = new Set();
  const usedVars = new Map();
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('/*') || line.trim().startsWith('*')) continue;
      let m;
      const defRe = /(--[a-zA-Z0-9_-]+)\s*:/g;
      while ((m = defRe.exec(line)) !== null) definedVars.add(m[1]);
      const useRe = /var\(\s*(--[a-zA-Z0-9_-]+)/g;
      while ((m = useRe.exec(line)) !== null) {
        if (!usedVars.has(m[1])) usedVars.set(m[1], []);
        usedVars.get(m[1]).push({ file: relative('.', file), line: i + 1 });
      }
    }
  }
  const undefinedVars = [];
  const undefinedNoFallback = [];
  for (const [varName, locs] of usedVars) {
    if (!definedVars.has(varName)) {
      let allHaveFallback = true;
      const noFbLocs = [];
      for (const loc of locs) {
        const fileContent = readFileSync(join('.', loc.file), 'utf-8');
        const line = fileContent.split('\n')[loc.line - 1] || '';
        const varPattern = new RegExp(`var\\(\\s*${varName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*,`);
        if (!varPattern.test(line)) { allHaveFallback = false; noFbLocs.push(loc); }
      }
      undefinedVars.push({ varName, locs, allHaveFallback });
      if (!allHaveFallback) undefinedNoFallback.push({ varName, locs: noFbLocs });
    }
  }
  if (undefinedVars.length === 0) passOk('DB-1', `var() sin definición — ${usedVars.size} refs, todas definidas`);
  else {
    const withFb = undefinedVars.filter(v => v.allHaveFallback).length;
    const noFb = undefinedNoFallback.length;
    if (noFb > 0) {
      passIssue('DB-1', `var() sin definición CSS — ${noFb} sin fallback, ${withFb} con fallback`, undefinedVars.length);
      console.log(`      ⚠️  Sin fallback:`);
      for (const { varName, locs } of undefinedNoFallback.slice(0, 12)) console.log(`         ${varName} (×${locs.length}): ${locs.slice(0, 3).map(l => `${l.file}:${l.line}`).join(', ')}`);
      if (undefinedNoFallback.length > 12) console.log(`         ... +${undefinedNoFallback.length - 12} más`);
      if (withFb > 0) console.log(`      ℹ️  Con fallback (funcional): ${withFb} vars`);
    } else {
      console.log(`   ⚠️  DB-1: var() sin definición CSS — ${undefinedVars.length} vars (todas con fallback, funcional)`);
    }
  }

  // DB-2: Orphan CSS files not @imported anywhere
  const allImports = new Set();
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf-8');
    const importRe = /@import\s+['"]([^'"]+)['"]/g;
    let m;
    while ((m = importRe.exec(content)) !== null) { allImports.add(m[1].replace(/^\.\//, '')); allImports.add(basename(m[1])); }
  }
  for (const file of tsxFiles) {
    const content = readFileSync(file, 'utf-8');
    const importRe = /import\s+['"]([^'"]*\.css)['"]/g;
    let m;
    while ((m = importRe.exec(content)) !== null) allImports.add(basename(m[1]));
  }
  for (const rootFile of ['src/index.css', 'src/styles/index.css', 'src/styles/components.css', 'src/styles/themes.css']) {
    if (existsSync(rootFile)) {
      const content = readFileSync(rootFile, 'utf-8');
      const importRe = /@import\s+['"]([^'"]+)['"]/g;
      let m;
      while ((m = importRe.exec(content)) !== null) allImports.add(basename(m[1]));
    }
  }
  const orphanCss = cssFiles.filter(f => {
    const name = basename(f);
    if (['index.css', 'components.css', 'themes.css'].includes(name)) return false;
    return !allImports.has(name);
  }).map(f => relative('.', f));
  if (orphanCss.length === 0) passOk('DB-2', `CSS huérfanos — ${cssFiles.length} archivos, todos importados`);
  else { passIssue('DB-2', 'Archivos CSS no importados', orphanCss.length); for (const f of orphanCss.slice(0, 10)) console.log(`      ${f}`); }

  // DB-3: addEventListener without cleanup in useEffect
  const listenerIssues = [];
  for (const file of tsxFiles) {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue;
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let inUseEffect = false, effectStartLine = 0, braceDepth = 0, hasAddListener = false, hasRemoveListener = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/\buseEffect\s*\(/.test(line)) { inUseEffect = true; effectStartLine = i + 1; braceDepth = 0; hasAddListener = false; hasRemoveListener = false; }
      if (inUseEffect) {
        for (const ch of line) { if (ch === '{') braceDepth++; if (ch === '}') braceDepth--; }
        if (/addEventListener\s*\(/.test(line)) hasAddListener = true;
        if (/removeEventListener\s*\(/.test(line)) hasRemoveListener = true;
        if (braceDepth <= 0 && i > effectStartLine) {
          if (hasAddListener && !hasRemoveListener) listenerIssues.push({ file: relative('.', file), line: effectStartLine });
          inUseEffect = false;
        }
      }
    }
  }
  if (listenerIssues.length === 0) passOk('DB-3', 'Event listeners con cleanup');
  else { passIssue('DB-3', 'addEventListener sin removeEventListener en useEffect', listenerIssues.length); for (const { file, line } of listenerIssues.slice(0, 10)) console.log(`      L${line}  ← ${file}`); }

  // DB-4: Timers without cleanup in useEffect
  const timerIssues = [];
  for (const file of tsxFiles) {
    if (!file.endsWith('.tsx')) continue;
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let inUseEffect = false, effectStartLine = 0, effectContent = '', braceDepth = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/\buseEffect\s*\(/.test(line)) { inUseEffect = true; effectStartLine = i + 1; braceDepth = 0; effectContent = ''; }
      if (inUseEffect) {
        effectContent += line + '\n';
        for (const ch of line) { if (ch === '{') braceDepth++; if (ch === '}') braceDepth--; }
        if (braceDepth <= 0 && i > effectStartLine) {
          if (/\bsetInterval\s*\(/.test(effectContent) && !/\bclearInterval\s*\(/.test(effectContent))
            timerIssues.push({ file: relative('.', file), line: effectStartLine, type: 'setInterval sin clearInterval' });
          const stCount = (effectContent.match(/\bsetTimeout\s*\(/g) || []).length;
          const ctCount = (effectContent.match(/\bclearTimeout\s*\(/g) || []).length;
          const hasCleanup = /return\s*\(?\s*\)\s*=>/.test(effectContent);
          if (stCount > 0 && ctCount === 0 && !hasCleanup && stCount > 1)
            timerIssues.push({ file: relative('.', file), line: effectStartLine, type: `${stCount} setTimeout sin cleanup` });
          inUseEffect = false;
        }
      }
    }
  }
  if (timerIssues.length === 0) passOk('DB-4', 'Timers con cleanup en useEffect');
  else { passIssue('DB-4', 'Timers sin cleanup en useEffect', timerIssues.length); for (const { file, line, type } of timerIssues.slice(0, 10)) console.log(`      L${line} ${type}  ← ${file}`); }

  // DB-5: Hardcoded strings in TSX (i18n candidates)
  const hardcodedStrings = [];
  for (const file of tsxFiles) {
    if (!file.endsWith('.tsx')) continue;
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    const relFile = relative('.', file);
    let count = 0; const samples = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('import ') || line.startsWith('//') || line.startsWith('*') || line.startsWith('/*')) continue;
      if (line.startsWith('type ') || line.startsWith('interface ') || line.startsWith('export type')) continue;
      let m;
      const jsxTextRe = />([A-Z][a-zA-Z\s]{3,}[a-z])</g;
      while ((m = jsxTextRe.exec(line)) !== null) { const text = m[1].trim(); if (text.length >= 5 && !/^[A-Z][a-z]+[A-Z]/.test(text)) { count++; if (samples.length < 3) samples.push({ line: i + 1, text: text.substring(0, 40) }); } }
      const attrRe = /(?:title|placeholder|alt)=["']([A-Z][a-zA-Z\s]{4,})["']/g;
      while ((m = attrRe.exec(line)) !== null) { const text = m[1].trim(); if (text.length >= 5) { count++; if (samples.length < 3) samples.push({ line: i + 1, text: text.substring(0, 40) }); } }
    }
    if (count > 0) hardcodedStrings.push({ file: relFile, count, samples });
  }
  const totalHS = hardcodedStrings.reduce((a, b) => a + b.count, 0);
  if (totalHS === 0) passOk('DB-5', 'Strings hardcodeados en TSX (i18n)');
  else {
    console.log(`   ⚠️  DB-5: Strings hardcodeados en TSX — ${totalHS} en ${hardcodedStrings.length} archivos`);
    for (const { file, count, samples } of hardcodedStrings.sort((a, b) => b.count - a.count).slice(0, 8))
      console.log(`      ${file}: ${count} (${samples.map(s => `L${s.line}:"${s.text}"`).join(', ')})`);
  }

  // DB-6: CSS selector in multiple files (cross-file conflicts)
  const selectorFiles = new Map();
  const SEL_RE = /^(\.[a-z][a-zA-Z0-9_-]+(?:__[a-zA-Z0-9_-]+)?(?:--[a-zA-Z0-9_-]+)?)\s*[{,]/;
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf-8');
    const relFile = relative('.', file);
    let inComment = false;
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('/*')) inComment = true;
      if (trimmed.includes('*/')) { inComment = false; continue; }
      if (inComment) continue;
      const m = trimmed.match(SEL_RE);
      if (m) { if (!selectorFiles.has(m[1])) selectorFiles.set(m[1], new Set()); selectorFiles.get(m[1]).add(relFile); }
    }
  }
  const crossFile = [...selectorFiles.entries()].filter(([, files]) => files.size > 1).map(([sel, files]) => ({ selector: sel, files: [...files] }));
  if (crossFile.length === 0) passOk('DB-6', `Selectores cross-file — ${selectorFiles.size} selectores, sin conflictos`);
  else {
    console.log(`   ⚠️  DB-6: Selectores CSS en múltiples archivos — ${crossFile.length}`);
    for (const { selector, files } of crossFile.sort((a, b) => b.files.length - a.files.length).slice(0, 10))
      console.log(`      ${selector} → ${files.join(', ')}`);
  }

  // DB-7: Contradictory @media queries
  const contradictory = [];
  const MEDIA_RE = /@media[^{]*\(min-width:\s*(\d+)px\)[^{]*\(max-width:\s*(\d+)px\)/g;
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      MEDIA_RE.lastIndex = 0;
      let m;
      while ((m = MEDIA_RE.exec(lines[i])) !== null) {
        if (parseInt(m[1]) > parseInt(m[2])) contradictory.push({ file: relative('.', file), line: i + 1, min: m[1], max: m[2] });
      }
    }
  }
  if (contradictory.length === 0) passOk('DB-7', '@media queries contradictorias');
  else { passIssue('DB-7', '@media queries contradictorias (min > max)', contradictory.length); for (const { file, line, min, max } of contradictory.slice(0, 10)) console.log(`      min:${min}px AND max:${max}px L${line}  ← ${file}`); }

  // DB-8: localStorage/sessionStorage without try-catch
  const unsafeStorage = [];
  for (const file of tsxFiles) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    const relFile = relative('.', file);
    if (content.includes('safeLocalStorage') || content.includes('safeSessionStorage')) continue;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('//') || lines[i].trim().startsWith('*')) continue;
      const m = lines[i].match(/\b(localStorage|sessionStorage)\.(getItem|setItem|removeItem|clear)\b/);
      if (m) {
        let inTry = false;
        for (let j = Math.max(0, i - 5); j <= i; j++) { if (/\btry\s*\{/.test(lines[j])) { inTry = true; break; } }
        if (!inTry) unsafeStorage.push({ file: relFile, line: i + 1, api: `${m[1]}.${m[2]}` });
      }
    }
  }
  if (unsafeStorage.length === 0) passOk('DB-8', 'Storage access con try-catch');
  else {
    console.log(`   ⚠️  DB-8: Storage sin try-catch — ${unsafeStorage.length} accesos directos`);
    const byFile = {};
    for (const { file, line, api } of unsafeStorage) { if (!byFile[file]) byFile[file] = []; byFile[file].push({ line, api }); }
    for (const [file, items] of Object.entries(byFile).slice(0, 8)) console.log(`      ${file}: ${items.map(i => `L${i.line} ${i.api}`).join(', ')}`);
  }

  // DB-9: var() fallback coverage (informational)
  let varWithFb = 0, varWithoutFb = 0;
  for (const file of cssFiles) {
    const content = readFileSync(file, 'utf-8');
    const withFb = (content.match(/var\(\s*--[a-zA-Z0-9_-]+\s*,/g) || []).length;
    const total = (content.match(/var\(\s*--[a-zA-Z0-9_-]+/g) || []).length;
    varWithFb += withFb; varWithoutFb += (total - withFb);
  }
  const fbPct = varWithFb + varWithoutFb > 0 ? Math.round((varWithFb / (varWithFb + varWithoutFb)) * 100) : 0;
  console.log(`   ℹ️  DB-9: var() fallbacks — ${varWithFb} con fallback (${fbPct}%), ${varWithoutFb} sin fallback`);

  // DB-10: Bundle size hotspots
  const cssSizes = cssFiles.map(f => ({ file: relative('.', f), size: statSync(f).size })).sort((a, b) => b.size - a.size);
  const totalSize = cssSizes.reduce((a, b) => a + b.size, 0);
  console.log(`   ℹ️  DB-10: CSS size hotspots — ${(totalSize / 1024).toFixed(1)} KB total en ${cssSizes.length} archivos`);
  for (const { file, size } of cssSizes.slice(0, 8)) console.log(`      ${(size / 1024).toFixed(1)} KB (${((size / totalSize) * 100).toFixed(1)}%) ← ${file}`);
}

// ╔═══════════════════════════════════════════════════════╗
// ║  GRUPO DC: JSON Data Integrity (DC-1 .. DC-10)       ║
// ╚═══════════════════════════════════════════════════════╝

function runGroupDC() {
  console.log('\n══ DC: JSON Data Integrity ══\n');
  const tsxFiles = getTsxFiles();

  const modules = JSON.parse(readFileSync(join(PUBLIC_DATA, 'learningModules.json'), 'utf-8'));
  const moduleIds = new Set(modules.map(m => m.id));
  const appConfig = JSON.parse(readFileSync(join(PUBLIC_DATA, 'app-config.json'), 'utf-8'));

  // DC-1: JSON dataPath integrity
  const missingPaths = modules.filter(m => m.dataPath && !existsSync(join('public', m.dataPath)));
  if (missingPaths.length === 0) passOk('DC-1', `dataPath integrity — ${modules.length} módulos, todos existen`);
  else { passIssue('DC-1', 'dataPath apunta a archivos inexistentes', missingPaths.length); for (const { id, dataPath } of missingPaths) console.log(`      ${id} → ${dataPath}`); }

  // DC-2: Prerequisite chain integrity + circular deps
  const brokenPrereqs = [];
  for (const mod of modules) { for (const prereqId of mod.prerequisites || []) { if (!moduleIds.has(prereqId)) brokenPrereqs.push({ id: mod.id, missingPrereq: prereqId }); } }
  const circularDeps = [];
  function detectCycle(moduleId, visited, path) {
    if (path.includes(moduleId)) { circularDeps.push([...path, moduleId]); return; }
    if (visited.has(moduleId)) return;
    visited.add(moduleId); path.push(moduleId);
    const mod = modules.find(m => m.id === moduleId);
    if (mod) for (const prereqId of mod.prerequisites || []) { if (moduleIds.has(prereqId)) detectCycle(prereqId, visited, [...path]); }
  }
  const visitedGlobal = new Set();
  for (const mod of modules) { if (!visitedGlobal.has(mod.id)) detectCycle(mod.id, visitedGlobal, []); }
  const prereqCount = brokenPrereqs.length + circularDeps.length;
  if (prereqCount === 0) passOk('DC-2', `Prerequisite chains — ${modules.length} módulos, cadenas válidas`);
  else {
    passIssue('DC-2', 'Problemas en cadena de prerequisites', prereqCount);
    for (const { id, missingPrereq } of brokenPrereqs) console.log(`      ${id} → prerequisite "${missingPrereq}" no existe`);
    for (const cycle of circularDeps) console.log(`      Ciclo: ${cycle.join(' → ')}`);
  }

  // DC-3: Orphan JSON data files
  const referencedPaths = new Set(modules.map(m => m.dataPath).filter(Boolean));
  const allJsonFiles = walk(PUBLIC_DATA, ['.json']).map(f => relative('public', f)).filter(f => f !== 'data/learningModules.json' && f !== 'data/app-config.json');
  const orphanJson = allJsonFiles.filter(f => !referencedPaths.has(f));
  if (orphanJson.length === 0) passOk('DC-3', `JSON data files — ${allJsonFiles.length} archivos, todos referenciados`);
  else { passIssue('DC-3', 'Archivos JSON no referenciados', orphanJson.length); for (const f of orphanJson) console.log(`      public/${f}`); }

  // DC-4: learningMode vs dataPath naming consistency
  const acceptedCross = new Set(['quiz→completion']);
  const mismatches = [];
  for (const mod of modules) {
    if (!mod.dataPath) continue;
    const parts = basename(mod.dataPath).split('-');
    if (parts.length >= 2) {
      const fileMode = parts[1];
      const modeMap = { reading: 'reading', flashcard: 'flashcard', quiz: 'quiz', completion: 'completion', sorting: 'sorting', matching: 'matching' };
      if (modeMap[fileMode] && modeMap[fileMode] !== mod.learningMode && !acceptedCross.has(`${fileMode}→${mod.learningMode}`))
        mismatches.push({ id: mod.id, declaredMode: mod.learningMode, fileMode, dataPath: mod.dataPath });
    }
  }
  if (mismatches.length === 0) passOk('DC-4', `learningMode vs dataPath — ${modules.length} módulos, consistentes`);
  else { passIssue('DC-4', 'learningMode no coincide con nombre del archivo', mismatches.length); for (const { id, declaredMode, fileMode } of mismatches) console.log(`      ${id}: mode="${declaredMode}" pero archivo dice "${fileMode}"`); }

  // DC-5: Large component files (>300 lines)
  const largeFiles = tsxFiles.map(f => ({ file: relative('.', f), lines: readFileSync(f, 'utf-8').split('\n').length })).filter(f => f.lines > 300).sort((a, b) => b.lines - a.lines);
  if (largeFiles.length === 0) passOk('DC-5', 'Archivos grandes (>300 líneas) — ninguno');
  else {
    console.log(`   ⚠️  DC-5: Archivos grandes (>300 líneas) — ${largeFiles.length} archivos`);
    for (const { file, lines } of largeFiles.slice(0, 10)) console.log(`      ${lines} líneas ← ${file}`);
  }

  // DC-6: CSS files without matching component
  const cssComponentFiles = walk('src/styles/components', ['.css']);
  const tsxNames = new Set(tsxFiles.filter(f => f.endsWith('.tsx')).map(f => basename(f, '.tsx').toLowerCase()));
  const cssImportedInTsx = new Set();
  for (const file of tsxFiles) { const content = readFileSync(file, 'utf-8'); let m; const re = /import\s+['"]([^'"]*\.css)['"]/g; while ((m = re.exec(content)) !== null) cssImportedInTsx.add(basename(m[1])); }
  const cssImportedInCss = new Set();
  for (const file of [...cssComponentFiles, ...walk('src/styles', ['.css'])]) { const content = readFileSync(file, 'utf-8'); let m; const re = /@import\s+['"]([^'"]+)['"]/g; while ((m = re.exec(content)) !== null) cssImportedInCss.add(basename(m[1])); }
  if (existsSync('src/index.css')) { const content = readFileSync('src/index.css', 'utf-8'); let m; const re = /@import\s+['"]([^'"]+)['"]/g; while ((m = re.exec(content)) !== null) cssImportedInCss.add(basename(m[1])); }
  const unmatchedCss = cssComponentFiles.filter(f => {
    const cssName = basename(f);
    const cssBase = basename(f, '.css').toLowerCase();
    const isImported = cssImportedInTsx.has(cssName) || cssImportedInCss.has(cssName);
    const kebabToPascal = cssBase.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('').toLowerCase();
    return !isImported && !tsxNames.has(cssBase) && !tsxNames.has(kebabToPascal);
  }).map(f => relative('.', f));
  if (unmatchedCss.length === 0) passOk('DC-6', `CSS↔Component — ${cssComponentFiles.length} CSS, todos vinculados`);
  else { console.log(`   ⚠️  DC-6: CSS sin componente ni import — ${unmatchedCss.length}`); for (const f of unmatchedCss) console.log(`      ${f}`); }

  // DC-7: Duplicate module IDs
  const idCounts = {};
  for (const mod of modules) idCounts[mod.id] = (idCounts[mod.id] || 0) + 1;
  const dupeIds = Object.entries(idCounts).filter(([, c]) => c > 1);
  if (dupeIds.length === 0) passOk('DC-7', `IDs únicos — ${modules.length} módulos, sin duplicados`);
  else { passIssue('DC-7', 'IDs duplicados en learningModules.json', dupeIds.length); for (const [id, count] of dupeIds) console.log(`      "${id}" aparece ${count} veces`); }

  // DC-8: JSON data file schema validation
  const schemaReqs = {
    flashcard: { arrayField: 'data', requiredFields: ['front', 'back'], altFields: ['en', 'es'] },
    quiz: { arrayField: 'data', requiredFields: ['options', 'correct'] },
    completion: { arrayField: 'data', requiredFields: ['sentence', 'correct'] },
    sorting: { arrayField: 'data', requiredFields: ['word'] },
    matching: { arrayField: 'data', requiredFields: ['left', 'right'] },
    reading: { arrayField: null, requiredFields: ['title', 'sections'] },
  };
  const schemaIssues = [];
  for (const mod of modules) {
    if (!mod.dataPath) continue;
    const fullPath = join('public', mod.dataPath);
    if (!existsSync(fullPath)) continue;
    try {
      const data = JSON.parse(readFileSync(fullPath, 'utf-8'));
      const schema = schemaReqs[mod.learningMode];
      if (!schema) continue;
      if (mod.learningMode === 'reading') {
        const items = Array.isArray(data) ? data : (data.data ? data.data : [data]);
        for (const item of items.slice(0, 1)) { const missing = schema.requiredFields.filter(f => !(f in item)); if (missing.length > 0) schemaIssues.push({ id: mod.id, dataPath: mod.dataPath, missing }); }
      } else {
        const items = Array.isArray(data) ? data : (data.data || []);
        if (items.length === 0) { schemaIssues.push({ id: mod.id, dataPath: mod.dataPath, missing: ['(empty data)'] }); }
        else {
          const sample = items[0];
          const missing = schema.requiredFields.filter(f => !(f in sample));
          if (missing.length > 0) {
            const isQuizVariant = mod.learningMode === 'quiz' && (sample.sentence || sample.idiom);
            const isMatchingPairs = mod.learningMode === 'matching' && sample.pairs;
            const isFlashcardAlt = mod.learningMode === 'flashcard' && schema.altFields && schema.altFields.every(f => f in sample);
            if (!isQuizVariant && !isMatchingPairs && !isFlashcardAlt) schemaIssues.push({ id: mod.id, dataPath: mod.dataPath, missing });
          }
        }
      }
    } catch (e) { schemaIssues.push({ id: mod.id, dataPath: mod.dataPath, missing: [`(parse error: ${e.message})`] }); }
  }
  if (schemaIssues.length === 0) passOk('DC-8', `Schema validation — ${modules.length} módulos, estructura correcta`);
  else { passIssue('DC-8', 'JSON con campos faltantes', schemaIssues.length); for (const { id, missing } of schemaIssues.slice(0, 10)) console.log(`      ${id}: faltan ${missing.join(', ')}`); }

  // DC-9: app-config.json consistency
  const cfgLevels = new Set(appConfig.learningSettings.levels.map(l => l.code));
  const cfgCategories = new Set(appConfig.learningSettings.categories);
  const cfgUnits = new Set(appConfig.learningSettings.units.map(u => u.id));
  const cfgIssues = [];
  const levelUnitMap = { a1: 1, a2: 2, b1: 3, b2: 4, c1: 5, c2: 6 };
  for (const mod of modules) {
    const modLevels = Array.isArray(mod.level) ? mod.level : [mod.level];
    for (const lvl of modLevels) { if (!cfgLevels.has(lvl)) cfgIssues.push({ id: mod.id, type: 'level', value: lvl }); }
    if (!cfgCategories.has(mod.category)) cfgIssues.push({ id: mod.id, type: 'category', value: mod.category });
    // unit is derived from level at runtime, validate the derived value
    const derivedUnit = levelUnitMap[Array.isArray(mod.level) ? mod.level[0] : mod.level];
    if (derivedUnit && !cfgUnits.has(derivedUnit)) cfgIssues.push({ id: mod.id, type: 'unit', value: derivedUnit });
  }
  if (cfgIssues.length === 0) passOk('DC-9', `Config consistency — levels, categories, units alineados`);
  else { passIssue('DC-9', 'Inconsistencias app-config vs learningModules', cfgIssues.length); for (const { id, type, value } of cfgIssues.slice(0, 10)) console.log(`      ${id}: ${type} "${value}" no existe en app-config`); }

  // DC-10: Module progression completeness (unit derived from level)
  const progIssues = [];
  // DC-10: Reviews per level check
  const levelsWithReview = new Set();
  for (const mod of modules) { if (mod.category === 'Review') { const lvls = Array.isArray(mod.level) ? mod.level : [mod.level]; for (const l of lvls) levelsWithReview.add(l); } }
  for (const lvl of cfgLevels) { if (!levelsWithReview.has(lvl)) progIssues.push({ id: `(level ${lvl})`, issue: 'sin módulo Review' }); }
  if (progIssues.length === 0) passOk('DC-10', `Progression — units y reviews consistentes`);
  else { console.log(`   ⚠️  DC-10: Problemas de progresión — ${progIssues.length}`); for (const { id, issue } of progIssues.slice(0, 10)) console.log(`      ${id}: ${issue}`); }
}

// ╔═══════════════════════════════════════════════════════╗
// ║  MAIN                                                 ║
// ╚═══════════════════════════════════════════════════════╝

if (runDA) runGroupDA();
if (runDB) runGroupDB();
if (runDC) runGroupDC();

// Summary
console.log('\n══════════════════════════════════════════════════════');
const groups = [runDA && 'DA', runDB && 'DB', runDC && 'DC'].filter(Boolean).join('+');
if (totalIssues === 0) console.log(`✅ ${groups}: Sin problemas críticos.`);
else console.log(`⚠️  ${groups}: ${totalIssues} problema(s) encontrado(s).`);
console.log();
