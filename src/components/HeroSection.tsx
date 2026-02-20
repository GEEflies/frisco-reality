'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Dynamic imports – only the matching hero JS bundle will download   */
/* ------------------------------------------------------------------ */
const HeroDesktop = dynamic(() => import('./HeroDesktop'), { ssr: false });
const HeroMobile  = dynamic(() => import('./HeroMobile'),  { ssr: false });

export const HeroSection = () => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <section id="home" className="min-h-screen bg-white">
      {isDesktop === null ? (
        /* Placeholder while JS hydrates – prevents layout shift */
        <div className="min-h-screen bg-white" />
      ) : isDesktop ? (
        <HeroDesktop />
      ) : (
        <HeroMobile />
      )}
    </section>
  );
};
