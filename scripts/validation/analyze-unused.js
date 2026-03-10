#!/usr/bin/env node

/**
 * Análisis exhaustivo de código muerto en src/
 *
 * Ejecuta 12 pasadas independientes:
 *   1. Archivos huérfanos (BFS desde entry points)
 *   2. Exports muertos (no usados ni interna ni externamente)
 *   3. Exports solo internos (export innecesario)
 *   4. Imports fantasma (importan símbolos que no existen en el destino)
 *   5. Bloques CSS sin uso en TS/TSX
 *   6. Funciones/variables internas muertas (no exportadas, no usadas)
 *   7. Selectores CSS __element/--modifier huérfanos
 *   8. Dependencias npm sin uso en src/
 *   9. CSS custom properties definidas pero no referenciadas
 *  10. Archivos CSS vacíos (solo comentarios/imports)
 *  11. devDependencies importadas en src/ (debería ser solo dependencies)
 *  12. Selectores CSS duplicados en mismo archivo
 *  13. console.log en código de producción (debería usar logger)
 *  14. @media queries duplicadas en mismo archivo (mismo breakpoint)
 *  15. CSS !important audit (uso excesivo por archivo)
 *  16. Tipos TypeScript no exportados y no usados
 *  17. Breakpoint overlap/gap en @media queries (mismo archivo)
 *
 * Uso: node scripts/validation/analyze-unused.js [--strict]
 *   --strict: exit code 1 si encuentra problemas
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, resolve, relative, extname } from 'path';

const SRC = resolve('src');
const STYLES_DIR = join(SRC, 'styles');
const STRICT = process.argv.includes('--strict');
const TOTAL_PASSES = 17;
let totalIssues = 0;

// ─── Helpers ───

function walk(dir, exts) {
  const r = [];
  if (!existsSync(dir)) return r;
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) r.push(...walk(f, exts));
    else if (exts.some(x => f.endsWith(x))) r.push(f);
  }
  return r;
}

function resolveImport(importPath, fromFile) {
  const dir = dirname(fromFile);
  const resolved = resolve(dir, importPath);
  if (!extname(resolved)) {
    for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
      if (existsSync(resolved + ext)) return resolved + ext;
    }
    const idx = join(resolved, 'index.ts');
    if (existsSync(idx)) return idx;
  }
  return existsSync(resolved) ? resolved : null;
}

function getTsImports(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const imports = [];
  const re1 = /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/gm;
  let m;
  while ((m = re1.exec(content)) !== null) {
    if (m[1].startsWith('.')) {
      const r = resolveImport(m[1], filePath);
      if (r) imports.push(r);
    }
  }
  const re2 = /import\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((m = re2.exec(content)) !== null) {
    if (m[1].startsWith('.')) {
      const r = resolveImport(m[1], filePath);
      if (r) imports.push(r);
    }
  }
  return imports;
}

function getCssImports(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const imports = [];
  const re = /@import\s+['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const r = resolveImport(m[1], filePath);
    if (r) imports.push(r);
  }
  return imports;
}

// ─── Collect all files ───

const allTs = walk(SRC, ['.ts', '.tsx']).filter(f => !f.endsWith('global.d.ts'));
const allCss = existsSync(STYLES_DIR) ? walk(STYLES_DIR, ['.css']) : [];
const TESTS_DIR = resolve('tests');
const testTs = existsSync(TESTS_DIR) ? walk(TESTS_DIR, ['.ts', '.tsx']) : [];

// Read all TS content once
const contents = {};
for (const f of allTs) contents[f] = readFileSync(f, 'utf-8');
const testContents = {};
for (const f of testTs) testContents[f] = readFileSync(f, 'utf-8');

// ═══════════════════════════════════════════════════════
// PASADA 1: Archivos huérfanos (BFS)
// ═══════════════════════════════════════════════════════

function bfs(start, getEdges) {
  const visited = new Set();
  const q = [start];
  while (q.length > 0) {
    const c = q.shift();
    if (visited.has(c)) continue;
    visited.add(c);
    for (const e of getEdges(c)) {
      if (!visited.has(e)) q.push(e);
    }
  }
  return visited;
}

const reachedTs = bfs(join(SRC, 'main.tsx'), f =>
  (f.endsWith('.ts') || f.endsWith('.tsx')) ? getTsImports(f) : []
);

const reachedCss = new Set();
const cssQ = [join(SRC, 'index.css')];
while (cssQ.length > 0) {
  const c = cssQ.shift();
  if (reachedCss.has(c)) continue;
  reachedCss.add(c);
  if (c.endsWith('.css')) for (const i of getCssImports(c)) if (!reachedCss.has(i)) cssQ.push(i);
}
for (const tsFile of reachedTs) {
  const cssRe = /import\s+['"]([^'"]+\.css)['"]/g;
  let m;
  while ((m = cssRe.exec(contents[tsFile] || '')) !== null) {
    const r = resolveImport(m[1], tsFile);
    if (r && !reachedCss.has(r)) {
      const sub = [r];
      while (sub.length > 0) {
        const c = sub.shift();
        if (reachedCss.has(c)) continue;
        reachedCss.add(c);
        for (const i of getCssImports(c)) if (!reachedCss.has(i)) sub.push(i);
      }
    }
  }
}

const orphanTs = allTs.filter(f => !reachedTs.has(f));
const orphanCss = allCss.filter(f => !reachedCss.has(f));

// ═══════════════════════════════════════════════════════
// PASADA 2 & 3: Exports muertos / solo internos
// ═══════════════════════════════════════════════════════

const exportMap = {};
for (const file of allTs) {
  const re = /export\s+(?:async\s+)?(?:const|function|class|type|interface|enum|let|var)\s+([A-Za-z_]\w*)/g;
  let m;
  while ((m = re.exec(contents[file])) !== null) {
    if (!exportMap[m[1]]) exportMap[m[1]] = [];
    exportMap[m[1]].push(file);
  }
}

const deadExports = [];
const internalOnlyExports = [];

for (const [sym, sourceFiles] of Object.entries(exportMap)) {
  if (sym.length <= 2) continue;
  const re = new RegExp(`\\b${sym}\\b`);

  let usedExternally = false;
  for (const file of allTs) {
    if (sourceFiles.includes(file)) continue;
    if (re.test(contents[file])) { usedExternally = true; break; }
  }
  if (!usedExternally) {
    for (const file of testTs) {
      if (re.test(testContents[file])) { usedExternally = true; break; }
    }
  }
  if (usedExternally) continue;

  let usedInternally = false;
  for (const sf of sourceFiles) {
    for (const line of contents[sf].split('\n')) {
      if (line.includes('export') && re.test(line)) continue;
      if (re.test(line)) { usedInternally = true; break; }
    }
    if (usedInternally) break;
  }

  const isType = sourceFiles.some(f => {
    const defLine = contents[f].split('\n').find(l => l.includes('export') && re.test(l)) || '';
    return /export\s+(type|interface)\s/.test(defLine);
  });

  const entry = { sym, files: sourceFiles.map(f => relative('.', f)), isType };
  if (usedInternally) internalOnlyExports.push(entry);
  else deadExports.push(entry);
}

// ═══════════════════════════════════════════════════════
// PASADA 4: Imports fantasma
// ═══════════════════════════════════════════════════════

const phantomImports = [];

for (const file of allTs) {
  const content = contents[file];
  const re = /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const specifier = m[2];
    if (!specifier.startsWith('.')) continue;
    const resolved = resolveImport(specifier, file);
    if (!resolved || !contents[resolved]) continue;

    const symbols = m[1].split(',').map(s => {
      let cleaned = s.trim().replace(/^type\s+/, '');
      const parts = cleaned.split(/\s+as\s+/);
      return parts[0].trim();
    }).filter(s => s && s !== 'type');

    const targetContent = contents[resolved];
    for (const sym of symbols) {
      if (!sym || sym.length <= 1) continue;
      const exportRe = new RegExp(`export\\s+(?:async\\s+)?(?:const|function|class|type|interface|enum|let|var|default)\\s+${sym}\\b`);
      const reExportRe = new RegExp(`export\\s*\\{[^}]*\\b${sym}\\b`);
      if (!exportRe.test(targetContent) && !reExportRe.test(targetContent)) {
        phantomImports.push({
          sym,
          from: relative('.', file),
          target: relative('.', resolved),
        });
      }
    }
  }
}

// ═══════════════════════════════════════════════════════
// PASADA 5: Bloques CSS sin uso en TS/TSX
// ═══════════════════════════════════════════════════════

const allClassNames = new Set();
for (const file of allTs) {
  const content = contents[file];
  // className="..." and className={`...`}
  const re1 = /className="([^"]+)"/g;
  const re2 = /className=\{`([^`]+)`\}/g;
  let m;
  while ((m = re1.exec(content)) !== null) {
    m[1].split(/\s+/).forEach(c => { if (c && !c.includes('$')) allClassNames.add(c); });
  }
  while ((m = re2.exec(content)) !== null) {
    m[1].replace(/\$\{[^}]+\}/g, ' ').split(/\s+/).forEach(c => {
      if (c && !c.includes('$')) allClassNames.add(c);
    });
  }
}

const jsAppliedClasses = new Set();
for (const file of allTs) {
  const content = contents[file];
  const clRe = /classList\.(?:add|remove|toggle|contains)\(\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = clRe.exec(content)) !== null) jsAppliedClasses.add(m[1]);
}

const unusedCssBlocksMap = new Map();
const visitedCssFiles = new Set();
for (const cssFile of [...allCss, ...walk(SRC, ['.css'])]) {
  if (!reachedCss.has(cssFile)) continue;
  if (visitedCssFiles.has(cssFile)) continue;
  visitedCssFiles.add(cssFile);
  const content = readFileSync(cssFile, 'utf-8');
  const classRe = /^\.([a-z][a-z0-9-]*(?:__[a-z][a-z0-9-]*)?(?:--[a-z][a-z0-9-]*)?)\s*[{,]/gm;
  const blocks = new Set();
  let m;
  while ((m = classRe.exec(content)) !== null) {
    const cls = m[1];
    if (!cls.includes('__') && !cls.includes('--')) blocks.add(cls);
  }
  for (const block of blocks) {
    const key = `${block}|${cssFile}`;
    if (unusedCssBlocksMap.has(key)) continue;
    if (jsAppliedClasses.has(block)) continue;
    let found = false;
    for (const cn of allClassNames) {
      if (cn === block || cn.startsWith(block + '__') || cn.startsWith(block + '--')) {
        found = true; break;
      }
    }
    if (!found) {
      for (const file of allTs) {
        if (contents[file].includes(block)) { found = true; break; }
      }
    }
    if (!found) unusedCssBlocksMap.set(key, { block, file: relative('.', cssFile) });
  }
}
const unusedCssBlocks = [...unusedCssBlocksMap.values()];

// ═══════════════════════════════════════════════════════
// PASADA 6: Funciones/variables internas muertas
// (no exportadas, definidas pero nunca referenciadas)
// ═══════════════════════════════════════════════════════

const deadInternals = [];

// Keywords that are common false positives (React lifecycle, callbacks passed as props, etc.)
const internalIgnore = new Set([
  'App', 'root', 'render', 'main', 'init', 'setup', 'cleanup',
]);

for (const file of allTs) {
  const content = contents[file];
  const lines = content.split('\n');

  // Find non-exported function/const/let/var declarations
  // Patterns:
  //   function foo(...)
  //   const foo = ...
  //   let foo = ...
  //   var foo = ...
  //   type Foo = ...
  //   interface Foo { ... }
  // But NOT lines that start with 'export'
  const defs = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip exported, commented, or empty lines
    if (trimmed.startsWith('export')) continue;
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
    if (!trimmed) continue;

    let m;

    // function name(
    m = trimmed.match(/^(?:async\s+)?function\s+([A-Za-z_]\w*)\s*\(/);
    if (m) { defs.push({ name: m[1], line: i }); continue; }

    // const/let/var name = (arrow fn or value)
    m = trimmed.match(/^(?:const|let|var)\s+([A-Za-z_]\w*)\s*[=:]/);
    if (m && !trimmed.includes('import(')) { defs.push({ name: m[1], line: i }); continue; }

    // type Name = ... / interface Name {
    m = trimmed.match(/^(?:type|interface)\s+([A-Za-z_]\w*)/);
    if (m) { defs.push({ name: m[1], line: i }); continue; }
  }

  for (const { name, line: defLine } of defs) {
    if (name.length <= 2) continue;
    if (internalIgnore.has(name)) continue;
    // Skip if name starts with _ (convention for intentionally unused)
    if (name.startsWith('_')) continue;

    // Count references in the file (excluding the definition line itself)
    const re = new RegExp(`\\b${name}\\b`, 'g');
    let refCount = 0;
    for (let i = 0; i < lines.length; i++) {
      if (i === defLine) continue;
      const matches = lines[i].match(re);
      if (matches) refCount += matches.length;
    }

    if (refCount === 0) {
      deadInternals.push({
        name,
        file: relative('.', file),
        line: defLine + 1,
      });
    }
  }
}

// ═══════════════════════════════════════════════════════
// PASADA 7: Selectores CSS __element/--modifier huérfanos
// (definidos en CSS pero no referenciados en TS/TSX)
// ═══════════════════════════════════════════════════════

const unusedCssSelectors = [];

// Build a set of all class references from TS/TSX (className + classList + string literals)
const allCssRefs = new Set(allClassNames);
for (const cls of jsAppliedClasses) allCssRefs.add(cls);

// Extract BEM-like class strings from TS content
for (const file of allTs) {
  const content = contents[file];
  const strRe = /['"`]([a-z][a-z0-9-]*(?:__[a-z][a-z0-9-]*)(?:--[a-z][a-z0-9-]*)?)['"` ]/g;
  let m;
  while ((m = strRe.exec(content)) !== null) allCssRefs.add(m[1]);
  const modRe = /['"`]([a-z][a-z0-9-]*--[a-z][a-z0-9-]*)['"` ]/g;
  while ((m = modRe.exec(content)) !== null) allCssRefs.add(m[1]);
}

// Collect dynamic BEM prefixes from template literals in TS/TSX
// Patterns like: `block--${var}`, `block__element--${var}`, `${base}--${var}`
// We collect the static prefix before --${ or __${
const dynamicPrefixes = new Set();
// Also collect variable-based base classes: const baseClass = 'toast-card'
// then `${baseClass}--${type}` means 'toast-card--' is a dynamic prefix
const baseClassVars = {}; // varName -> className
for (const file of allTs) {
  const content = contents[file];

  // Detect: const varName = 'some-class'
  const varRe = /(?:const|let|var)\s+(\w+)\s*=\s*['"]([a-z][a-z0-9-]*(?:__[a-z][a-z0-9-]*)?)['"]/g;
  let m;
  while ((m = varRe.exec(content)) !== null) {
    baseClassVars[m[1]] = m[2];
  }

  // Direct template: `block--${var}` or `block__el--${var}`
  const tplRe = /`([^`]*?)--\$\{/g;
  while ((m = tplRe.exec(content)) !== null) {
    // Get the last class-like token before --${
    const before = m[1];
    const lastSpace = Math.max(before.lastIndexOf(' '), before.lastIndexOf('\n'));
    const prefix = before.slice(lastSpace + 1).replace(/\$\{[^}]*\}/g, '');
    if (prefix && /^[a-z][a-z0-9-]*(?:__[a-z][a-z0-9-]*)?$/.test(prefix)) {
      dynamicPrefixes.add(prefix + '--');
    }
  }

  // Template with __${: `block__${var}`
  const tplRe2 = /`([^`]*?)__\$\{/g;
  while ((m = tplRe2.exec(content)) !== null) {
    const before = m[1];
    const lastSpace = Math.max(before.lastIndexOf(' '), before.lastIndexOf('\n'));
    const prefix = before.slice(lastSpace + 1).replace(/\$\{[^}]*\}/g, '');
    if (prefix && /^[a-z][a-z0-9-]*$/.test(prefix)) {
      dynamicPrefixes.add(prefix + '__');
    }
  }

  // Variable-based: `${varName}--${type}` or `${varName}__${el}`
  const varTplRe = /\$\{(\w+)\}(--|__)\$\{/g;
  while ((m = varTplRe.exec(content)) !== null) {
    const varName = m[1];
    const sep = m[2];
    if (baseClassVars[varName]) {
      dynamicPrefixes.add(baseClassVars[varName] + sep);
    }
  }

  // Variable-based with literal suffix: `${varName}--modifier` or `${varName}__element`
  const varLitRe = /\$\{(\w+)\}(--|__)([a-z][a-z0-9-]*)/g;
  while ((m = varLitRe.exec(content)) !== null) {
    const varName = m[1];
    const sep = m[2];
    const suffix = m[3];
    if (baseClassVars[varName]) {
      allCssRefs.add(baseClassVars[varName] + sep + suffix);
    }
  }
}

const visitedCss7 = new Set();
for (const cssFile of [...allCss, ...walk(SRC, ['.css'])]) {
  if (!reachedCss.has(cssFile)) continue;
  if (visitedCss7.has(cssFile)) continue;
  visitedCss7.add(cssFile);
  const content = readFileSync(cssFile, 'utf-8');

  // Extract all class selectors with __ or --
  const classRe = /\.([a-z][a-z0-9-]*(?:__[a-z][a-z0-9-]*)?(?:--[a-z][a-z0-9-]*)?)\b/g;
  const selectors = new Set();
  let m;
  while ((m = classRe.exec(content)) !== null) {
    const cls = m[1];
    if (cls.includes('__') || cls.includes('--')) selectors.add(cls);
  }

  for (const sel of selectors) {
    let found = false;

    // 1. Direct match in className/classList/string refs
    if (allCssRefs.has(sel)) { found = true; }

    // 2. Literal string match in any TS/TSX
    if (!found) {
      for (const file of allTs) {
        if (contents[file].includes(sel)) { found = true; break; }
      }
    }

    // 3. Dynamic BEM: check if selector starts with a known dynamic prefix
    // e.g. sel='toast-card--success', dynamicPrefixes has 'toast-card--'
    // e.g. sel='module-card--flashcard', dynamicPrefixes has 'module-card--'
    if (!found) {
      for (const prefix of dynamicPrefixes) {
        if (sel.startsWith(prefix)) { found = true; break; }
      }
    }

    if (!found) {
      unusedCssSelectors.push({ sel, file: relative('.', cssFile) });
    }
  }
}

// ═══════════════════════════════════════════════════════
// PASADA 8: Dependencias npm sin uso en src/
// ═══════════════════════════════════════════════════════

const unusedDeps = [];

const pkgPath = resolve('package.json');
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const deps = Object.keys(pkg.dependencies || {});

  // Map of package name → possible import patterns
  // Some packages are imported differently than their npm name
  const importAliases = {
    'react-dom': ['react-dom'],
    'react-hook-form': ['react-hook-form'],
    'react-i18next': ['react-i18next'],
    '@hookform/resolvers': ['@hookform/resolvers'],
    '@tanstack/react-query': ['@tanstack/react-query'],
    'lucide-react': ['lucide-react'],
    'fuse.js': ['fuse.js', 'fuse'],
  };

  // Concatenate all src/ TS content for searching
  const allSrcContent = Object.values(contents).join('\n');

  for (const dep of deps) {
    const patterns = importAliases[dep] || [dep];
    let found = false;

    for (const pattern of patterns) {
      // Check import/require statements
      if (allSrcContent.includes(`'${pattern}`) || allSrcContent.includes(`"${pattern}`)) {
        found = true;
        break;
      }
      // Check for subpath imports like 'react-dom/client'
      if (allSrcContent.includes(`'${pattern}/`) || allSrcContent.includes(`"${pattern}/`)) {
        found = true;
        break;
      }
    }

    if (!found) {
      unusedDeps.push(dep);
    }
  }
}

// ═══════════════════════════════════════════════════════
// PASADA 9: CSS custom properties definidas pero no usadas
// (--variable definida en :root pero nunca referenciada con var(--variable))
// ═══════════════════════════════════════════════════════

const unusedCssVars = [];

// Collect all CSS custom property definitions from reached CSS files
const cssVarDefs = new Map(); // varName -> file where defined
const allCssContent = [];
const visitedCss9 = new Set();
for (const cssFile of [...allCss, ...walk(SRC, ['.css'])]) {
  if (!reachedCss.has(cssFile)) continue;
  if (visitedCss9.has(cssFile)) continue;
  visitedCss9.add(cssFile);
  const content = readFileSync(cssFile, 'utf-8');
  allCssContent.push(content);
  // Match custom property definitions: --name: value
  const defRe = /^\s*(--[a-z][a-z0-9-]*)\s*:/gm;
  let m;
  while ((m = defRe.exec(content)) !== null) {
    const varName = m[1];
    // Skip theme variables (--theme-*) — these come from JS theme system
    if (varName.startsWith('--theme-')) continue;
    // Only track first definition
    if (!cssVarDefs.has(varName)) {
      cssVarDefs.set(varName, relative('.', cssFile));
    }
  }
}

// Check usage: var(--name) in all CSS and TS/TSX files
const allCssJoined = allCssContent.join('\n');
const allTsJoined = Object.values(contents).join('\n');

for (const [varName, defFile] of cssVarDefs) {
  const usage = `var(${varName}`;
  // Also check if used as fallback reference: var(--other, var(--this))
  // Or referenced in TS (e.g. style.setProperty)
  const usedInCss = allCssJoined.includes(usage);
  const usedInTs = allTsJoined.includes(varName);
  if (!usedInCss && !usedInTs) {
    unusedCssVars.push({ varName, file: defFile });
  }
}

// ═══════════════════════════════════════════════════════
// PASADA 10: Archivos CSS vacíos o solo con comentarios
// (después de limpieza pueden quedar archivos sin reglas útiles)
// ═══════════════════════════════════════════════════════

const emptyCssFiles = [];

const visitedCss10 = new Set();
for (const cssFile of [...allCss, ...walk(SRC, ['.css'])]) {
  if (!reachedCss.has(cssFile)) continue;
  if (visitedCss10.has(cssFile)) continue;
  visitedCss10.add(cssFile);
  const content = readFileSync(cssFile, 'utf-8');
  // Strip comments and whitespace
  const stripped = content
    .replace(/\/\*[\s\S]*?\*\//g, '')  // block comments
    .replace(/\/\/.*/g, '')             // line comments (rare in CSS)
    .replace(/@import\s+['"][^'"]+['"]\s*;/g, '') // @import statements
    .trim();
  // If nothing meaningful remains (no selectors, no rules)
  if (!stripped || !/[{};]/.test(stripped)) {
    emptyCssFiles.push(relative('.', cssFile));
  }
}

