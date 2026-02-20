'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Lightweight scroll-reveal powered by IntersectionObserver + CSS.
 * Elements with `.reveal` or `.reveal-scale` get `.revealed` added
 * when they enter the viewport. Pure CSS handles the animation.
 *
 * Re-scans the DOM on every route change so dynamically-rendered
 * elements (client-side navigation) are always picked up.
 *
 * Call this hook once in a layout or page wrapper component.
 */
export function useScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Use rAF to ensure the browser has painted the initial (hidden)
            // state before adding .revealed — without this, CSS animations
            // on .rv-child elements can silently skip when the element is
            // already in-viewport the moment it's first observed (e.g. after
            // a dynamic import mounts).
            requestAnimationFrame(() => {
              entry.target.classList.add('revealed');
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    // Observe all current .reveal / .reveal-scale / .reveal-left / .reveal-right elements
    const elements = document.querySelectorAll('.reveal:not(.revealed), .reveal-scale:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed)');
    elements.forEach((el) => observer.observe(el));

    // Also watch for elements added later (e.g. lazy-loaded sections)
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (
              (node.classList.contains('reveal') || node.classList.contains('reveal-scale') || node.classList.contains('reveal-left') || node.classList.contains('reveal-right')) &&
              !node.classList.contains('revealed')
            ) {
              observer.observe(node);
            }
            // Also check descendants
            node.querySelectorAll?.('.reveal:not(.revealed), .reveal-scale:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed)').forEach((el) => {
              observer.observe(el);
            });
          }
        }
      }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);
}
