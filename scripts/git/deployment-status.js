#!/usr/bin/env node

/**
 * Deployment Status Helper
 * 
 * Provides clear, contextual information about deployment status
 * Especially useful during build processes to explain commit differences
 */

import { execSync } from 'child_process';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logInfo(message) {
  log(`ℹ️ ${message}`, colors.blue);
}

function logWarning(message) {
  log(`⚠️ ${message}`, colors.yellow);
}

// Repository configuration
const REPO_OWNER = 'gsphome';
const REPO_NAME = 'englishgame6';

/**
 * Get current commit hash
 */
function getCurrentCommit() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return null;
  }
}

/**
 * Check if there are unpushed commits
 */
function hasUnpushedCommits() {
  try {
    const result = execSync('git log @{u}..HEAD --oneline', { encoding: 'utf8' }).trim();
    return result.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Get the latest pushed commit
 */
function getLatestPushedCommit() {
  try {
    return execSync('git rev-parse @{u}', { encoding: 'utf8' }).trim();
  } catch (error) {
    return null;
  }
}

/**
 * Fetch latest deployment SHA
 */
async function getLatestDeploymentSha() {
  try {
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/deployments?environment=production&per_page=1`;
    const curlCommand = `curl -s -H "Accept: application/vnd.github.v3+json" "${apiUrl}"`;
    
    const response = execSync(curlCommand, { encoding: 'utf8' });
    const deployments = JSON.parse(response);
    
    if (Array.isArray(deployments) && deployments.length > 0) {
      return deployments[0].sha;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Check for active GitHub Actions workflows
 */
async function hasActiveWorkflows() {
  try {
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs?status=in_progress&per_page=1`;
    const curlCommand = `curl -s -H "Accept: application/vnd.github.v3+json" "${apiUrl}"`;
    
    const response = execSync(curlCommand, { encoding: 'utf8' });
    const data = JSON.parse(response);
    
    return data.workflow_runs && data.workflow_runs.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Provide contextual deployment status explanation
 */
async function explainDeploymentStatus() {
  const currentCommit = getCurrentCommit();
  const latestPushedCommit = getLatestPushedCommit();
  const deployedSha = await getLatestDeploymentSha();
  const hasUnpushed = hasUnpushedCommits();
  const hasActiveActions = await hasActiveWorkflows();

  console.log('\n' + '='.repeat(60));
  log('📊 DEPLOYMENT STATUS EXPLANATION', colors.bright + colors.cyan);
  console.log('='.repeat(60));

  if (!currentCommit) {
    logWarning('Could not determine current commit');
    return;
  }

  logInfo(`Current local commit: ${currentCommit.substring(0, 8)}`);
  
  if (latestPushedCommit) {
    logInfo(`Latest pushed commit: ${latestPushedCommit.substring(0, 8)}`);
  }
  
  if (deployedSha) {
    logInfo(`Currently deployed: ${deployedSha.substring(0, 8)}`);
  }

  console.log('\n🔍 Status Analysis:');

  // Case 1: Local changes not pushed
  if (hasUnpushed) {
    logWarning('You have local commits that are not pushed to GitHub');
    logInfo('💡 Run "git push" to trigger deployment of your changes');
    return;
  }

  // Case 2: Pushed but not deployed yet
  if (deployedSha && !currentCommit.startsWith(deployedSha) && !deployedSha.startsWith(currentCommit)) {
    if (hasActiveActions) {
      logInfo('🚀 Your changes are being deployed by GitHub Actions');
      logInfo('💡 This is normal - deployment takes a few minutes');
      logInfo('⏳ The site will update automatically when deployment completes');
    } else {
      logWarning('Your latest changes are not yet deployed');
      logInfo('💡 Check GitHub Actions to see if deployment is queued or failed');
    }
    return;
  }

  // Case 3: Everything is in sync
  if (deployedSha && (currentCommit.startsWith(deployedSha) || deployedSha.startsWith(currentCommit))) {
    logSuccess('Your latest changes are deployed and live!');
    logInfo('🌐 Site is up-to-date with your local changes');
    return;
  }

  // Case 4: Cannot determine deployment status
  if (!deployedSha) {
    if (hasActiveActions) {
      logInfo('🔄 GitHub Actions is running - deployment may be in progress');
    } else {
      logWarning('Could not determine deployment status');
      logInfo('💡 Check GitHub Pages settings and Actions tab');
    }
    return;
  }

  // Default case
  logInfo('Deployment status is unclear - check GitHub Actions and Pages settings');
}

/**
 * Quick status check for build scripts
 */
async function quickStatus() {
  const currentCommit = getCurrentCommit();
  const deployedSha = await getLatestDeploymentSha();
  const hasActiveActions = await hasActiveWorkflows();

  if (!currentCommit || !deployedSha) {
    return 'UNKNOWN';
  }

  if (currentCommit.startsWith(deployedSha) || deployedSha.startsWith(currentCommit)) {
    return 'SYNCED';
  }

  if (hasActiveActions) {
    return 'DEPLOYING';
  }

  return 'PENDING';
}

// Handle command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'quick') {
    quickStatus().then(status => {
      console.log(status);
      process.exit(0);
    });
  } else {
    explainDeploymentStatus().then(() => {
      process.exit(0);
    }).catch(error => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
  }
}

export { explainDeploymentStatus, quickStatus };