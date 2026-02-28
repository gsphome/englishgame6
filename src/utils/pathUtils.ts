/**
 * Utility functions for handling asset paths
 */

/// <reference types="vite/client" />

/**
 * Get the correct asset path based on the environment and base configuration
 * @param assetPath - The asset path relative to data directory
 * @returns The full URL path for the asset
 */
export const getAssetPath = (assetPath: string): string => {
  // Remove leading slash or dot-slash if present
  const cleanPath = assetPath.replace(/^\.?\//, '');

  // Get base path from environment
  const basePath = import.meta.env.BASE_URL || '/';

  // Construct the full path
  let fullPath: string;
  if (cleanPath.startsWith('data/')) {
    // Path already includes data/ prefix, use as is
    fullPath = `${basePath}${cleanPath}`;
  } else {
    // Path doesn't include data/ prefix, add it
    fullPath = `${basePath}data/${cleanPath}`;
  }

  // Ensure we use the correct protocol for localhost
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    const isLocalhost = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1');

    // If we're on localhost and the path is relative, make it absolute with current origin
    if (isLocalhost && fullPath.startsWith('/')) {
      return `${currentOrigin}${fullPath}`;
    }
  }

  return fullPath;
};

/**
 * Get the learning modules JSON path
 * @returns The full URL path for learningModules.json
 */
export const getLearningModulesPath = (): string => {
  return getAssetPath('learningModules.json');
};
