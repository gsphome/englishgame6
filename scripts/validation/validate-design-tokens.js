#!/usr/bin/env node

/**
 * Design Token Validation Script
 * Validates CSS custom properties and design token usage across the codebase
 * Part of CSS Architecture Refactor - Task 8.1.1
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Expected design tokens from color-palette.css
const EXPECTED_DESIGN_TOKENS = [
  // Semantic tokens
  '--text-primary',
  '--text-secondary', 
  '--text-tertiary',
  '--text-on-colored',
  
  // Contextual tokens
  '--bg-elevated',
  '--bg-subtle',
  '--bg-soft',
  
  // Border system
  '--border-subtle',
  '--border-soft',
  '--border-medium',
  
  // Interactive tokens
  '--primary-blue',
  '--primary-purple',
  '--progress-complete',
  '--error',
  
  // Theme context variables
  '--theme-text-primary',
  '--theme-text-secondary',
  '--theme-bg-primary',
  '--theme-bg-secondary',
  '--theme-border-primary',
  '--theme-border-secondary'
];

// Theme context selectors
const THEME_CONTEXTS = [
  'html.light',
  'html.dark',
  ':root'
];

/**
 * Extracts CSS custom properties from file content
 */
function extractCustomProperties(content) {
  const customPropRegex = /--([\w-]+):\s*([^;]+);/g;
  const properties = [];
  let match;
  
  while ((match = customPropRegex.exec(content)) !== null) {
    properties.push({
      name: `--${match[1]}`,
      value: match[2].trim(),
      line: content.substring(0, match.index).split('\n').length
    });
  }
  
  return properties;
}

/**
 * Extracts CSS custom property usage (var() functions)
 */
function extractCustomPropertyUsage(content) {
  const varUsageRegex = /var\((--[\w-]+)(?:,\s*([^)]+))?\)/g;
  const usage = [];
  let match;
  
  while ((match = varUsageRegex.exec(content)) !== null) {
    usage.push({
      property: match[1],
      fallback: match[2] || null,
      line: content.substring(0, match.index).split('\n').length
    });
  }
  
  return usage;
}

/**
 * Validates theme context mapping
 */
function validateThemeContexts(content) {
  const contexts = [];
  
  THEME_CONTEXTS.forEach(context => {
    const contextRegex = new RegExp(`${context.replace('.', '\\.')}\\s*\\{([^}]+)\\}`, 'g');
    let match;
    
    while ((match = contextRegex.exec(content)) !== null) {
      const properties = extractCustomProperties(match[1]);
      contexts.push({
        selector: context,
        properties: properties.map(p => p.name),
        line: content.substring(0, match.index).split('\n').length
      });
    }
  });
  
  return contexts;
}

/**
 * Scans CSS files for design token definitions
 */
async function scanCSSFiles() {
  const stylesDir = path.join(process.cwd(), 'src/styles');
  const results = {
    files: {},
    allTokens: new Set(),
    themeContexts: {},
    issues: []
  };
  
  async function scanDirectory(dir, relativePath = '') {
    try {
      const entries = await fs.readdir(dir);
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const relativeFilePath = path.join(relativePath, entry);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory()) {
          await scanDirectory(fullPath, relativeFilePath);
        } else if (entry.endsWith('.css')) {
          const content = await fs.readFile(fullPath, 'utf-8');
          const properties = extractCustomProperties(content);
          const usage = extractCustomPropertyUsage(content);
          const contexts = validateThemeContexts(content);
          
          results.files[relativeFilePath] = {
            path: fullPath,
            properties,
            usage,
            contexts
          };
          
          // Collect all tokens
          properties.forEach(prop => results.allTokens.add(prop.name));
          
          // Collect theme contexts
          contexts.forEach(context => {
            if (!results.themeContexts[context.selector]) {
              results.themeContexts[context.selector] = [];
            }
            results.themeContexts[context.selector].push(...context.properties);
          });
        }
      }
    } catch (error) {
      results.issues.push(`Error scanning directory ${dir}: ${error.message}`);
    }
  }
  
  await scanDirectory(stylesDir);
  return results;
}

/**
 * Validates design token completeness
 */
function validateTokenCompleteness(scanResults) {
  const validation = {
    missing: [],
    defined: [],
    extra: [],
    themeMapping: {
      complete: true,
      missing: []
    }
  };
  
  const definedTokens = Array.from(scanResults.allTokens);
  
  // Check for missing expected tokens
  EXPECTED_DESIGN_TOKENS.forEach(token => {
    if (definedTokens.includes(token)) {
      validation.defined.push(token);
    } else {
      validation.missing.push(token);
    }
  });
  
  // Check for extra tokens (not necessarily bad)
  definedTokens.forEach(token => {
    if (!EXPECTED_DESIGN_TOKENS.includes(token)) {
      validation.extra.push(token);
    }
  });
  
  // Validate theme context mapping
  const themeTokens = [
    '--theme-text-primary',
    '--theme-text-secondary',
    '--theme-bg-primary',
    '--theme-border-primary'
  ];
  
  THEME_CONTEXTS.forEach(context => {
    if (context === ':root') return; // Skip root context
    
    const contextTokens = scanResults.themeContexts[context] || [];
    themeTokens.forEach(token => {
      if (!contextTokens.includes(token)) {
        validation.themeMapping.missing.push(`${context}: ${token}`);
        validation.themeMapping.complete = false;
      }
    });
  });
  
  return validation;
}

