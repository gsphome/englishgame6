/**
 * Logger Utility - Consistent logging across all scripts
 */

// Colors for console output
export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Basic logging function
export function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Specialized logging functions
export function logHeader(message) {
  console.log('\n' + '='.repeat(60));
  log(message, colors.bright + colors.cyan);
  console.log('='.repeat(60));
}

export function logCompactHeader(message) {
  log(`\n🔄 ${message}`, colors.bright + colors.cyan);
}

export function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

export function logError(message) {
  log(`❌ ${message}`, colors.red);
}

export function logWarning(message) {
  log(`⚠️ ${message}`, colors.yellow);
}

export function logInfo(message) {
  log(`ℹ️ ${message}`, colors.blue);
}

// Progress logging with timing
export function logProgress(message) {
  log(`🔄 ${message}...`, colors.cyan);
}

// Section dividers
export function logDivider(char = '-', length = 40) {
  console.log(char.repeat(length));
}

// Formatted lists
export function logList(items, color = colors.white, prefix = '•') {
  items.forEach(item => log(`  ${prefix} ${item}`, color));
}

// Status indicators
export function logStatus(label, status, successColor = colors.green, failColor = colors.red) {
  const color = status ? successColor : failColor;
  const icon = status ? '✅' : '❌';
  log(`${icon} ${label}`, color);
}

// Table-like output
export function logTable(data, headers = []) {
  if (headers.length > 0) {
    log(headers.join(' | '), colors.bright);
    log('-'.repeat(headers.join(' | ').length), colors.white);
  }
  
  data.forEach(row => {
    if (Array.isArray(row)) {
      log(row.join(' | '), colors.white);
    } else {
      log(row, colors.white);
    }
  });
}

// Debug logging (only shows if DEBUG environment variable is set)
export function logDebug(message) {
  if (process.env.DEBUG || process.env.DEBUG_SCRIPTS) {
    log(`🐛 DEBUG: ${message}`, colors.magenta);
  }
}