#!/usr/bin/env node

/**
 * BEM Compliance Validation Script
 * Scans all TSX files for BEM naming compliance and Tailwind class detection
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logHeader, logInfo, logSuccess, logError } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

// BEM: block__element--modifier (single element, single modifier)
const BEM_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$/;

// Tailwind patterns — must match WHOLE class names, not substrings in BEM names
const TAILWIND_PATTERNS = [
  /^(text|bg|border)-(gray|red|blue|green|yellow|purple|pink|indigo|white|black)-\d+$/,
  /^(hover|focus|active|dark):/,
  /^[wh]-\d+$/,
  /^[mp][trblxy]?-\d+$/,
  /^(flex|grid|block|inline-block|inline-flex|hidden|table)$/,
  /^(rounded|shadow|border)$/,
  /^space-[xy]-\d+$/,
  /^(gap|col-span|row-span)-\d+$/,
  /^(text-(xs|sm|base|lg|xl|2xl|3xl))$/,
  /^(font-(thin|light|normal|medium|semibold|bold|extrabold))$/,
  /^(items|justify|self|place)-(start|end|center|between|around|stretch)$/,
];

const ALLOWED_UTILITY_CLASSES = ['sr-only', 'visually-hidden', 'screen-reader-text'];

function validateBEMNaming(cls) {
  if (ALLOWED_UTILITY_CLASSES.includes(cls)) return true;
  if (cls.startsWith('data-')) return true;
  return BEM_PATTERN.test(cls);
}

function isTailwindClass(cls) {
  return TAILWIND_PATTERNS.some(p => p.test(cls));
}

function extractClassNames(content) {
  const regex = /className=["']([^"']+)["']/g;
  const results = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    results.push({
      className: match[1],
      line: content.substring(0, match.index).split('\n').length,
    });
  }
  return results;
}


function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const classNames = extractClassNames(content);
  const violations = [];

  classNames.forEach(({ className, line }) => {
    const classes = className.split(' ').filter(c => c.length > 0);

    classes.forEach(cls => {
      if (isTailwindClass(cls)) {
        violations.push({ type: 'TAILWIND', line, className: cls });
      } else if (!validateBEMNaming(cls)) {
        violations.push({ type: 'BEM', line, className: cls });
      }
    });
  });

  return violations;
}

function findTSXFiles(dir, files = []) {
  const skip = ['node_modules', '.git', 'dist', 'build', 'coverage'];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && !skip.includes(entry)) findTSXFiles(full, files);
    else if (entry.endsWith('.tsx')) files.push(full);
  }
  return files;
}

function validateBEMCompliance() {
  logHeader('🔍 BEM COMPLIANCE');

  const srcDir = path.join(projectRoot, 'src');
  const tsxFiles = findTSXFiles(srcDir);

  let bemCount = 0;
  let tailwindCount = 0;
  let filesWithIssues = 0;
  const fileViolations = {};

  for (const filePath of tsxFiles) {
    const rel = path.relative(projectRoot, filePath);
    const violations = scanFile(filePath);

    if (violations.length > 0) {
      fileViolations[rel] = violations;
      filesWithIssues++;
      violations.forEach(v => { if (v.type === 'BEM') bemCount++; else tailwindCount++; });
    }
  }

  const total = bemCount + tailwindCount;

  logInfo(`Archivos: ${tsxFiles.length} escaneados, ${filesWithIssues} con problemas`);
  logInfo(`Violaciones: ${bemCount} BEM, ${tailwindCount} Tailwind (${total} total)`);

  if (total > 0) {
    Object.entries(fileViolations).forEach(([file, violations]) => {
      logError(file);
      violations.forEach(v => {
        const icon = v.type === 'BEM' ? '🔸' : '🔹';
        console.log(`  ${icon} L${v.line}: ${v.className}`);
      });
    });
    logError('BEM compliance check failed');
    return false;
  }

  logSuccess('BEM compliance check passed');
  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const passed = validateBEMCompliance();
  process.exit(passed ? 0 : 1);
}

export { validateBEMNaming, isTailwindClass as detectTailwindClasses, validateBEMCompliance };