// ═══════════════════════════════════════════════════════
// PASADA 11: devDependencies usadas en src/ (debería ser solo dependencies)
// (paquetes de devDependencies importados en código de producción)
// ═══════════════════════════════════════════════════════

const devDepsInSrc = [];

if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const devDeps = Object.keys(pkg.devDependencies || {});

  for (const dep of devDeps) {
    let found = false;
    for (const file of allTs) {
      const lines = contents[file].split('\n');
      for (const line of lines) {
        const trimmed = line.trimStart();
        // Skip triple-slash references and comments
        if (trimmed.startsWith('///') || trimmed.startsWith('//')) continue;
        // Check for import 'dep' or import ... from 'dep' or require('dep')
        if (trimmed.startsWith('import') && (line.includes(`'${dep}'`) || line.includes(`"${dep}"`) || line.includes(`'${dep}/`) || line.includes(`"${dep}/`))) {
          found = true;
          break;
        }
        if (line.includes('require') && (line.includes(`'${dep}'`) || line.includes(`"${dep}"`) || line.includes(`'${dep}/`) || line.includes(`"${dep}/`))) {
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (found) devDepsInSrc.push(dep);
  }
}

// ═══════════════════════════════════════════════════════
// PASADA 12: Archivos CSS con selectores duplicados
// (mismo selector definido más de una vez en el mismo archivo)
// ═══════════════════════════════════════════════════════

const duplicateCssSelectors = [];

const visitedCss12 = new Set();
for (const cssFile of [...allCss, ...walk(SRC, ['.css'])]) {
  if (!reachedCss.has(cssFile)) continue;
  if (visitedCss12.has(cssFile)) continue;
  visitedCss12.add(cssFile);
  const content = readFileSync(cssFile, 'utf-8');

  // Strip comments
  const noComments = content.replace(/\/\*[\s\S]*?\*\//g, '');

  // Parse top-level selectors only (not inside @media, @supports, @keyframes)
  // Strategy: track brace depth, only count selectors at depth 0
  const selectorCounts = new Map();
  let depth = 0;
  let i = 0;
  while (i < noComments.length) {
    const ch = noComments[i];

    // Skip @-rules that create nested blocks
    if (ch === '@' && depth === 0) {
      // Find the opening brace of this @-rule
      const braceIdx = noComments.indexOf('{', i);
      if (braceIdx !== -1) {
        const atPrelude = noComments.slice(i, braceIdx).trim();
        // @media, @supports, @keyframes — skip entire block
        if (/^@(media|supports|keyframes|layer)\b/.test(atPrelude)) {
          // Find matching closing brace
          let d = 0;
          let j = braceIdx;
          while (j < noComments.length) {
            if (noComments[j] === '{') d++;
            else if (noComments[j] === '}') { d--; if (d === 0) break; }
            j++;
          }
          i = j + 1;
          continue;
        }
      }
    }

    if (ch === '{') {
      if (depth === 0) {
        // Extract selector before this brace
        let start = i - 1;
        while (start >= 0 && noComments[start] !== '}' && noComments[start] !== ';' && noComments[start] !== '@') start--;
        const sel = noComments.slice(start + 1, i).trim();
        if (sel && sel.length > 3 && (sel.includes('.') || sel.includes('#'))) {
          // Normalize whitespace
          const normalized = sel.replace(/\s+/g, ' ');
          selectorCounts.set(normalized, (selectorCounts.get(normalized) || 0) + 1);
        }
      }
      depth++;
    } else if (ch === '}') {
      depth--;
    }
    i++;
  }

  for (const [sel, count] of selectorCounts) {
    if (count > 1) {
      duplicateCssSelectors.push({
        sel,
        count,
        file: relative('.', cssFile),
      });
    }
  }
}

// ═══════════════════════════════════════════════════════
// PASADA 13: console.log en código de producción
// (debug logs que deberían usar logger o eliminarse)
// ═══════════════════════════════════════════════════════

const debugLogs = [];

// Files where console.* is acceptable
const consoleAllowList = new Set([
  resolve('src/utils/logger.ts'),       // Logger itself uses console
  resolve('src/main.tsx'),              // Critical init errors
]);

for (const file of allTs) {
  if (consoleAllowList.has(file)) continue;
  const lines = contents[file].split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
    // Match console.log and console.debug (warn/error are often intentional)
    const match = trimmed.match(/console\.(log|debug)\s*\(/);
    if (match) {
      debugLogs.push({
        file: relative('.', file),
        line: i + 1,
        text: trimmed,
      });
    }
  }
}

// ═══════════════════════════════════════════════════════
// PASADA 14: @media queries duplicadas en mismo archivo
// Clasifica duplicados reales (propiedades solapadas sin !important) vs estructurales
// ═══════════════════════════════════════════════════════

const duplicateMediaQueries = [];

/**
 * Extract the body content of a @media block starting at `startIdx`
 * (the position of the opening `{`). Handles nested braces.
 */
function extractMediaBody(content, startIdx) {
  let depth = 0;
  let i = startIdx;
  while (i < content.length) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') { depth--; if (depth === 0) return content.slice(startIdx + 1, i); }
    i++;
  }
  return content.slice(startIdx + 1);
}

/**
 * Extract top-level selector→properties map from a @media block body.
 * Returns Map<selector, Set<property>> where property is the CSS property name.
 */
function extractSelectorProps(body) {
  /** @type {Map<string, {props: Set<string>, hasImportant: boolean}>} */
  const result = new Map();
  let depth = 0;
  let currentSelector = '';
  let currentBlock = '';
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === '{') {
      if (depth === 0) {
        currentSelector = currentSelector.trim().replace(/\s+/g, ' ');
        currentBlock = '';
      }
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && currentSelector) {
        // Parse properties from the block
        const props = new Set();
        let hasImportant = false;
        const declarations = currentBlock.split(';');
        for (const decl of declarations) {
          const trimmed = decl.trim();
          if (!trimmed || trimmed.startsWith('/*')) continue;
          const colonIdx = trimmed.indexOf(':');
          if (colonIdx > 0) {
            props.add(trimmed.slice(0, colonIdx).trim());
            if (trimmed.includes('!important')) hasImportant = true;
          }
        }
        if (props.size > 0) {
          // Merge with existing entry for same selector (handles comma-separated selectors)
          if (result.has(currentSelector)) {
            const existing = result.get(currentSelector);
            for (const p of props) existing.props.add(p);
            if (hasImportant) existing.hasImportant = true;
          } else {
            result.set(currentSelector, { props, hasImportant });
          }
        }
        currentSelector = '';
        currentBlock = '';
      }
    } else if (depth === 0) {
      currentSelector += ch;
    } else if (depth === 1) {
      currentBlock += ch;
    }
  }
  return result;
}

