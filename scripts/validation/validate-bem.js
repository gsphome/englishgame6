#!/usr/bin/env node

/**
 * BEM Compliance Validation Script
 * Scans all TSX files for BEM naming compliance and Tailwind class detection
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// BEM validation patterns
const BEM_PATTERN = /^[a-z-]+(__[a-z-]+)?(--[a-z-]+)?$/;

// Tailwind patterns to detect
const TAILWIND_PATTERNS = [
  /\b(text-gray-|bg-gray-|border-gray-)/,  // Gray color utilities
  /\b(hover:|focus:|active:|dark:)/,       // State prefixes
  /\b(w-\d+|h-\d+|p-\d+|m-\d+)\b/,       // Sizing utilities
  /\b(flex|grid|block|inline)\b/,          // Display utilities (common ones)
  /\b(rounded|shadow|border)\b/,           // Common utilities
];

// Utility classes that are allowed (not Tailwind)
const ALLOWED_UTILITY_CLASSES = [
  'sr-only',
  'visually-hidden',
  'screen-reader-text',
];

/**
 * Validates BEM naming convention
 */
function validateBEMNaming(className) {
  if (!className || typeof className !== 'string') return true;
  
  const classes = className.split(' ').filter(cls => cls.length > 0);
  
  return classes.every(cls => {
    // Allow utility classes
    if (ALLOWED_UTILITY_CLASSES.includes(cls)) return true;
    
    // Allow data attributes
    if (cls.startsWith('data-')) return true;
    
    return BEM_PATTERN.test(cls);
  });
}

/**
 * Detects Tailwind classes
 */
function detectTailwindClasses(className) {
  if (!className || typeof className !== 'string') return [];
  
  const classes = className.split(' ').filter(cls => cls.length > 0);
  const tailwindClasses = [];
  
  classes.forEach(cls => {
    if (TAILWIND_PATTERNS.some(pattern => pattern.test(cls))) {
      tailwindClasses.push(cls);
    }
  });
  
  return tailwindClasses;
}

/**
 * Extracts className attributes from TSX content
 */
function extractClassNames(content) {
  const classNameRegex = /className=["']([^"']+)["']/g;
  const classNames = [];
  let match;
  
  while ((match = classNameRegex.exec(content)) !== null) {
    classNames.push({
      className: match[1],
      line: content.substring(0, match.index).split('\n').length,
    });
  }
  
  return classNames;
}

/**
 * Scans a single file for BEM compliance
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const classNames = extractClassNames(content);
  const violations = [];
  
  classNames.forEach(({ className, line }) => {
    // Check BEM compliance
    if (!validateBEMNaming(className)) {
      violations.push({
        type: 'BEM_VIOLATION',
        line,
        className,
        message: `Invalid BEM naming: "${className}"`,
      });
    }
    
    // Check for Tailwind classes
    const tailwindClasses = detectTailwindClasses(className);
    if (tailwindClasses.length > 0) {
      violations.push({
        type: 'TAILWIND_DETECTED',
        line,
        className,
        tailwindClasses,
        message: `Tailwind classes detected: ${tailwindClasses.join(', ')}`,
      });
    }
  });
  
  return violations;
}

/**
 * Recursively finds all TSX files
 */
function findTSXFiles(dir, files = []) {
  const entries = fs.readdirSync(dir);
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (!['node_modules', '.git', 'dist', 'build', 'coverage'].includes(entry)) {
        findTSXFiles(fullPath, files);
      }
    } else if (entry.endsWith('.tsx')) {
      files.push(fullPath);
    }
  });
  
  return files;
}

/**
 * Main validation function
 */
