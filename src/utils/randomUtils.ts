/**
 * Robust randomization utilities for learning components
 */

/**
 * Fisher-Yates shuffle algorithm for true randomization
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate random seed based on current time and module ID
 */
export function generateSeed(moduleId: string): number {
  return Date.now() + moduleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

/**
 * Seeded random number generator for consistent randomization per session
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

/**
 * Get random items from array without repetition
 */
export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Conditionally shuffle array based on settings
 * Returns shuffled array if randomization is enabled, original array otherwise
 */
export function conditionalShuffle<T>(array: T[], shouldRandomize: boolean): T[] {
  return shouldRandomize ? shuffleArray(array) : [...array];
}

/**
 * Conditionally randomize using Math.random based on settings
 * Returns randomized comparison function or stable sort
 */
export function conditionalRandomSort(shouldRandomize: boolean): (a: any, b: any) => number {
  return shouldRandomize ? () => Math.random() - 0.5 : () => 0;
}
