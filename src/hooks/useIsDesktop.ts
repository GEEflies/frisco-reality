'use client';

import { useState, useEffect } from 'react';

/**
 * Returns `true` once the viewport is ≥ 1024 px (Tailwind `lg`).
 * Starts as `false` on the server / first render so the mobile
 * (CSS-reveal) path is always the SSR default — no hydration mismatch.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}
