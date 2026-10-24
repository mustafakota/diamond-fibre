'use client';

import React, { useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}

function getSnapshot(): number {
  return new Date().getFullYear();
}

function getServerSnapshot(): number {
  return 2026;
}

/**
 * Renders the copyright year dynamically on the client using useSyncExternalStore,
 * avoiding Next.js 16 Partial Prerendering build-time bailouts and cascading effect renders.
 */
export const DynamicYear: React.FC = () => {
  const year = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <>{year}</>;
};
