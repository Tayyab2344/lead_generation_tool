import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ size = 32, className, style }: LogoProps) {
  return (
    <div 
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style
      }}
    >
      <svg 
        viewBox="0 0 100 100" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="logoGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.25" />
          </filter>
        </defs>
        
        <rect width="100" height="100" rx="28" fill="url(#logoBgGrad)" />
        
        <g filter="url(#logoGlow)">
          <path 
            d="M 28 32 L 28 64 C 28 68, 30 70, 34 70 L 50 70" 
            fill="none" 
            stroke="#FFFFFF" 
            strokeWidth="9.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M 48 30 L 62 30 C 71 30, 71 47, 62 47 L 48 47 L 48 70" 
            fill="none" 
            stroke="#FFFFFF" 
            strokeWidth="9.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>
      </svg>
    </div>
  );
}
