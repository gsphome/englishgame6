/**
 * Minimal logging utility - no dependencies, no complex initialization
 */

// Simple no-op functions to avoid any initialization issues
export function logDebug(message: string, data?: any, component?: string) {
  // Disabled to prevent initialization issues
  void message;
  void data;
  void component;
}

export function logInfo(message: string, data?: any, component?: string) {
  // Disabled to prevent initialization issues
  void message;
  void data;
  void component;
}

export function logWarn(message: string, data?: any, component?: string) {
  void data;
  void component;
  try {
    console.warn(message);
  } catch {
    // Silent fail
  }
}

export function logError(message: string, data?: any, component?: string) {
  void data;
  void component;
  try {
    console.error(message);
  } catch {
    // Silent fail
  }
}

// Backward compatibility object
export const logger = {
  debug: logDebug,
  info: logInfo,
  warn: logWarn,
  error: logError,
  getLogs: () => [],
  clearLogs: () => {},
};