function validateBEMCompliance() {
  const projectRoot = path.resolve(__dirname, '../..');
  const srcDir = path.join(projectRoot, 'src');
  
  console.log('🔍 Scanning TSX files for BEM compliance...\n');
  
  const tsxFiles = findTSXFiles(srcDir);
  let totalViolations = 0;
  let filesWithViolations = 0;
  
  const results = {
    totalFiles: tsxFiles.length,
    filesScanned: 0,
    violations: {},
    summary: {
      bemViolations: 0,
      tailwindDetected: 0,
      cleanFiles: 0,
    }
  };
  
  tsxFiles.forEach(filePath => {
    const relativePath = path.relative(projectRoot, filePath);
    const violations = scanFile(filePath);
    
    results.filesScanned++;
    
    if (violations.length > 0) {
      results.violations[relativePath] = violations;
      filesWithViolations++;
      totalViolations += violations.length;
      
      violations.forEach(violation => {
        if (violation.type === 'BEM_VIOLATION') {
          results.summary.bemViolations++;
        } else if (violation.type === 'TAILWIND_DETECTED') {
          results.summary.tailwindDetected++;
        }
      });
    } else {
      results.summary.cleanFiles++;
    }
  });
  
  // Report results
  console.log(`📊 BEM Compliance Report`);
  console.log(`========================`);
  console.log(`Total files scanned: ${results.filesScanned}`);
  console.log(`Clean files: ${results.summary.cleanFiles}`);
  console.log(`Files with violations: ${filesWithViolations}`);
  console.log(`Total violations: ${totalViolations}`);
  console.log(`  - BEM violations: ${results.summary.bemViolations}`);
  console.log(`  - Tailwind classes detected: ${results.summary.tailwindDetected}`);
  console.log('');
  
  // Report violations by file
  if (Object.keys(results.violations).length > 0) {
    console.log('❌ Files with violations:');
    console.log('========================');
    
    Object.entries(results.violations).forEach(([filePath, violations]) => {
      console.log(`\n📄 ${filePath}`);
      violations.forEach(violation => {
        const icon = violation.type === 'BEM_VIOLATION' ? '🔸' : '🔹';
        console.log(`  ${icon} Line ${violation.line}: ${violation.message}`);
        if (violation.tailwindClasses) {
          console.log(`     Classes: ${violation.tailwindClasses.join(', ')}`);
        }
      });
    });
  } else {
    console.log('✅ All files are BEM compliant!');
  }
  
  // Exit with error code if violations found
  if (totalViolations > 0) {
    console.log('\n❌ BEM compliance check failed.');
    process.exit(1);
  } else {
    console.log('\n✅ BEM compliance check passed.');
    process.exit(0);
  }
}

class BEMComplianceValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      filesChecked: 0,
      totalViolations: 0,
      overallCompliance: 0
    };
  }

  validateAllFiles() {
    console.log('🎯 BEM Compliance Validation');
    console.log('Checking all TSX files for BEM naming compliance...\n');

    const srcDir = path.join(process.cwd(), 'src');
    const tsxFiles = this.getAllTSXFiles(srcDir);
    
    let totalViolations = 0;
    let totalClasses = 0;

    this.stats.filesChecked = tsxFiles.length;

    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const violations = this.validateFile(file, content);
      totalViolations += violations.length;
      
      // Count total classes for compliance calculation
      const classMatches = content.match(/className="([^"]+)"/g) || [];
      totalClasses += classMatches.length;
    }

    this.stats.totalViolations = totalViolations;
    this.stats.overallCompliance = totalClasses > 0 ? ((totalClasses - totalViolations) / totalClasses) * 100 : 100;

    if (totalViolations > 0) {
      console.log(`\n❌ BEM compliance check failed with ${totalViolations} violations.`);
      return false;
    } else {
      console.log('\n✅ BEM compliance check passed!');
      return true;
    }
  }

  getAllTSXFiles(dir) {
    let files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.getAllTSXFiles(fullPath));
      } else if (item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  validateFile(filePath, content) {
    // Use the existing scanFile function
    const violations = scanFile(filePath);
    
    // Add to errors and warnings
    violations.forEach(violation => {
      if (violation.type === 'TAILWIND_DETECTED') {
        this.errors.push({ ...violation, file: filePath });
      } else if (violation.type === 'BEM_VIOLATION') {
        this.warnings.push({ ...violation, file: filePath });
      }
    });

    return violations;
  }
}

// Run the validation
if (import.meta.url === `file://${process.argv[1]}`) {
  validateBEMCompliance();
}

export default BEMComplianceValidator;
export { validateBEMNaming, detectTailwindClasses, validateBEMCompliance };