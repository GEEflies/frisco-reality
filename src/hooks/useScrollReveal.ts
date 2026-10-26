'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const MOBILE_VIEWPORT_QUERY = '(max-width: 1023px)';
const REVEAL_TARGET_SELECTOR = '.reveal:not(.revealed), .reveal-scale:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed)';

// threshold 0 + a negative bottom margin: an element reveals once its top edge is
// a bit inside the viewport, whatever its height. A ratio threshold (e.g. 0.15)
// never fires for sections taller than ~6x the viewport — /ponuka's listings
// grid (4000+ px) stayed invisible until the user scrolled.
const OBSERVER_OPTIONS = {
  mobile: {
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
  },
  desktop: {
    threshold: 0,
    rootMargin: '0px 0px -12% 0px',
  },
} as const;

function markAsRevealed(target: Element): void {
  if (target instanceof HTMLElement) {
    target.classList.remove('revealed');
    void target.offsetHeight;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.classList.add('revealed');
    });
  });
}

function observeRevealTargets(root: ParentNode, observer: IntersectionObserver): void {
  root.querySelectorAll(REVEAL_TARGET_SELECTOR).forEach((element) => {
    observer.observe(element);
  });
}

function isRevealElement(node: HTMLElement): boolean {
  return (
    node.classList.contains('reveal') ||
    node.classList.contains('reveal-scale') ||
    node.classList.contains('reveal-left') ||
    node.classList.contains('reveal-right')
  );
}

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

    // Mark that JS is running — CSS only hides .reveal elements when
    // this class is present, so content stays visible if JS ever fails.
    document.documentElement.classList.add('js-reveal');

    const isMobileViewport = window.matchMedia(MOBILE_VIEWPORT_QUERY).matches;
    const observerOptions = isMobileViewport ? OBSERVER_OPTIONS.mobile : OBSERVER_OPTIONS.desktop;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Use rAF to ensure the browser has painted the initial (hidden)
            // state before adding .revealed — without this, CSS animations
            // on .rv-child elements can silently skip when the element is
            // already in-viewport the moment it's first observed (e.g. after
            // a dynamic import mounts).
            markAsRevealed(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      observerOptions
    );

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (isRevealElement(node) && !node.classList.contains('revealed')) {
              observer.observe(node);
            }
            observeRevealTargets(node, observer);
          }
        }
      }
    });

    // Defer the first observation until AFTER React's hydration commit.
    // Without this, IntersectionObserver fires synchronously for elements
    // already in the viewport, adding `.revealed` while React is still
    // reconciling the server HTML — causing a hydration mismatch warning.
    const raf = requestAnimationFrame(() => {
      observeRevealTargets(document, observer);
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);
}