/**
 * Validates CSS custom property usage patterns
 */
function validateUsagePatterns(scanResults) {
  const validation = {
    issues: [],
    warnings: [],
    goodPractices: []
  };
  
  Object.entries(scanResults.files).forEach(([filePath, fileData]) => {
    fileData.usage.forEach(usage => {
      // Check for undefined tokens
      if (!scanResults.allTokens.has(usage.property)) {
        validation.issues.push({
          file: filePath,
          line: usage.line,
          issue: `Undefined design token: ${usage.property}`,
          type: 'undefined-token'
        });
      }
      
      // Check for missing fallbacks on theme tokens
      if (usage.property.startsWith('--theme-') && !usage.fallback) {
        validation.warnings.push({
          file: filePath,
          line: usage.line,
          warning: `Theme token without fallback: ${usage.property}`,
          type: 'missing-fallback'
        });
      }
      
      // Good practice: using design tokens
      if (EXPECTED_DESIGN_TOKENS.includes(usage.property)) {
        validation.goodPractices.push({
          file: filePath,
          line: usage.line,
          practice: `Using design token: ${usage.property}`,
          type: 'design-token-usage'
        });
      }
    });
  });
  
  return validation;
}

/**
 * Displays validation results
 */
function displayValidationResults(scanResults, completeness, usageValidation) {
  console.log('🎨 Design Token Validation Report');
  console.log('=================================');
  
  // Summary
  const totalTokens = scanResults.allTokens.size;
  const expectedTokens = EXPECTED_DESIGN_TOKENS.length;
  const completenessPercentage = Math.round((completeness.defined.length / expectedTokens) * 100);
  
  console.log(`\n📊 Summary:`);
  console.log(`  Total tokens defined: ${totalTokens}`);
  console.log(`  Expected tokens: ${expectedTokens}`);
  console.log(`  Completeness: ${completenessPercentage}% (${completeness.defined.length}/${expectedTokens})`);
  console.log(`  Theme mapping: ${completeness.themeMapping.complete ? '✅ Complete' : '❌ Incomplete'}`);
  
  // Missing tokens
  if (completeness.missing.length > 0) {
    console.log(`\n❌ Missing Design Tokens:`);
    completeness.missing.forEach(token => {
      console.log(`  - ${token}`);
    });
  }
  
  // Theme mapping issues
  if (!completeness.themeMapping.complete) {
    console.log(`\n⚠️ Theme Mapping Issues:`);
    completeness.themeMapping.missing.forEach(issue => {
      console.log(`  - ${issue}`);
    });
  }
  
  // Usage validation issues
  if (usageValidation.issues.length > 0) {
    console.log(`\n❌ Usage Issues:`);
    usageValidation.issues.forEach(issue => {
      console.log(`  - ${issue.file}:${issue.line} - ${issue.issue}`);
    });
  }
  
  // Usage warnings
  if (usageValidation.warnings.length > 0) {
    console.log(`\n⚠️ Usage Warnings:`);
    usageValidation.warnings.forEach(warning => {
      console.log(`  - ${warning.file}:${warning.line} - ${warning.warning}`);
    });
  }
  
  // File breakdown
  console.log(`\n📁 File Breakdown:`);
  Object.entries(scanResults.files).forEach(([filePath, fileData]) => {
    const tokenCount = fileData.properties.length;
    const usageCount = fileData.usage.length;
    
    if (tokenCount > 0 || usageCount > 0) {
      console.log(`  📄 ${filePath}:`);
      if (tokenCount > 0) {
        console.log(`     Defines: ${tokenCount} tokens`);
      }
      if (usageCount > 0) {
        console.log(`     Uses: ${usageCount} token references`);
      }
    }
  });
  
  // Extra tokens (informational)
  if (completeness.extra.length > 0) {
    console.log(`\n💡 Additional Tokens Found:`);
    completeness.extra.forEach(token => {
      console.log(`  - ${token}`);
    });
  }
  
  // Good practices count
  if (usageValidation.goodPractices.length > 0) {
    console.log(`\n✅ Good Practices: ${usageValidation.goodPractices.length} design token usages found`);
  }
}

/**
 * Main validation function
 */
async function validateDesignTokens() {
  console.log('🔍 Scanning CSS files for design tokens...');
  
  const scanResults = await scanCSSFiles();
  
  if (scanResults.issues.length > 0) {
    console.log('\n⚠️ Scan Issues:');
    scanResults.issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  const completeness = validateTokenCompleteness(scanResults);
  const usageValidation = validateUsagePatterns(scanResults);
  
  displayValidationResults(scanResults, completeness, usageValidation);
  
  // Determine exit code
  const hasErrors = completeness.missing.length > 0 || 
                   !completeness.themeMapping.complete || 
                   usageValidation.issues.length > 0;
  
  if (hasErrors) {
    console.log('\n❌ Design token validation FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ Design token validation PASSED');
    process.exit(0);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateDesignTokens().catch(console.error);
}

export { validateDesignTokens, extractCustomProperties, validateTokenCompleteness };