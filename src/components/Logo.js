import React from 'react';

const Logo = ({ size = 'medium', className = '', variant = 'default' }) => {
  // Size variants
  const sizes = {
    small: { width: 120, height: 60 },
    medium: { width: 150, height: 75 },
    large: { width: 200, height: 100 },
    xlarge: { width: 300, height: 150 }
  };

  // Color variants
  const colors = {
    default: { cv: '#1A237E', express: '#D32F2F', accent: '#D32F2F' },
    white: { cv: '#FFFFFF', express: '#FFFFFF', accent: 'rgba(255,255,255,0.9)' },
    dark: { cv: '#1A237E', express: '#D32F2F', accent: '#D32F2F' }
  };

  const { width, height } = sizes[size] || sizes.medium;
  const colorScheme = colors[variant] || colors.default;

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 400 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* CV Text */}
      <text 
        x="200" 
        y="90" 
        textAnchor="middle" 
        style={{ 
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          fontSize: '90px',
          fill: colorScheme.cv
        }}
      >
        CV
      </text>

      {/* Speed lines (left side) */}
      <rect x="55" y="125" width="25" height="6" fill={colorScheme.accent} rx="3" />
      <rect x="40" y="140" width="40" height="6" fill={colorScheme.accent} rx="3" />
      <rect x="60" y="155" width="20" height="6" fill={colorScheme.accent} rx="3" />

      {/* EXPRESS Text */}
      <text 
        x="220" 
        y="155" 
        textAnchor="middle" 
        style={{ 
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          fontStyle: 'italic',
          fontSize: '45px',
          fill: colorScheme.express
        }}
      >
        EXPRESS
      </text>

      {/* Arrow (right side) */}
      <path d="M330 145 L360 135 L345 165 Z" fill={colorScheme.accent} />
      <path 
        d="M320 155 Q340 155 345 145" 
        stroke={colorScheme.accent} 
        strokeWidth="6" 
        fill="none" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default Logo;
