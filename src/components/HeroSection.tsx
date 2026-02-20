'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DESKTOP_HERO_QUERY = '(min-width: 1024px)';

type HeroViewport = 'pending' | 'desktop' | 'mobile';

function resolveHeroViewport(matchesDesktop: boolean): HeroViewport {
  return matchesDesktop ? 'desktop' : 'mobile';
}

/* ------------------------------------------------------------------ */
/*  Dynamic imports – only the matching hero JS bundle will download   */
/* ------------------------------------------------------------------ */
const HeroDesktop = dynamic(() => import('./HeroDesktop'), { ssr: false });
const HeroMobile  = dynamic(() => import('./HeroMobile'),  { ssr: false });

export const HeroSection = () => {
  const [viewport, setViewport] = useState<HeroViewport>('pending');

  useEffect(() => {
    const mediaQueryList = window.matchMedia(DESKTOP_HERO_QUERY);

    const updateViewport = (matchesDesktop: boolean) => {
      setViewport(resolveHeroViewport(matchesDesktop));
    };

    updateViewport(mediaQueryList.matches);

    const handleViewportChange = (event: MediaQueryListEvent) => {
      updateViewport(event.matches);
    };

    mediaQueryList.addEventListener('change', handleViewportChange);
    return () => mediaQueryList.removeEventListener('change', handleViewportChange);
  }, []);

  return (
    <section id="home" className="min-h-screen bg-white">
      {viewport === 'pending' ? (
        /* Placeholder while JS hydrates – prevents layout shift */
        <div className="min-h-screen bg-white" />
      ) : viewport === 'desktop' ? (
        <HeroDesktop />
      ) : (
        <HeroMobile />
      )}
    </section>
  );
};
