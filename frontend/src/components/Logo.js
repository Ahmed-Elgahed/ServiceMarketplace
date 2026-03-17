import React from 'react';

const NeuxLogo = ({ size = 40, animated = true }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={animated ? "animate-pulse-slow" : ""}
    >
      <path 
        d="M20 20L80 80" 
        stroke="url(#paint0_linear)" 
        strokeWidth="12" 
        strokeLinecap="round" 
      />
      <path 
        d="M80 20L20 80" 
        stroke="url(#paint1_linear)" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeDasharray="2 15" 
      />
      
      <defs>
        <linearGradient id="paint0_linear" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#D946EF" />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="80" y1="20" x2="20" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default NeuxLogo;