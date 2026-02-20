'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const ScrollToTop = () => {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Use instant scroll — 'smooth' can fail on mobile if the page is very long
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};
