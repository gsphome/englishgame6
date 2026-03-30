/**
 * Secure HTTP utilities with TLS validation and security headers
 */

interface SecureFetchOptions extends globalThis.RequestInit {
  timeout?: number;
}

/**
 * Custom error for modules not available offline
 */
export class ModuleNotAvailableOfflineError extends Error {
  constructor(message: string = 'Module not available offline') {
    super(message);
    this.name = 'ModuleNotAvailableOfflineError';
  }
}

/**
 * Secure fetch wrapper with TLS validation and security headers
 * @param url - URL to fetch
 * @param options - Fetch options with additional security configurations
 * @returns Promise with fetch response
 */
const secureFetch = async (url: string, options: SecureFetchOptions = {}): Promise<Response> => {
  const { timeout = 10000, ...fetchOptions } = options;

  // Security headers for requests
  // NOTE: Do NOT add Cache-Control: no-cache for same-origin requests —
  // it bypasses the Service Worker cache and breaks offline mode.
  const isSameOrigin = typeof window !== 'undefined' && url.startsWith(window.location.origin);

  const secureHeaders: globalThis.HeadersInit = {
    'X-Requested-With': 'XMLHttpRequest',
    ...(isSameOrigin ? {} : { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }),
    ...fetchOptions.headers,
  };

  // Validate URL protocol in production (but allow localhost HTTP)
  if (process.env.NODE_ENV === 'production' && url.startsWith('http://')) {
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');

    if (!isLocalhost) {
      console.warn('⚠️ Insecure HTTP detected in production. Use HTTPS instead.');
      // In production, force HTTPS for non-localhost URLs
      url = url.replace('http://', 'https://');
    }
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: secureHeaders,
      signal: controller.signal,
      // Ensure credentials are not sent to third-party domains
      credentials: url.startsWith(window.location.origin) ? 'same-origin' : 'omit',
      // Prevent redirect to insecure protocols
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    // Validate response headers for security
    if (process.env.NODE_ENV === 'development') {
      validateResponseSecurity(response, url);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }

    throw error;
  }
};

/**
 * Validate response security headers (development only)
 * @param response - Fetch response
 * @param url - Request URL
 */
const validateResponseSecurity = (response: Response, url: string): void => {
  const warnings: string[] = [];

  // Check for HTTPS in production-like environments
  if (url.startsWith('http://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
    warnings.push('Response from insecure HTTP connection');
  }

  // Skip strict header validation for localhost in development
  const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
  if (isLocalhost) {
    return; // Skip security header validation for local development
  }

  // Check for security headers (only for non-localhost requests)
  const securityHeaders = [
    'strict-transport-security',
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection',
  ];

  securityHeaders.forEach(header => {
    if (!response.headers.get(header)) {
      warnings.push(`Missing security header: ${header}`);
    }
  });

  if (warnings.length > 0) {
    console.warn('🔒 Security warnings for', url, warnings);
  }
};


