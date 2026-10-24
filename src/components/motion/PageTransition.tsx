'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Module-scoped tracker across client-side App Router navigations
// Initial value in a fresh browser session/page refresh is false
let hasMountedInitialPage = false;

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If this is the initial server render or the first page load in the window session,
  // render without entrance animation to prevent white flashes or hidden SSR content.
  // On subsequent client-side route transitions, apply the restrained .page-enter animation.
  const [isClientNavigation] = useState<boolean>(() => hasMountedInitialPage);

  useEffect(() => {
    // Mark that the initial page has mounted in this browser session
    hasMountedInitialPage = true;
  }, []);

  const animationClass = !shouldReduceMotion && isClientNavigation ? 'page-enter' : '';

  return (
    <div className={`${animationClass} ${className}`.trim()}>
      {children}
    </div>
  );
};
