'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useMounted } from '@/lib/useMounted';

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
  viewportOnce?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.28,
  direction = 'up',
  distance = 10,
  className = '',
  viewportOnce = true,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useMounted();

  // During SSR or if reduced motion is requested, render visible content without opacity locks
  if (!mounted || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getInitialPosition = () => {
    // On mobile viewports (< 768px), horizontal translations ('left' / 'right')
    // can cause unexpected horizontal scrolling or awkward layout shifting.
    // Convert them gracefully to subtle vertical 'up' entrance.
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return isMobile ? { y: distance, x: 0 } : { x: distance, y: 0 };
      case 'right':
        return isMobile ? { y: distance, x: 0 } : { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: viewportOnce, margin: '0px' }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
