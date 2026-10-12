import React from 'react';

interface SwitchLogoProps {
  className?: string;
  size?: number;
}

export default function SwitchLogo({ className = 'w-10 h-10', size = 44 }: SwitchLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-label="The Switch Logo"
    >
      <defs>
        {/* Vibrant Switch Orange Gradient */}
        <linearGradient id="switchOrangeGrad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#FF7A29" />
          <stop offset="50%" stopColor="#FF5E14" />
          <stop offset="100%" stopColor="#E04200" />
        </linearGradient>

        {/* Electric Cyan to Teal Accent Gradient */}
        <linearGradient id="switchCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="60%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Outer Track Gradient */}
        <linearGradient id="switchTrackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="35%" stopColor="#0284C7" />
          <stop offset="70%" stopColor="#0369A1" />
          <stop offset="100%" stopColor="#FF5E14" />
        </linearGradient>

        {/* Subtle Orange Glow Filter */}
        <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#FF5E14" floodOpacity="0.4" />
        </filter>

        {/* Subtle Container Depth */}
        <filter id="trackGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0284C7" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Modern Dynamic Outer Switch Loop Track */}
      <path
        d="M 42 16
           C 26 16 16 26 16 44
           L 16 76
           C 16 94 26 104 44 104
           L 76 104
           C 94 104 104 94 104 76
           L 104 46"
        stroke="url(#switchTrackGrad)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#trackGlow)"
      />

      {/* Dynamic Directional Arrowhead representing career switch */}
      <path
        d="M 94 56 L 104 44 L 114 56"
        fill="none"
        stroke="#38BDF8"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Dynamic Transformation Arc */}
      <path
        d="M 32 80 C 44 80 62 76 74 58"
        fill="none"
        stroke="url(#switchCyanGrad)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Core "Switch" Energy Toggle (Vibrant Orange Core) */}
      <rect
        x="38"
        y="30"
        width="44"
        height="36"
        rx="18"
        fill="url(#switchOrangeGrad)"
        filter="url(#orangeGlow)"
      />

      {/* Subtle Inner Reflection on Core */}
      <ellipse
        cx="54"
        cy="40"
        rx="12"
        ry="6"
        fill="#FFFFFF"
        opacity="0.35"
      />
    </svg>
  );
}
