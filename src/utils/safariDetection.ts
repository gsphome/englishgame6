/**
 * Safari Mobile Detection Utility
 * Precisely detects Safari Mobile (not Chrome Mobile)
 */

export const detectSafariMobile = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent;

  // Must be Safari
  const isSafari = /Safari/.test(userAgent);

  // Must NOT be Chrome (Chrome includes "Safari" in user agent)
  const isNotChrome = !/Chrome/.test(userAgent) && !/CriOS/.test(userAgent);

  // Must be mobile (iOS)
  const isMobile = /iPhone|iPad|iPod/.test(userAgent);

  // Additional Safari-specific checks
  const hasWebKit = /WebKit/.test(userAgent);
  const hasVersion = /Version\//.test(userAgent);

  return isSafari && isNotChrome && isMobile && hasWebKit && hasVersion;
};

export const applySafariMobileClass = (): void => {
  const isSafariMobile = detectSafariMobile();

  // Debug logging
  console.log('Safari Mobile Detection:', {
    userAgent: navigator.userAgent,
    isSafariMobile,
    classList: document.documentElement.classList.toString(),
  });

  if (isSafariMobile) {
    document.documentElement.classList.add('browser-safari-mobile');
    console.log('✅ Safari Mobile class applied');
  } else {
    console.log('❌ Not Safari Mobile, no class applied');
  }
};

// Auto-apply on module load
if (typeof window !== 'undefined') {
  // Apply immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySafariMobileClass);
  } else {
    applySafariMobileClass();
  }
}