const visitedCss14 = new Set();
for (const cssFile of [...allCss, ...walk(SRC, ['.css'])]) {
  if (!reachedCss.has(cssFile)) continue;
  if (visitedCss14.has(cssFile)) continue;
  visitedCss14.add(cssFile);
  const content = readFileSync(cssFile, 'utf-8');

  // Collect all @media blocks with their positions and selector→props
  const mediaRe = /@media\s*([^{]+)\{/g;
  /** @type {Map<string, Array<{start: number, selectorProps: Map<string, {props: Set<string>, hasImportant: boolean}>}>>} */
  const mediaBlocks = new Map();
  let m;
  while ((m = mediaRe.exec(content)) !== null) {
    const query = m[1].trim().replace(/\s+/g, ' ');
    const braceIdx = m.index + m[0].length - 1;
    const body = extractMediaBody(content, braceIdx);
    const selectorProps = extractSelectorProps(body);
    if (!mediaBlocks.has(query)) mediaBlocks.set(query, []);
    mediaBlocks.get(query).push({ start: m.index, selectorProps });
  }

  for (const [query, blocks] of mediaBlocks) {
    if (blocks.length < 2) continue;

    // For each pair of blocks, find selectors with overlapping PROPERTIES
    // Exclude cases where the later block uses !important (intentional cascade override)
    const realOverlaps = [];

    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        for (const [sel, dataJ] of blocks[j].selectorProps) {
          if (!blocks[i].selectorProps.has(sel)) continue;
          const dataI = blocks[i].selectorProps.get(sel);
          // If later block uses !important, it's an intentional cascade override
          if (dataJ.hasImportant) continue;
          // Check for overlapping properties
          const sharedProps = [...dataJ.props].filter(p => dataI.props.has(p));
          if (sharedProps.length > 0) {
            realOverlaps.push({ selector: sel, props: sharedProps });
          }
        }
      }
    }

    const allSelectors = new Set();
    for (const block of blocks) {
      for (const sel of block.selectorProps.keys()) allSelectors.add(sel);
    }

    duplicateMediaQueries.push({
      query: `@media ${query}`,
      count: blocks.length,
      file: relative('.', cssFile),
      type: realOverlaps.length > 0 ? 'real' : 'structural',
      overlapping: realOverlaps,
    });
  }
}

