import React from 'react';
import '../../styles/components/error-fallback.css';

interface ErrorFallbackProps {
  error: Error | null;
  retry: () => void;
}

export const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry }) => (
  <div className="error-fallback">
    <div className="error-fallback__card">
      <div className="error-fallback__icon">⚠️</div>
      <h2 className="error-fallback__title">Something went wrong</h2>
      <p className="error-fallback__message">
        We're sorry, but something unexpected happened. Please try again.
      </p>
      {import.meta.env.DEV && error && (
        <details className="error-fallback__details">
          <summary className="error-fallback__details-summary">Error Details</summary>
          <pre className="error-fallback__details-content">
            {error.message}
            {error.stack}
          </pre>
        </details>
      )}
      <div className="error-fallback__actions">
        <button onClick={retry} className="error-fallback__button error-fallback__button--primary">
          Try Again
        </button>
        <button
          onClick={() => (window.location.href = './')}
          className="error-fallback__button error-fallback__button--secondary"
        >
          Go to Home
        </button>
      </div>
    </div>
  </div>
);
