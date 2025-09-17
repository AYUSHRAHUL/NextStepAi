import React from "react";

const NextStepAiLogo = ({ 
  width = 300, 
  height = 60, 
  className = "",
  gradientId = "logo-gradient" // Unique gradient ID to avoid conflicts
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 1200 400" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="NextStepAi Logo"
  >
    {/* Text "NextStepAi" */}
    <text 
      x="50%" 
      y="50%" 
      dominantBaseline="middle" 
      textAnchor="middle"
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontSize="128" 
      fontWeight="700"
      fill={`url(#${gradientId})`}
      className="select-none font-bold tracking-tight"
    >
      NextStepAi
    </text>

    {/* Gradient definition */}
    <defs>
      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4CAF50" />
        <stop offset="100%" stopColor="#2196F3" />
      </linearGradient>
    </defs>
  </svg>
);

export default NextStepAiLogo;
