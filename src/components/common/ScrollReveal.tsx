'use client';

import React, { useEffect, useRef, useState } from 'react';

export type ScrollAnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-in'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: ScrollAnimationType;
  delay?: number; // In milliseconds
  duration?: number; // In milliseconds
  threshold?: number;
  rootMargin?: string;
  className?: string;
  as?: React.ElementType;
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  className = '',
  as: Component = 'div',
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (elementRef.current) {
              observer.unobserve(elementRef.current);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold, rootMargin]);

  // Determine initial off-screen transform
  const getInitialStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transitionProperty: 'opacity, transform',
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      transitionDelay: `${delay}ms`,
      willChange: 'opacity, transform',
    };

    if (isVisible) {
      return {
        ...baseStyle,
        opacity: 1,
        transform: 'none',
      };
    }

    let transform = 'translateY(28px)';
    if (animation === 'fade-down') transform = 'translateY(-28px)';
    if (animation === 'fade-left') transform = 'translateX(28px)';
    if (animation === 'fade-right') transform = 'translateX(-28px)';
    if (animation === 'zoom-in') transform = 'scale(0.96)';
    if (animation === 'fade-in') transform = 'none';

    return {
      ...baseStyle,
      opacity: 0,
      transform,
    };
  };

  return (
    <Component
      ref={elementRef}
      style={getInitialStyle()}
      className={className}
    >
      {children}
    </Component>
  );
}
