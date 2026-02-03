
import React from 'react';

interface LogoProps {
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ 
  primaryColor = '#be185d', 
  secondaryColor = '#1e1b4b', 
  className = "w-8 h-8",
  size = 32
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={secondaryColor} />
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>
      </defs>
      
      {/* Moldura Elegante */}
      <path 
        d="M50 5 L95 50 L50 95 L5 50 Z" 
        stroke="url(#logoGradient)" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M50 15 L85 50 L50 85 L15 50 Z" 
        fill="url(#logoGradient)" 
        fillOpacity="0.1" 
      />

      {/* Iniciais JM */}
      <text 
        x="50%" 
        y="50%" 
        dominantBaseline="middle" 
        textAnchor="middle" 
        fill="url(#logoGradient)"
        style={{ 
          fontFamily: 'serif', 
          fontWeight: 900, 
          fontSize: '32px',
          letterSpacing: '-2px'
        }}
      >
        JM
      </text>

      {/* Detalhe de Brilho */}
      <circle cx="85" cy="50" r="3" fill={primaryColor} />
      <circle cx="15" cy="50" r="3" fill={secondaryColor} />
    </svg>
  );
};

export default Logo;