// ═══════════════════════════════════════════════════════
// PASADA 15: CSS !important audit
// (archivos con uso excesivo de !important — umbral: 5+)
// Clasifica por contexto: @media, dark mode, state (--modifier), base
// Excluye archivos donde !important es patrón esperado:
//   - override files (specificity battles by design)
//   - safari/browser fixes (must override UA styles)
//   - layout.css (position: fixed overrides)
//   - accessibility media queries (prefers-reduced-motion)
// ═══════════════════════════════════════════════════════

const importantAbuse = [];
const IMPORTANT_THRESHOLD = 5;

// Files where !important is an expected pattern
const importantAllowList = new Set([
  'safari-mobile-fixes.css',
  'matching-component-override.css',
  'layout.css',
  'orientation-lock.css',
]);

/**
 * Classify !important usage context by tracking brace depth and selectors.
 * Categories:
 *   media    — inside @media query
 *   dark     — inside .dark / html.dark / [data-theme="dark"] selector
 *   state    — inside BEM --modifier or pseudo-state selector (:hover, :focus, etc.)
 *   base     — none of the above (potential refactoring candidate)
 */
function classifyImportantLines(content) {
  const lines = content.split('\n');
  const categories = { media: [], dark: [], state: [], specificity: [], base: [] };
  let inComment = false;

  // Context stack: track what scope each brace depth represents
  const contextStack = [];
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Strip comments from line to get effective code
    let effective = '';
    let j = 0;
    while (j < line.length) {
      if (inComment) {
        if (line[j] === '*' && line[j + 1] === '/') { inComment = false; j += 2; continue; }
        j++;
      } else {
        if (line[j] === '/' && line[j + 1] === '*') { inComment = true; j += 2; continue; }
        if (line[j] === '/' && line[j + 1] === '/') break; // rest is comment
        effective += line[j];
        j++;
      }
    }

    if (!effective.trim()) continue;

    // Detect context-opening lines (before counting braces)
    const isMediaLine = /^\s*@media\b/.test(effective);
    const isDarkLine = /\.(dark|theme-dark)|html\.dark|\[data-theme/.test(effective);
    const isStateLine = /--[a-z]/.test(effective) || /:(hover|focus|active|disabled|checked|visited)\b/.test(effective);
    // High specificity: html body .x, or nested .parent .child selectors
    const selectorPart = effective.split('{')[0].trim();
    const isHighSpecificity = /html\s+body\b/.test(selectorPart) ||
      (/\.\S+\s+\.\S+/.test(selectorPart) && !isMediaLine && !isDarkLine && !isStateLine);

    // Count braces on effective (non-comment) code
    for (const ch of effective) {
      if (ch === '{') {
        let type = 'rule';
        if (isMediaLine) type = 'media';
        else if (isDarkLine) type = 'dark';
        else if (isStateLine) type = 'state';
        else if (isHighSpecificity) type = 'specificity';
        contextStack.push({ type, depth: braceDepth });
        braceDepth++;
      } else if (ch === '}') {
        braceDepth--;
        while (contextStack.length > 0 && contextStack[contextStack.length - 1].depth >= braceDepth) {
          contextStack.pop();
        }
      }
    }

    // Classify !important on this line
    if (effective.includes('!important')) {
      const lineNum = i + 1;
      const hasMedia = contextStack.some(c => c.type === 'media');
      const hasDark = contextStack.some(c => c.type === 'dark');
      const hasState = contextStack.some(c => c.type === 'state');
      const hasSpecificity = contextStack.some(c => c.type === 'specificity');

      if (hasMedia) categories.media.push(lineNum);
      else if (hasDark) categories.dark.push(lineNum);
      else if (hasState) categories.state.push(lineNum);
      else if (hasSpecificity) categories.specificity.push(lineNum);
      else categories.base.push(lineNum);
    }
  }

  return categories;
}

