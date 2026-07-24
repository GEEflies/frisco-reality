'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * AutoplayVideo
 *
 * Reliably autoplays muted looping video on mobile (iOS Safari) by:
 * 1. Using IntersectionObserver to defer download until the element is near-visible
 * 2. Programmatically calling .play() once visible
 * 3. Adding a touchstart listener as a fallback for first-interaction autoplay
 * 4. Keeping the <video> element itself always at opacity:1 so the browser
 *    never considers it hidden (the CSS fade-in lives on the wrapper instead)
 */

interface AutoplayVideoProps {
  src: string;
  className?: string;
  poster?: string;
}

const AutoplayVideo = ({ src, className, poster }: AutoplayVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  /* ---- Step 1: only set the <source> src once the container is near-viewport ---- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // start loading 200px before it enters viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ---- Step 2: once the video element has a src, try to play it ---- */
  useEffect(() => {
    if (!shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay was blocked – will retry on first user interaction
      });
    };

    // Attempt play immediately and when media data is ready
    tryPlay();
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);

    // Fallback: play on first touch anywhere on the page (iOS low-power mode etc.)
    const onFirstTouch = () => {
      tryPlay();
      document.removeEventListener('touchstart', onFirstTouch, { capture: true });
    };
    document.addEventListener('touchstart', onFirstTouch, { capture: true, passive: true });

    return () => {
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
      document.removeEventListener('touchstart', onFirstTouch, { capture: true });
    };
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={poster}
          className="w-full h-full object-cover"
          // iOS Safari webkit attribute
          {...{ 'webkit-playsinline': 'true' }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        /* Placeholder – same dimensions, no download */
        poster ? (
          // lazy: when this hero is the hidden (off-target) variant it sits in a
          // display:none parent and never intersects, so the browser skips the
          // download entirely. The on-target poster is fetched eagerly via the
          // <link rel="preload"> in the root layout, so LCP is unaffected.
          <img src={poster} alt="" loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-navy/5" />
        )
      )}
    </div>
  );
};

export default AutoplayVideo;
