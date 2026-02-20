'use client';

import { useMediaQuery } from './useMediaQuery';

const DESKTOP_QUERY = '(min-width: 1024px)';

/**
 * Returns `true` once the viewport is ≥ 1024 px (Tailwind `lg`).
 * Starts as `false` on the server / first render so the mobile
 * (CSS-reveal) path is always the SSR default — no hydration mismatch.
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(DESKTOP_QUERY);
}
