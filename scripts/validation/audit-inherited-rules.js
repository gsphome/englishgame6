#!/usr/bin/env node
/**
 * Audit inherited/redundant CSS rules in progression-dashboard.css
 * Detects:
 * 1. Media query overrides that repeat base values (no-op)
 * 2. Properties set in base AND identically in media queries
 * 3. Redundant !important usage
 * 4. Conflicting media query ranges (overlapping breakpoints)
 * 5. Properties in 768px that are re-overridden in 400px (cascade already handles)
 * 6. next-module base already has flex-direction:row, 768px re-sets it
 * 7. Wildcard selectors that are too aggressive
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const file = resolve('src/styles/components/progression-dashboard.css');
const css = readFileSync(file, 'utf-8');
const lines = css.split('\n');

const issues = [];
let issueCount = 0;

// Helper: extract property:value pairs from a CSS block
function extractProps(blockContent) {
  const props = {};
  const propRegex = /^\s*([\w-]+)\s*:\s*(.+?)\s*;?\s*$/gm;
  let match;
  while ((match = propRegex.exec(blockContent)) !== null) {
    props[match[1]] = match[2].replace(/;$/, '').trim();
  }
  return props;
}

// Parse CSS into blocks with selectors and media context
function parseBlocks(cssText) {
  const blocks = [];
  let depth = 0;
  let currentMedia = null;
  let currentSelector = null;
  let blockStart = -1;
  let braceContent = '';
  
  for (let i = 0; i < cssText.length; i++) {
    if (cssText[i] === '{') {
      depth++;
      if (depth === 1) {
        // Find selector before this brace
        let selectorStart = i - 1;
        while (selectorStart >= 0 && cssText[selectorStart] !== '}' && cssText[selectorStart] !== ';' && (selectorStart === i - 1 || cssText[selectorStart] !== '/')) {
          selectorStart--;
        }
        const rawSelector = cssText.substring(selectorStart + 1, i).trim();
        
        if (rawSelector.startsWith('@media')) {
          currentMedia = rawSelector;
        } else if (rawSelector.startsWith('@keyframes')) {
          currentMedia = rawSelector; // skip keyframes
        } else {
          currentSelector = rawSelector;
          blockStart = i + 1;
          braceContent = '';
        }
      } else if (depth === 2 && currentMedia) {
        // Nested selector inside media query
        let selectorStart = i - 1;
        while (selectorStart >= 0 && cssText[selectorStart] !== '{' && cssText[selectorStart] !== '}' && cssText[selectorStart] !== ';') {
          selectorStart--;
        }
        currentSelector = cssText.substring(selectorStart + 1, i).trim();
        blockStart = i + 1;
        braceContent = '';
      }
    } else if (cssText[i] === '}') {
      if (depth === 2 && currentMedia && currentSelector) {
        braceContent = cssText.substring(blockStart, i);
        blocks.push({
          selector: currentSelector,
          media: currentMedia,
          props: extractProps(braceContent),
          raw: braceContent.trim()
        });
        currentSelector = null;
      } else if (depth === 1) {
        if (currentSelector && !currentMedia) {
          braceContent = cssText.substring(blockStart, i);
          blocks.push({
            selector: currentSelector,
            media: null,
            props: extractProps(braceContent),
            raw: braceContent.trim()
          });
          currentSelector = null;
        }
        if (currentMedia) {
          currentMedia = null;
        }
      }
      depth--;
    }
  }
  return blocks;
}

const blocks = parseBlocks(css);

// Group by selector
const bySelector = {};
blocks.forEach(b => {
  if (!bySelector[b.selector]) bySelector[b.selector] = [];
  bySelector[b.selector].push(b);
});

console.log('=== AUDIT: Inherited/Redundant CSS Rules ===\n');
console.log(`File: ${file}`);
console.log(`Total rule blocks: ${blocks.length}\n`);

// CHECK 1: Media query overrides that repeat base values
console.log('--- CHECK 1: Media queries repeating base values (no-op overrides) ---');
let check1Count = 0;
for (const [selector, selectorBlocks] of Object.entries(bySelector)) {
  const baseBlock = selectorBlocks.find(b => !b.media);
  if (!baseBlock) continue;
  
  const mediaBlocks = selectorBlocks.filter(b => b.media);
  for (const mb of mediaBlocks) {
    for (const [prop, val] of Object.entries(mb.props)) {
      if (baseBlock.props[prop] === val) {
        console.log(`  ⚠️  "${selector}" in ${mb.media}`);
        console.log(`      "${prop}: ${val}" is identical to base`);
        check1Count++;
      }
    }
  }
}
if (check1Count === 0) console.log('  ✅ None found');
issueCount += check1Count;

// CHECK 2: Redundant !important usage
console.log('\n--- CHECK 2: !important usage audit ---');
let importantCount = 0;
const importantRegex = /!important/g;
lines.forEach((line, idx) => {
  if (importantRegex.test(line)) {
    importantCount++;
    if (importantCount <= 20) {
      console.log(`  ⚠️  L${idx + 1}: ${line.trim()}`);
    }
  }
});
console.log(`  Total !important: ${importantCount}`);
issueCount += importantCount;

// CHECK 3: Overlapping media query ranges for same selector
console.log('\n--- CHECK 3: Overlapping/conflicting media queries ---');
let check3Count = 0;
for (const [selector, selectorBlocks] of Object.entries(bySelector)) {
  const mediaBlocks = selectorBlocks.filter(b => b.media);
  if (mediaBlocks.length < 2) continue;
  
  // Check for modules grid being set in multiple places
  const mediaQueries = mediaBlocks.map(b => b.media);
  if (mediaQueries.length > 2) {
    console.log(`  ⚠️  "${selector}" appears in ${mediaQueries.length} media queries:`);
    mediaQueries.forEach(mq => console.log(`      - ${mq}`));
    check3Count++;
  }
}
if (check3Count === 0) console.log('  ✅ None found');
issueCount += check3Count;

// CHECK 4: Wildcard selectors
console.log('\n--- CHECK 4: Aggressive wildcard selectors ---');
let check4Count = 0;
lines.forEach((line, idx) => {
  if (line.includes(' *') && line.includes('{') || line.includes(' * {')) {
    console.log(`  ⚠️  L${idx + 1}: ${line.trim()}`);
    check4Count++;
  }
});
if (check4Count === 0) console.log('  ✅ None found');
issueCount += check4Count;

// CHECK 5: next-module base has flex-direction:row, 768px re-sets it
console.log('\n--- CHECK 5: Specific redundancies found ---');
let check5Count = 0;

// next-module: base is already row, 768px sets flex-direction: row
const nextModuleBase = blocks.find(b => b.selector.includes('next-module') && !b.media && !b.selector.includes('--'));
const nextModule768 = blocks.find(b => b.selector.includes('next-module') && b.media?.includes('768'));
if (nextModuleBase && nextModule768) {
  // Base has display:flex (defaults to row), 768px sets flex-direction:row explicitly
  if (nextModule768.props['flex-direction'] === 'row' && !nextModuleBase.props['flex-direction']) {
    console.log(`  ⚠️  __next-module @768px: flex-direction:row is default (base has display:flex without column)`);
    check5Count++;
  }
  // Check text-align
  if (nextModule768.props['text-align'] === 'left' && nextModuleBase.props['text-align'] === undefined) {
    // Not in base but next-info has text-align:left
    const nextInfoBase = blocks.find(b => b.selector.includes('next-info') && !b.media);
    if (nextInfoBase?.props['text-align'] === 'left') {
      console.log(`  ⚠️  __next-module @768px: text-align:left — base __next-info already has text-align:left`);
      check5Count++;
    }
  }
}

// next-info: base has text-align:left, 768px re-sets it
const nextInfoBase = blocks.find(b => b.selector.includes('next-info') && !b.media);
const nextInfo768 = blocks.find(b => b.selector.includes('next-info') && b.media?.includes('768'));
if (nextInfoBase && nextInfo768) {
  if (nextInfo768.props['text-align'] === nextInfoBase.props['text-align']) {
    console.log(`  ⚠️  __next-info @768px: text-align:${nextInfo768.props['text-align']} identical to base`);
    check5Count++;
  }
  if (nextInfo768.props['flex'] === nextInfoBase.props['flex']) {
    console.log(`  ⚠️  __next-info @768px: flex:${nextInfo768.props['flex']} identical to base`);
    check5Count++;
  }
}

// expand-icon: base has 0.75rem, 768px re-sets 0.75rem
const expandIconBase = blocks.find(b => b.selector === '.progression-dashboard__expand-icon' && !b.media);
const expandIcon768 = blocks.find(b => b.selector === '.progression-dashboard__expand-icon' && b.media?.includes('768'));
if (expandIconBase && expandIcon768) {
  for (const [prop, val] of Object.entries(expandIcon768.props)) {
    if (expandIconBase.props[prop] === val) {
      console.log(`  ⚠️  __expand-icon @768px: ${prop}:${val} identical to base`);
      check5Count++;
    }
  }
}

// units gap: base 0.125rem, 768px 0.125rem, max-height:900px 0.125rem
const unitsBase = blocks.find(b => b.selector === '.progression-dashboard__units' && !b.media);
const unitsMediaBlocks = blocks.filter(b => b.selector === '.progression-dashboard__units' && b.media);
if (unitsBase) {
  for (const mb of unitsMediaBlocks) {
    for (const [prop, val] of Object.entries(mb.props)) {
      if (unitsBase.props[prop] === val) {
        console.log(`  ⚠️  __units ${mb.media}: ${prop}:${val} identical to base`);
        check5Count++;
      }
    }
  }
}

// module padding: base 0.25rem, 768px 0.25rem, max-height:900px 0.25rem
const moduleBase = blocks.find(b => b.selector === '.progression-dashboard__module' && !b.media);
const moduleMediaBlocks = blocks.filter(b => b.selector === '.progression-dashboard__module' && b.media);
if (moduleBase) {
  for (const mb of moduleMediaBlocks) {
    for (const [prop, val] of Object.entries(mb.props)) {
      if (moduleBase.props[prop] === val) {
        console.log(`  ⚠️  __module ${mb.media}: ${prop}:${val} identical to base`);
        check5Count++;
      }
    }
  }
}

// modules grid-template-columns: base 140px, 900-1199px also 140px
const modulesBase = blocks.find(b => b.selector === '.progression-dashboard__modules' && !b.media);
const modulesMediaBlocks = blocks.filter(b => b.selector === '.progression-dashboard__modules' && b.media);
if (modulesBase) {
  for (const mb of modulesMediaBlocks) {
    if (mb.props['grid-template-columns'] === modulesBase.props['grid-template-columns']) {
      console.log(`  ⚠️  __modules ${mb.media}: grid-template-columns identical to base (${mb.props['grid-template-columns']})`);
      check5Count++;
    }
  }
}

// continue section: min-height:auto + height:auto is redundant
const continueBase = blocks.find(b => b.selector.includes('__continue') && !b.selector.includes('btn') && !b.selector.includes('icon') && !b.media);
if (continueBase) {
  if (continueBase.props['min-height'] === 'auto' && continueBase.props['height'] === 'auto') {
    console.log(`  ⚠️  __continue: min-height:auto + height:auto — both are defaults, entire rule may be unnecessary`);
    check5Count++;
  }
}

// unit-progress: max-width:none at 768px — base doesn't set max-width
const unitProgressBase = blocks.find(b => b.selector.includes('unit-progress') && !b.media);
const unitProgress768 = blocks.find(b => b.selector.includes('unit-progress') && b.media?.includes('768'));
if (unitProgressBase && unitProgress768) {
  if (unitProgress768.props['max-width'] === 'none' && !unitProgressBase.props['max-width']) {
    console.log(`  ⚠️  __unit-progress @768px: max-width:none — base never sets max-width, this is a no-op`);
    check5Count++;
  }
}

if (check5Count === 0) console.log('  ✅ None found');
issueCount += check5Count;

// CHECK 6: Dark theme duplication between html.dark and --dark-theme file
console.log('\n--- CHECK 6: html.dark rules that duplicate --dark-theme file ---');
const darkThemeFile = readFileSync(resolve('src/styles/components/progression-dashboard-dark-theme.css'), 'utf-8');
const darkThemeBlocks = parseBlocks(darkThemeFile);
const htmlDarkBlocks = blocks.filter(b => b.selector.startsWith('html.dark'));
let check6Count = 0;

for (const hdb of htmlDarkBlocks) {
  // Extract the inner selector (after html.dark)
  const innerSelector = hdb.selector.replace(/^html\.dark\s+/, '');
  // Find matching --dark-theme rule
  const matching = darkThemeBlocks.find(dtb => {
    const dtInner = dtb.selector.replace(/^\.progression-dashboard--dark-theme\s+/, '');
    return dtInner === innerSelector || dtb.selector.includes(innerSelector.replace('.progression-dashboard', ''));
  });
  
  if (matching) {
    // Check for identical properties
    for (const [prop, val] of Object.entries(hdb.props)) {
      if (matching.props[prop] === val) {
        console.log(`  ⚠️  html.dark ${innerSelector}: ${prop} duplicated in --dark-theme file`);
        check6Count++;
      }
    }
  }
}
if (check6Count === 0) console.log('  ✅ None found');
issueCount += check6Count;

// SUMMARY
console.log('\n=== SUMMARY ===');
console.log(`Total issues found: ${issueCount}`);
console.log(`Rule blocks: ${blocks.length}`);
console.log(`Base rules: ${blocks.filter(b => !b.media).length}`);
console.log(`Media query rules: ${blocks.filter(b => b.media).length}`);

const mediaQueries = [...new Set(blocks.filter(b => b.media).map(b => b.media))];
console.log(`\nMedia queries (${mediaQueries.length}):`);
mediaQueries.forEach(mq => {
  const count = blocks.filter(b => b.media === mq).length;
  console.log(`  ${mq}: ${count} rules`);
});
