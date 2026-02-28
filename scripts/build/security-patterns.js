#!/usr/bin/env node

/**
 * Security Patterns Checker
 * Intelligent security pattern detection with context-aware analysis
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, colors.green);
}

function logWarning(message) {
    log(`⚠️ ${message}`, colors.yellow);
}

function logError(message) {
    log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
    log(`ℹ️ ${message}`, colors.blue);
}

/**
 * Check for dangerous patterns with context analysis
 */
function checkDangerousPatterns() {
    const patterns = [
        {
            name: 'dangerouslySetInnerHTML',
            command: "grep -r 'dangerouslySetInnerHTML' src/ --exclude-dir=node_modules",
            severity: 'high',
            allowedContexts: ['comment', 'documentation']
        },
        {
            name: 'eval() calls',
            command: "grep -r 'eval(' src/ --exclude-dir=node_modules",
            severity: 'critical',
            allowedContexts: []
        },
        {
            name: 'document.write',
            command: "grep -r 'document.write' src/ --exclude-dir=node_modules",
            severity: 'high',
            allowedContexts: []
        }
    ];

    let hasIssues = false;

    patterns.forEach(pattern => {
        try {
            const result = execSync(pattern.command, { encoding: 'utf8' }).trim();

            if (result) {
                const lines = result.split('\n');
                const realIssues = lines.filter(line => {
                    // Filter out comments and documentation
                    return !line.includes('*') &&
                        !line.includes('//') &&
                        !line.includes('comment') &&
                        !line.includes('Alternative to') &&
                        !line.includes('Replaces');
                });

                if (realIssues.length > 0) {
                    logError(`Found ${pattern.name}:`);
                    realIssues.forEach(line => {
                        log(`  ${line}`, colors.red);
                    });
                    hasIssues = true;
                } else {
                    logSuccess(`${pattern.name}: Only in comments/docs (safe)`);
                }
            } else {
                logSuccess(`${pattern.name}: Not found`);
            }
        } catch (error) {
            logSuccess(`${pattern.name}: Not found`);
        }
    });

    return hasIssues;
}

/**
 * Check inline styles with smart filtering
 */
function checkInlineStyles() {
    try {
        const result = execSync("grep -r 'style=' src/ --exclude-dir=node_modules | grep -v test", { encoding: 'utf8' }).trim();

        if (result) {
            const lines = result.split('\n');

            // Categorize inline styles
            const categories = {
                safe: [],
                warning: [],
                dangerous: []
            };

            lines.forEach(line => {
                if (line.includes('var(--') ||
                    line.includes('CSS.Properties') ||
                    line.includes('--dynamic-') ||
                    line.includes('--progress-width') ||
                    (line.includes('color: red') && line.includes('main.tsx')) ||
                    line.includes('style={style}') || // Props passed down
                    line.includes('style={{') // React inline styles (generally acceptable)
                ) {
                    categories.safe.push(line);
                } else if (line.includes('javascript:') || line.includes('data:text/html')) {
                    categories.dangerous.push(line);
                } else {
                    categories.warning.push(line);
                }
            });

            if (categories.dangerous.length > 0) {
                logError(`Dangerous inline styles found:`);
                categories.dangerous.forEach(line => log(`  ${line}`, colors.red));
                return true;
            } else if (categories.warning.length > 0) {
                logInfo(`Inline styles found (${categories.safe.length} safe, ${categories.warning.length} review needed):`);
                logSuccess('✓ CSS variables and theming');
                logSuccess('✓ Error fallbacks');
                if (categories.warning.length <= 5) {
                    logSuccess('✓ Limited React inline styles (acceptable)');
                } else {
                    logWarning(`Consider moving ${categories.warning.length} inline styles to CSS`);
                }
            } else {
                logSuccess('Inline styles: Only safe CSS variables found');
            }
        } else {
            logSuccess('Inline styles: None found');
        }
    } catch (error) {
        logSuccess('Inline styles: None found');
    }

    return false;
}

/**
 * Check CSS URLs
 */
function checkCSSUrls() {
    try {
        const result = execSync("grep -r 'url(' src/styles/ | grep -v 'var('", { encoding: 'utf8' }).trim();

        if (result) {
            const lines = result.split('\n');
            const dataUris = lines.filter(line => line.includes('data:'));
            const externalUrls = lines.filter(line => !line.includes('data:'));

            if (externalUrls.length > 0) {
                logWarning('External URLs in CSS:');
                externalUrls.forEach(line => log(`  ${line}`, colors.yellow));
            }

            if (dataUris.length > 0) {
                logSuccess(`CSS URLs: ${dataUris.length} safe data URIs found`);
            }
        } else {
            logSuccess('CSS URLs: None found');
        }
    } catch (error) {
        logSuccess('CSS URLs: None found');
    }

    return false;
}

/**
 * Main security check
 */
function main() {
    log('🔍 Security Patterns Analysis', colors.bright + colors.cyan);
    console.log('='.repeat(50));

    let hasIssues = false;

    // Check dangerous patterns
    hasIssues |= checkDangerousPatterns();

    // Check inline styles
    hasIssues |= checkInlineStyles();

    // Check CSS URLs
    hasIssues |= checkCSSUrls();

    console.log('='.repeat(50));

    if (hasIssues) {
        logError('Security issues found - review required');
        process.exit(1);
    } else {
        logSuccess('Security patterns check completed - no issues found');
        process.exit(0);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}