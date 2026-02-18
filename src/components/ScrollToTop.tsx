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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};
