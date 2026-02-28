import React from 'react';
import '../../styles/components/fluent-flow-logo.css';

interface FluentFlowLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FluentFlowLogo: React.FC<FluentFlowLogoProps> = ({ size = 'md', className = '' }) => {
  const textSizes = {
    sm: '12',
    md: '16',
    lg: '24',
  };

  // Generate unique gradient ID to avoid conflicts
  const gradientId = `logoGradient-${Math.random().toString(36).substr(2, 9)}`;
  const logoClass = `fluent-flow-logo fluent-flow-logo--${size} ${className}`;

  return (
    <svg className={logoClass} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="fluent-flow-logo__gradient-start" />
          <stop offset="100%" className="fluent-flow-logo__gradient-end" />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle
        cx="16"
        cy="16"
        r="14"
        fill={`url(#${gradientId})`}
        className="fluent-flow-logo__background"
      />

      {/* Flow lines */}
      <path
        d="M6 12 Q16 8 26 12"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M6 16 Q16 12 26 16"
        stroke="white"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M6 20 Q16 16 26 20"
        stroke="white"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Letter F */}
      <text
        x="16"
        y="24"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize={textSizes[size]}
        fontWeight="700"
        textAnchor="middle"
        fill="white"
        className="fluent-flow-logo__text"
      >
        F
      </text>
    </svg>
  );
};
