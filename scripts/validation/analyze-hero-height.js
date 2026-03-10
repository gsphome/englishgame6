#!/usr/bin/env node

/**
 * Analyze Hero Card Height Issues
 * Detects CSS properties that increase hero card height unnecessarily
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSS_FILE = path.join(__dirname, '../../src/styles/components/progression-dashboard.css');

// Patterns that increase height
const HEIGHT_ISSUES = {
  padding: /padding:\s*([0-9.]+(?:rem|px|em))/gi,
  paddingVertical: /padding:\s*([0-9.]+(?:rem|px|em))\s+[0-9.]+(?:rem|px|em)/gi,
  paddingTop: /padding-top:\s*([0-9.]+(?:rem|px|em))/gi,
  paddingBottom: /padding-bottom:\s*([0-9.]+(?:rem|px|em))/gi,
  margin: /margin:\s*([0-9.]+(?:rem|px|em))/gi,
  marginVertical: /margin:\s*([0-9.]+(?:rem|px|em))\s+[0-9.]+(?:rem|px|em)/gi,
  marginTop: /margin-top:\s*([0-9.]+(?:rem|px|em))/gi,
  marginBottom: /margin-bottom:\s*([0-9.]+(?:rem|px|em))/gi,
  gap: /gap:\s*([0-9.]+(?:rem|px|em))/gi,
  lineHeight: /line-height:\s*([0-9.]+)/gi,
  minHeight: /min-height:\s*([0-9.]+(?:rem|px|em|vh))/gi,
  height: /height:\s*([0-9.]+(?:rem|px|em|vh))/gi,
};

// Target selectors for hero card
const HERO_SELECTORS = [
  '.progression-dashboard__hero',
  '.progression-dashboard__next-module',
  '.progression-dashboard__next-info',
  '.progression-dashboard__next-name',
  '.progression-dashboard__next-desc',
  '.progression-dashboard__next-meta',
  '.progression-dashboard__level-badge',
  '.progression-dashboard__time',
  '.progression-dashboard__continue-btn',
  '.progression-dashboard__continue-icon',
];

function analyzeCSS() {
  console.log('🔍 Analyzing Hero Card Height Issues...\n');

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

    // Check if current selector is a hero selector
    if (currentSelector && HERO_SELECTORS.some(sel => currentSelector.includes(sel))) {
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
              if (numValue > 0.125) {
                isIssue = true;
                suggestion = `Reduce to 0.0625rem (1px) or 0.03125rem (0.5px)`;
              }
              break;

            case 'margin':
            case 'marginVertical':
            case 'marginTop':
            case 'marginBottom':
              if (numValue > 0.0625) {
                isIssue = true;
                suggestion = `Reduce to 0.03125rem (0.5px) or 0`;
              }
              break;

            case 'gap':
              if (numValue > 0.1875) {
                isIssue = true;
                suggestion = `Reduce to 0.125rem (2px) or less`;
              }
              break;

            case 'lineHeight':
              if (numValue > 1.1) {
                isIssue = true;
                suggestion = `Reduce to 1 or 1.05`;
              }
              break;

            case 'minHeight':
            case 'height':
              if (value.includes('vh') || numValue > 2) {
                isIssue = true;
                suggestion = `Use auto or smaller fixed value`;
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
    console.log('✅ No height issues found in hero card CSS!\n');
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
  console.log('  1. Reduce all paddings to 0.0625rem (1px) or less');
  console.log('  2. Reduce all margins to 0.03125rem (0.5px) or 0');
  console.log('  3. Reduce all gaps to 0.125rem (2px) or less');
  console.log('  4. Set all line-heights to 1 or 1.05');
  console.log('  5. Remove or minimize fixed heights\n');
}

// Run analysis
analyzeCSS();