const visitedCss15 = new Set();
for (const cssFile of [...allCss, ...walk(SRC, ['.css'])]) {
  if (!reachedCss.has(cssFile)) continue;
  if (visitedCss15.has(cssFile)) continue;
  visitedCss15.add(cssFile);

  // Skip files in the allowlist
  const basename = cssFile.split('/').pop();
  if (importantAllowList.has(basename)) continue;

  const content = readFileSync(cssFile, 'utf-8');
  const categories = classifyImportantLines(content);
  const total = categories.media.length + categories.dark.length + categories.state.length
    + categories.specificity.length + categories.base.length;

  if (total >= IMPORTANT_THRESHOLD) {
    importantAbuse.push({
      file: relative('.', cssFile),
      count: total,
      lines: [...categories.media, ...categories.dark, ...categories.state,
              ...categories.specificity, ...categories.base].sort((a, b) => a - b),
      categories,
    });
  }
}

// ═══════════════════════════════════════════════════════
// PASADA 16: Tipos TypeScript no exportados y no usados
// (type/interface definidos localmente pero nunca referenciados)
// ═══════════════════════════════════════════════════════

const unusedTypes = [];

for (const file of allTs) {
  const content = contents[file];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip exported types (already covered by Pass 2/3)
    if (trimmed.startsWith('export')) continue;
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;

    // Match: type Name = ... or interface Name {
    const m = trimmed.match(/^(?:type|interface)\s+([A-Z][A-Za-z0-9_]*)/);
    if (!m) continue;

    const typeName = m[1];
    if (typeName.length <= 2) continue;

    // Count references in the same file (excluding the definition line)
    const re = new RegExp(`\\b${typeName}\\b`, 'g');
    let refCount = 0;
    for (let j = 0; j < lines.length; j++) {
      if (j === i) continue;
      const matches = lines[j].match(re);
      if (matches) refCount += matches.length;
    }

    // Also check if used in other files
    if (refCount === 0) {
      let usedElsewhere = false;
      for (const otherFile of allTs) {
        if (otherFile === file) continue;
        if (re.test(contents[otherFile])) { usedElsewhere = true; break; }
      }
      if (!usedElsewhere) {
        unusedTypes.push({
          name: typeName,
          file: relative('.', file),
          line: i + 1,
        });
      }
    }
  }
}

