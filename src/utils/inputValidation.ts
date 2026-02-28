/**
 * Input validation and sanitization utilities
 * Provides comprehensive validation for user inputs
 */

import { z } from 'zod';

// Validation schemas
export const gameSettingsSchema = z.object({
  flashcardMode: z.object({
    wordCount: z.number().int().min(1).max(50),
  }),
  quizMode: z.object({
    questionCount: z.number().int().min(1).max(50),
  }),
  completionMode: z.object({
    itemCount: z.number().int().min(1).max(50),
  }),
  sortingMode: z.object({
    wordCount: z.number().int().min(1).max(50),
    categoryCount: z.number().int().min(2).max(10),
  }),
  matchingMode: z.object({
    wordCount: z.number().int().min(2).max(50),
  }),
});

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z\s\u00C0-\u017F]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email().optional().or(z.literal('')),
  level: z.enum(['a1', 'a2', 'b1', 'b2', 'c1', 'c2']),
  nativeLanguage: z.enum(['en', 'es']),
});

export const searchQuerySchema = z
  .string()
  .min(0)
  .max(100)
  .regex(
    /^[a-zA-Z0-9\s\-_]*$/,
    'Search can only contain letters, numbers, spaces, hyphens, and underscores'
  );

/**
 * Sanitize string input by removing dangerous characters
 * @param input - Raw string input
 * @param maxLength - Maximum allowed length
 * @returns Sanitized string
 */
export const sanitizeString = (input: string, maxLength: number = 100): string => {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove null bytes and control characters
  // eslint-disable-next-line no-control-regex
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length
  sanitized = sanitized.substring(0, maxLength);

  return sanitized;
};

/**
 * Validate and sanitize numeric input
 * @param input - Raw input value
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param defaultValue - Default value if validation fails
 * @returns Validated number
 */
export const validateNumber = (
  input: any,
  min: number = 1,
  max: number = 50,
  defaultValue: number = min
): number => {
  // Convert to number
  const num = typeof input === 'string' ? parseInt(input, 10) : Number(input);

  // Check if it's a valid number
  if (isNaN(num) || !isFinite(num)) {
    return defaultValue;
  }

  // Clamp to valid range
  return Math.max(min, Math.min(max, Math.floor(num)));
};

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate and sanitize search query
 * @param query - Search query string
 * @returns Sanitized search query
 */
export const validateSearchQuery = (query: string): string => {
  try {
    return searchQuerySchema.parse(sanitizeString(query, 100));
  } catch {
    return '';
  }
};

/**
 * Validate game settings object
 * @param settings - Game settings to validate
 * @returns Validated and sanitized settings
 */
export const validateGameSettings = (settings: any): any => {
  try {
    return gameSettingsSchema.parse(settings);
  } catch {
    // Use console.warn for validation errors as they're important for debugging

    // Return safe defaults
    return {
      flashcardMode: { wordCount: 10 },
      quizMode: { questionCount: 10 },
      completionMode: { itemCount: 10 },
      sortingMode: { wordCount: 5, categoryCount: 3 },
      matchingMode: { wordCount: 6 },
    };
  }
};

/**
 * Validate user profile data
 * @param profile - User profile to validate
 * @returns Validated profile or null if invalid
 */
export const validateUserProfile = (profile: any): any | null => {
  try {
    return userProfileSchema.parse({
      name: sanitizeString(profile.name || '', 50),
      email: profile.email ? sanitizeString(profile.email, 254) : '',
      level: profile.level || 'b1',
      nativeLanguage: profile.nativeLanguage || 'en',
    });
  } catch {
    // Use console.warn for validation errors as they're important for debugging
    return null;
  }
};

/**
 * Sanitize object by recursively cleaning all string properties
 * @param obj - Object to sanitize
 * @param maxDepth - Maximum recursion depth
 * @returns Sanitized object
 */
export const sanitizeObject = (obj: any, maxDepth: number = 3): any => {
  if (maxDepth <= 0 || obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (typeof obj === 'number') {
    return isFinite(obj) ? obj : 0;
  }

  if (typeof obj === 'boolean') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, maxDepth - 1));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeString(key, 50);
      if (sanitizedKey) {
        sanitized[sanitizedKey] = sanitizeObject(value, maxDepth - 1);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Rate limiting for user actions
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 10, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if action is allowed for given key
   * @param key - Unique identifier for the action
   * @returns True if action is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Record this attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);

    return true;
  }

  /**
   * Clear attempts for a key
   * @param key - Key to clear
   */
  clear(key: string): void {
    this.attempts.delete(key);
  }
}

// Global rate limiter instance - lazy initialization to avoid module loading issues
let _globalRateLimiter: RateLimiter | null = null;
export const globalRateLimiter = {
  isAllowed: (key: string) => {
    if (!_globalRateLimiter) {
      _globalRateLimiter = new RateLimiter(50, 60000);
    }
    return _globalRateLimiter.isAllowed(key);
  },
  clear: (key: string) => {
    if (!_globalRateLimiter) {
      _globalRateLimiter = new RateLimiter(50, 60000);
    }
    _globalRateLimiter.clear(key);
  },
};
