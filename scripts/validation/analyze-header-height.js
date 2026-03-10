#!/usr/bin/env node

/**
 * Analyze Header Height Issues
 * Detects CSS properties that increase header height unnecessarily
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSS_FILE = path.join(__dirname, '../../src/styles/components/header.css');

// Patterns that increase height
const HEIGHT_ISSUES = {
  padding: /padding:\s*([0-9.]+(?:rem|px|em))/gi,
  paddingVertical: /padding:\s*([0-9.]+(?:rem|px|em))\s+[0-9.]+(?:rem|px|em)/gi,
  paddingTop: /padding-top:\s*([0-9.]+(?:rem|px|em))/gi,
  paddingBottom: /padding-bottom:\s*([0-9.]+(?:rem|px|em))/gi,
  minHeight: /min-height:\s*([0-9.]+(?:rem|px|em))/gi,
  height: /height:\s*([0-9.]+(?:rem|px|em))/gi,
};

// Target selectors for header
const HEADER_SELECTORS = [
  '.header-redesigned',
  '.header-redesigned__container',
  '.header-redesigned__left',
  '.header-redesigned__center',
  '.header-redesigned__right',
];

function analyzeCSS() {
  console.log('🔍 Analyzing Header Height Issues...\n');

  if (!fs.existsSync(CSS_FILE)) {
    console.error(`❌ File not found: ${CSS_FILE}`);
    process.exit(1);
  }

  const content = fs.readFileSync(CSS_FILE, 'utf-8');
  const lines = content.split('\n');

  let issues = [];
  let currentSelector = null;
  let braceDepth = 0;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Track selector
    if (trimmed.includes('{')) {
      const selectorMatch = trimmed.match(/^([^{]+)\s*{/);
      if (selectorMatch) {
        currentSelector = selectorMatch[1].trim();
      }
      braceDepth++;
    }

    if (trimmed.includes('}')) {
      braceDepth--;
      if (braceDepth === 0) {
        currentSelector = null;
      }
    }

    // Check if current selector is a header selector
    if (currentSelector && HEADER_SELECTORS.some(sel => currentSelector.includes(sel))) {
      // Check for height-related issues
      Object.entries(HEIGHT_ISSUES).forEach(([type, pattern]) => {
        const matches = [...trimmed.matchAll(pattern)];
        matches.forEach(match => {
          const value = match[1];
          const numValue = parseFloat(value);

          // Flag issues based on type and value
          let isIssue = false;
          let suggestion = '';

          switch (type) {
            case 'padding':
            case 'paddingVertical':
            case 'paddingTop':
            case 'paddingBottom':
              if (numValue > 0.25) {
                isIssue = true;
                suggestion = `Reduce to 0.125rem (2px) or less`;
              }
              break;

            case 'minHeight':
            case 'height':
              if (numValue > 28) {
                isIssue = true;
                suggestion = `Reduce to 28px or less`;
              }
              break;
          }

          if (isIssue) {
            issues.push({
              line: index + 1,
              selector: currentSelector,
              type,
              property: trimmed,
              value,
              suggestion,
            });
          }
        });
      });
    }
  });

  // Report issues
  if (issues.length === 0) {
    console.log('✅ No height issues found in header CSS!\n');
    return;
  }

  console.log(`⚠️  Found ${issues.length} potential height issues:\n`);

  // Group by selector
  const grouped = issues.reduce((acc, issue) => {
    if (!acc[issue.selector]) {
      acc[issue.selector] = [];
    }
    acc[issue.selector].push(issue);
    return acc;
  }, {});

  Object.entries(grouped).forEach(([selector, selectorIssues]) => {
    console.log(`\n📦 ${selector}`);
    console.log('─'.repeat(80));

    selectorIssues.forEach(issue => {
      console.log(`  Line ${issue.line}: ${issue.type}`);
      console.log(`    Current: ${issue.property}`);
      console.log(`    💡 ${issue.suggestion}`);
    });
  });

  console.log('\n' + '═'.repeat(80));
  console.log(`\n📊 Summary: ${issues.length} issues found across ${Object.keys(grouped).length} selectors\n`);

  // Recommendations
  console.log('🎯 Recommendations:');
  console.log('  1. Reduce all vertical paddings to 0.125rem (2px) or less');
  console.log('  2. Set min-height to 28px maximum');
  console.log('  3. Remove unnecessary height declarations\n');
}

// Run analysis
analyzeCSS();