// ═══════════════════════════════════════════════════════
// PASADA 17: Breakpoint overlap/gap en @media queries
// Detecta en un mismo archivo:
//   - Overlap: max-width: Npx + min-width: Npx (ambos aplican a N)
//   - Gap: max-width: Npx + min-width: (N+2)px (nada aplica a N+1)
// Patrón correcto: max-width: Npx + min-width: (N+1)px
// Solo analiza valores dentro de @media (...), no propiedades CSS
// ═══════════════════════════════════════════════════════

const breakpointIssues = [];

const visitedCss17 = new Set();
for (const cssFile of [...allCss, ...walk(SRC, ['.css'])]) {
  if (!reachedCss.has(cssFile)) continue;
  if (visitedCss17.has(cssFile)) continue;
  visitedCss17.add(cssFile);
  const content = readFileSync(cssFile, 'utf-8');

  // Extract only @media query lines, then parse breakpoints from those
  const maxWidths = new Set();
  const minWidths = new Set();

  const mediaRe = /@media\s*\(([^)]+)\)/g;
  let mm;
  while ((mm = mediaRe.exec(content)) !== null) {
    const query = mm[1];
    const maxMatch = query.match(/max-width:\s*(\d+)px/);
    if (maxMatch) maxWidths.add(parseInt(maxMatch[1]));
    const minMatch = query.match(/min-width:\s*(\d+)px/);
    if (minMatch) minWidths.add(parseInt(minMatch[1]));
  }

  // Also handle compound queries: @media (min-width: Xpx) and (max-width: Ypx)
  const mediaFullRe = /@media\s+([^{]+)\{/g;
  let mf;
  while ((mf = mediaFullRe.exec(content)) !== null) {
    const fullQuery = mf[1];
    const allMax = [...fullQuery.matchAll(/max-width:\s*(\d+)px/g)];
    const allMin = [...fullQuery.matchAll(/min-width:\s*(\d+)px/g)];
    for (const m of allMax) maxWidths.add(parseInt(m[1]));
    for (const m of allMin) minWidths.add(parseInt(m[1]));
  }

  const relPath = relative('.', cssFile);

  // Check for overlaps: standalone max-width: N and standalone min-width: N
  // But exclude compound queries where both appear together (e.g. min-width: 520px and max-width: 639px)
  // Strategy: collect standalone max/min (queries with only one condition)
  const standaloneMax = new Set();
  const standaloneMin = new Set();

  const mediaLineRe = /@media\s+([^{]+)\{/g;
  let ml;
  while ((ml = mediaLineRe.exec(content)) !== null) {
    const q = ml[1].trim();
    const maxMatches = [...q.matchAll(/max-width:\s*(\d+)px/g)];
    const minMatches = [...q.matchAll(/min-width:\s*(\d+)px/g)];

    // If query has max-width but NOT min-width, it's a standalone max
    if (maxMatches.length > 0 && minMatches.length === 0) {
      for (const m of maxMatches) standaloneMax.add(parseInt(m[1]));
    }
    // If query has min-width but NOT max-width, it's a standalone min
    if (minMatches.length > 0 && maxMatches.length === 0) {
      for (const m of minMatches) standaloneMin.add(parseInt(m[1]));
    }
  }

  // Overlap: standalone max-width: N + standalone min-width: N
  for (const n of standaloneMax) {
    if (standaloneMin.has(n)) {
      breakpointIssues.push({
        file: relPath,
        type: 'overlap',
        detail: `max-width: ${n}px + min-width: ${n}px (ambos aplican a ${n}px)`,
        fix: `Cambiar min-width a ${n + 1}px o max-width a ${n - 1}px`,
      });
    }
  }

  // Gap: standalone max-width: N + standalone min-width: N+2 (N+1 sin cobertura)
  for (const n of standaloneMax) {
    if (standaloneMin.has(n + 2) && !standaloneMin.has(n + 1)) {
      breakpointIssues.push({
        file: relPath,
        type: 'gap',
        detail: `max-width: ${n}px + min-width: ${n + 2}px (${n + 1}px sin cobertura)`,
        fix: `Cambiar min-width a ${n + 1}px`,
      });
    }
  }
}

// ═══════════════════════════════════════════════════════
// REPORTE
// ═══════════════════════════════════════════════════════

// Helper: compact pass output — one line if clean, expanded if issues
function passOk(num, label) {
  console.log(`   ✅ P${num}: ${label}`);
}
function passIssue(num, label, count) {
  console.log(`   ❌ P${num}: ${label} (${count})`);
}

console.log('\n══ ANÁLISIS: 17 pasadas ══\n');

// Pasada 1
const p1Count = orphanTs.length + orphanCss.length;
if (p1Count === 0) {
  passOk(1, `Archivos huérfanos — TS:${allTs.length}/${reachedTs.size} CSS:${allCss.length}/${reachedCss.size}`);
} else {
  passIssue(1, 'Archivos huérfanos', p1Count);
  for (const f of [...orphanTs, ...orphanCss].sort()) console.log(`      ${relative('.', f)}`);
  totalIssues += p1Count;
}

// Pasada 2
if (deadExports.length === 0) {
  passOk(2, 'Exports muertos');
} else {
  passIssue(2, 'Exports muertos', deadExports.length);
  for (const { sym, files, isType } of deadExports.sort((a,b) => a.files[0].localeCompare(b.files[0]))) {
    console.log(`      ${isType ? '📋' : '❌'} ${sym}  ← ${files.join(', ')}`);
  }
  totalIssues += deadExports.length;
}

// Pasada 3
if (internalOnlyExports.length === 0) {
  passOk(3, 'Exports solo internos');
} else {
  passIssue(3, 'Exports solo internos', internalOnlyExports.length);
  for (const { sym, files } of internalOnlyExports.sort((a,b) => a.files[0].localeCompare(b.files[0]))) {
    console.log(`      ${sym}  ← ${files.join(', ')}`);
  }
  totalIssues += internalOnlyExports.length;
}

// Pasada 4
if (phantomImports.length === 0) {
  passOk(4, 'Imports fantasma');
} else {
  passIssue(4, 'Imports fantasma', phantomImports.length);
  for (const { sym, from, target } of phantomImports) {
    console.log(`      ${sym}  ${from} → ${target}`);
  }
  totalIssues += phantomImports.length;
}

// Pasada 5
if (unusedCssBlocks.length === 0) {
  passOk(5, 'Bloques CSS sin uso');
} else {
  passIssue(5, 'Bloques CSS sin uso', unusedCssBlocks.length);
  for (const { block, file } of unusedCssBlocks.sort((a,b) => a.file.localeCompare(b.file))) {
    console.log(`      .${block}  ← ${file}`);
  }
  totalIssues += unusedCssBlocks.length;
}

// Pasada 6
if (deadInternals.length === 0) {
  passOk(6, 'Funciones/variables internas muertas');
} else {
  passIssue(6, 'Funciones/variables internas muertas', deadInternals.length);
  for (const { name, file, line } of deadInternals.sort((a,b) => a.file.localeCompare(b.file))) {
    console.log(`      ${name}  ← ${file}:${line}`);
  }
  totalIssues += deadInternals.length;
}

// Pasada 7
if (unusedCssSelectors.length === 0) {
  passOk(7, 'Selectores BEM huérfanos');
} else {
  passIssue(7, 'Selectores BEM huérfanos', unusedCssSelectors.length);
  for (const { sel, file } of unusedCssSelectors.sort((a,b) => a.file.localeCompare(b.file))) {
    console.log(`      .${sel}  ← ${file}`);
  }
  totalIssues += unusedCssSelectors.length;
}

// Pasada 8
if (unusedDeps.length === 0) {
  passOk(8, 'Dependencias npm sin uso');
} else {
  passIssue(8, 'Dependencias npm sin uso', unusedDeps.length);
  for (const dep of unusedDeps.sort()) console.log(`      ${dep}`);
  totalIssues += unusedDeps.length;
}

// Pasada 9
if (unusedCssVars.length === 0) {
  passOk(9, 'CSS custom properties sin uso');
} else {
  passIssue(9, 'CSS custom properties sin uso', unusedCssVars.length);
  for (const { varName, file } of unusedCssVars.sort((a,b) => a.file.localeCompare(b.file))) {
    console.log(`      ${varName}  ← ${file}`);
  }
  totalIssues += unusedCssVars.length;
}

// Pasada 10
if (emptyCssFiles.length === 0) {
  passOk(10, 'Archivos CSS vacíos');
} else {
  passIssue(10, 'Archivos CSS vacíos', emptyCssFiles.length);
  for (const file of emptyCssFiles.sort()) console.log(`      ${file}`);
  totalIssues += emptyCssFiles.length;
}

// Pasada 11
if (devDepsInSrc.length === 0) {
  passOk(11, 'devDependencies en src/');
} else {
  passIssue(11, 'devDependencies en src/', devDepsInSrc.length);
  for (const dep of devDepsInSrc.sort()) console.log(`      ${dep}`);
  totalIssues += devDepsInSrc.length;
}

// Pasada 12
if (duplicateCssSelectors.length === 0) {
  passOk(12, 'Selectores CSS duplicados');
} else {
  passIssue(12, 'Selectores CSS duplicados', duplicateCssSelectors.length);
  for (const { sel, count, file } of duplicateCssSelectors.sort((a,b) => a.file.localeCompare(b.file))) {
    console.log(`      ${sel} (×${count})  ← ${file}`);
  }
  totalIssues += duplicateCssSelectors.length;
}

// Pasada 13
if (debugLogs.length === 0) {
  passOk(13, 'console.log en producción');
} else {
  passIssue(13, 'console.log en producción', debugLogs.length);
  for (const { file, line, text } of debugLogs.sort((a,b) => a.file.localeCompare(b.file))) {
    console.log(`      ${file}:${line}  ${text.slice(0, 80)}${text.length > 80 ? '...' : ''}`);
  }
  totalIssues += debugLogs.length;
}

// Pasada 14 (informativa)
const realDupes = duplicateMediaQueries.filter(d => d.type === 'real');
const structuralDupes = duplicateMediaQueries.filter(d => d.type === 'structural');
if (realDupes.length === 0) {
  passOk(14, `@media duplicadas — ${structuralDupes.length} estructurales`);
} else {
  passIssue(14, '@media duplicadas REALES', realDupes.length);
  for (const { query, count, file, overlapping } of realDupes.sort((a,b) => a.file.localeCompare(b.file))) {
    console.log(`      🔴 ${query} (×${count})  ← ${file}`);
    for (const { selector, props } of overlapping.slice(0, 5)) {
      console.log(`         ↳ ${selector}  [${props.join(', ')}]`);
    }
  }
  if (structuralDupes.length > 0) {
    console.log(`      ✅ +${structuralDupes.length} estructurales (ok)`);
  }
}

// Pasada 15 (informativa)
const globalCats = { media: 0, dark: 0, state: 0, specificity: 0, base: 0 };
for (const entry of importantAbuse) {
  globalCats.media += entry.categories.media.length;
  globalCats.dark += entry.categories.dark.length;
  globalCats.state += entry.categories.state.length;
  globalCats.specificity += entry.categories.specificity.length;
  globalCats.base += entry.categories.base.length;
}
const globalTotal = globalCats.media + globalCats.dark + globalCats.state + globalCats.specificity + globalCats.base;
if (globalCats.base === 0) {
  const catParts = [];
  if (globalCats.media > 0) catParts.push(`📱${globalCats.media}`);
  if (globalCats.dark > 0) catParts.push(`🌙${globalCats.dark}`);
  if (globalCats.state > 0) catParts.push(`🔀${globalCats.state}`);
  if (globalCats.specificity > 0) catParts.push(`🎯${globalCats.specificity}`);
  passOk(15, `!important audit — ${globalTotal} usos [${catParts.join(' ')}] todos justificados`);
} else {
  console.log(`   ⚠️  P15: !important audit — ${globalTotal} usos, ${globalCats.base} base (refactoring)`);
  for (const { file, count, categories: cats } of importantAbuse.sort((a,b) => b.count - a.count)) {
    if (cats.base.length === 0) continue;
    const parts = [];
    if (cats.media.length > 0) parts.push(`📱${cats.media.length}`);
    if (cats.dark.length > 0) parts.push(`🌙${cats.dark.length}`);
    if (cats.state.length > 0) parts.push(`🔀${cats.state.length}`);
    if (cats.specificity.length > 0) parts.push(`🎯${cats.specificity.length}`);
    parts.push(`⚠️ ${cats.base.length}`);
    console.log(`      ${file}: ${count} [${parts.join(' ')}]`);
  }
}

// Pasada 16
if (unusedTypes.length === 0) {
  passOk(16, 'Tipos TS no usados');
} else {
  passIssue(16, 'Tipos TS no usados', unusedTypes.length);
  for (const { name, file, line } of unusedTypes.sort((a,b) => a.file.localeCompare(b.file))) {
    console.log(`      ${name}  ← ${file}:${line}`);
  }
  totalIssues += unusedTypes.length;
}

// Pasada 17
if (breakpointIssues.length === 0) {
  passOk(17, 'Breakpoint overlap/gap');
} else {
  passIssue(17, 'Breakpoint overlap/gap', breakpointIssues.length);
  for (const { file, type, detail, fix } of breakpointIssues.sort((a,b) => a.file.localeCompare(b.file))) {
    console.log(`      ${type === 'overlap' ? '🔴' : '🟡'} ${detail}  ← ${file}`);
    console.log(`         💡 ${fix}`);
  }
  totalIssues += breakpointIssues.length;
}

// Resumen
console.log('\n══════════════════════════════════════════════════════');
if (totalIssues === 0) {
  console.log(`✅ LIMPIO — ${TOTAL_PASSES} pasadas, 0 problemas.`);
} else {
  console.log(`⚠️  ${totalIssues} problema(s) en ${TOTAL_PASSES} pasadas.`);
}
console.log();

if (STRICT && totalIssues > 0) process.exit(1);
