'use client';

import React, { useId } from 'react';

interface SwitchLogoProps {
  className?: string;
  size?: number;
  variant?: 'icon' | 'full';
}

/**
 * Authentic "Switch 1.0" brand mark logo.
 * Replicated with mathematical precision from the official brand reference:
 * - 3D glossy orange toggle nucleus with specular highlight reflection.
 * - Continuous deep-teal stadium loop with crisp downward directional arrowhead.
 * - Dynamic lower transformation swoosh with diagonal cycling cut.
 * - Optional "— THE — SWITCH" brand typography.
 */
export default function SwitchLogo({
  className = 'w-10 h-10',
  size,
  variant = 'icon',
}: SwitchLogoProps) {
  const rawId = useId();
  // Sanitize id for SVG attribute safety
  const id = `sw_${rawId.replace(/[^a-zA-Z0-9]/g, '_')}`;

  const smoothPath =
    'M 425 104 ' +
    'L 590 104 ' +
    'C 655 104 706 148 708 208 ' +
    'L 708 241 ' +
    'L 758 244 ' +
    'L 702 332 ' +
    'L 635 244 ' +
    'L 658 241 ' +
    'L 658 208 ' +
    'C 656 172 626 153 585 153 ' +
    'L 435 153 ' +
    'C 390 153 357 175 357 220 ' +
    'L 357 495 ' +
    'C 357 538 388 569 430 569 ' +
    'L 580 569 ' +
    'C 625 569 652 542 652 502 ' +
    'L 652 402 ' +
    'C 620 450 560 505 500 525 ' +
    'C 455 538 415 538 388 505 ' +
    'C 420 497 490 480 550 445 ' +
    'C 600 410 638 355 653 302 ' +
    'L 704 369 ' +
    'L 704 510 ' +
    'C 704 570 660 620 598 620 ' +
    'L 420 620 ' +
    'C 355 620 304 570 304 510 ' +
    'L 304 208 ' +
    'C 304 150 355 104 420 104 ' +
    'Z';

  const isFull = variant === 'full';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={isFull ? '0 0 1024 1024' : '261 92 540 540'}
      width={size}
      height={size}
      fill="none"
      className={className}
      role="img"
      aria-label="The Switch Logo"
    >
      <defs>
        {/* Authentic Luminous Teal to Deep Navy-Teal Gradient */}
        <linearGradient id={`${id}_teal`} x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#00A8B5" />
          <stop offset="25%" stopColor="#008997" />
          <stop offset="55%" stopColor="#006573" />
          <stop offset="85%" stopColor="#004350" />
          <stop offset="100%" stopColor="#002D36" />
        </linearGradient>

        {/* Glossy 3D Orange Toggle Radial Gradient */}
        <radialGradient id={`${id}_orange`} cx="38%" cy="32%" r="65%" fx="32%" fy="26%">
          <stop offset="0%" stopColor="#FFBD4A" />
          <stop offset="22%" stopColor="#FF8E12" />
          <stop offset="58%" stopColor="#FF5900" />
          <stop offset="88%" stopColor="#E83500" />
          <stop offset="100%" stopColor="#C72400" />
        </radialGradient>

        {/* Specular Highlight / Reflection Sheen */}
        <linearGradient id={`${id}_specular`} x1="0%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Tactile Orange Toggle Core Depth Shadow */}
        <filter id={`${id}_orangeShadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#E83500" floodOpacity="0.35" />
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
        </filter>

        {/* Loop Outer Depth Shadow */}
        <filter id={`${id}_loopGlow`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#002D36" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* 1. Core Energy Toggle (Orange Pebble Nucleus) */}
      <g filter={`url(#${id}_orangeShadow)`}>
        <rect
          x="394"
          y="194"
          width="222"
          height="212"
          rx="76"
          ry="74"
          fill={`url(#${id}_orange)`}
        />
        {/* Upper-Left Specular Sheen for 3D tactile button feel */}
        <ellipse
          cx="462"
          cy="244"
          rx="44"
          ry="24"
          transform="rotate(-28 462 244)"
          fill={`url(#${id}_specular)`}
        />
      </g>

      {/* 2. Iconic Teal Loop & Downward Directional Arrow & Transformation Swoosh */}
      <path
        d={smoothPath}
        fill={`url(#${id}_teal)`}
        filter={`url(#${id}_loopGlow)`}
      />

      {/* 3. Optional Full Brand Typography (When variant="full") */}
      {isFull && (
        <g>
          {/* — THE — subtitle */}
          <rect x="200" y="694" width="155" height="13" rx="6.5" fill="#FF5900" />
          <text
            x="512"
            y="712"
            textAnchor="middle"
            fill="#006573"
            fontSize="52"
            fontWeight="900"
            letterSpacing="12"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          >
            THE
          </text>
          <rect x="668" y="694" width="155" height="13" rx="6.5" fill="#FF5900" />

          {/* Bold geometric SWITCH title */}
          <text
            x="505"
            y="895"
            textAnchor="middle"
            fill={`url(#${id}_teal)`}
            fontSize="192"
            fontWeight="900"
            letterSpacing="8"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          >
            SWITCH
          </text>
        </g>
      )}
    </svg>
  );
}
