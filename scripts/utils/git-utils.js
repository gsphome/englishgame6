/**
 * Git Utilities - Shared git operations across all scripts
 */

import { execSync } from 'child_process';
import { logError, logInfo, logSuccess, logDebug } from './logger.js';

// Get the root directory (parent of scripts directory)
const rootDir = process.cwd();

/**
 * Check if current directory is a git repository
 */
export function isGitRepository() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe', cwd: rootDir });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get git status (all files)
 */
export function getGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8', cwd: rootDir });
    return status.trim().split('\n').filter(line => line.trim());
  } catch (error) {
    logError('Failed to get git status');
    return [];
  }
}

/**
 * Get staged files diff
 */
export function getGitDiff() {
  try {
    const diff = execSync('git diff --cached --name-status', { encoding: 'utf8', cwd: rootDir });
    return diff.trim().split('\n').filter(line => line.trim());
  } catch (error) {
    logDebug('No staged changes found');
    return [];
  }
}

/**
 * Get diff statistics
 */
export function getGitDiffStats() {
  try {
    const stats = execSync('git diff --cached --stat', { encoding: 'utf8', cwd: rootDir });
    return stats.trim();
  } catch (error) {
    return '';
  }
}

/**
 * Get full diff content
 */
export function getGitDiffContent() {
  try {
    const diff = execSync('git diff --cached', { encoding: 'utf8', cwd: rootDir });
    return diff;
  } catch (error) {
    return '';
  }
}

/**
 * Stage all changes
 */
export function stageAllChanges() {
  try {
    logInfo('Staging all changes...');
    execSync('git add .', { cwd: rootDir });
    logSuccess('All changes staged successfully!');
    return true;
  } catch (error) {
    logError('Failed to stage changes');
    return false;
  }
}

/**
 * Check if there are staged changes
 */
export function hasStagedChanges() {
  try {
    execSync('git diff --cached --quiet', { cwd: rootDir });
    return false; // No staged changes
  } catch (error) {
    return true; // Has staged changes
  }
}

/**
 * Check if there are unstaged changes
 */
export function hasUnstagedChanges() {
  try {
    execSync('git diff --quiet', { cwd: rootDir });
    return false; // No unstaged changes
  } catch (error) {
    return true; // Has unstaged changes
  }
}

/**
 * Get current branch name
 */
export function getCurrentBranch() {
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8', cwd: rootDir });
    return branch.trim();
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Get current commit hash (short)
 */
export function getCurrentCommitHash() {
  try {
    const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8', cwd: rootDir });
    return hash.trim();
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Get current commit hash (full)
 */
export function getLatestCommit() {
  try {
    const hash = execSync('git rev-parse HEAD', { encoding: 'utf8', cwd: rootDir });
    return hash.trim();
  } catch (error) {
    logError('Failed to get latest commit hash');
    return 'unknown';
  }
}

/**
 * Get remote URL
 */
export function getRemoteUrl() {
  try {
    const url = execSync('git remote get-url origin', { encoding: 'utf8', cwd: rootDir });
    return url.trim();
  } catch (error) {
    logError('Failed to get remote URL');
    return 'unknown';
  }
}

/**
 * Commit with message
 */
export function commitChanges(message, body = '') {
  try {
    let commitCommand = `git commit -m "${message}"`;
    if (body && body.trim()) {
      commitCommand = `git commit -m "${message}" -m "${body}"`;
    }
    
    execSync(commitCommand, { stdio: 'inherit', cwd: rootDir });
    return true;
  } catch (error) {
    logError('Failed to commit changes');
    return false;
  }
}

/**
 * Push to remote
 */
export function pushToRemote() {
  try {
    logInfo('Pushing to remote...');
    execSync('git push', { stdio: 'inherit', cwd: rootDir });
    logSuccess('Changes pushed to remote');
    return true;
  } catch (error) {
    logError('Failed to push to remote');
    return false;
  }
}

/**
 * Auto-stage changes if needed
 */
export function autoStageIfNeeded() {
  if (!hasStagedChanges()) {
    if (hasUnstagedChanges()) {
      logInfo('No staged changes found. Auto-staging all changes...');
      return stageAllChanges();
    } else {
      logInfo('No changes found in working directory.');
      return false;
    }
  }
  return true; // Already has staged changes
}

/**
 * Get git status with categorization
 */
export function getCategorizedGitStatus() {
  const statusLines = getGitStatus();
  const categorized = {
    added: [],
    modified: [],
    deleted: [],
    renamed: [],
    untracked: []
  };

  statusLines.forEach(line => {
    const status = line.substring(0, 2);
    const file = line.substring(3);
    
    if (status.includes('A')) categorized.added.push(file);
    if (status.includes('M')) categorized.modified.push(file);
    if (status.includes('D')) categorized.deleted.push(file);
    if (status.includes('R')) categorized.renamed.push(file);
    if (status.includes('??')) categorized.untracked.push(file);
  });

  return categorized;
}

/**
 * Validate git repository and provide helpful error messages
 */
export function validateGitRepository() {
  if (!isGitRepository()) {
    logError('Not a git repository');
    logInfo('Initialize git with: git init');
    return false;
  }
  return true;
}