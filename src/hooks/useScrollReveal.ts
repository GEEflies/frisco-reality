'use client';

import { useEffect } from 'react';

/**
 * Lightweight scroll-reveal powered by IntersectionObserver + CSS.
 * Elements with `.reveal` or `.reveal-scale` get `.revealed` added
 * when they enter the viewport. Pure CSS handles the animation.
 *
 * Call this hook once in a layout or page wrapper component.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-scale');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
