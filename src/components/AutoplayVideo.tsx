'use client';

import { useEffect, useRef } from 'react';

/**
 * AutoplayVideo
 *
 * Reliably autoplays muted looping video on mobile (iOS Safari) by:
 * 1. Programmatically calling .play() on mount and on canplay/loadeddata events
 * 2. Adding a touchstart listener as a fallback for first-interaction autoplay
 * 3. Keeping the <video> element itself always at opacity:1 so the browser
 *    never considers it hidden (the CSS fade-in lives on the wrapper instead)
 */

interface AutoplayVideoProps {
  src: string;
  className?: string;
  poster?: string;
}

const AutoplayVideo = ({ src, className, poster }: AutoplayVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      className={className}
      // iOS Safari webkit attribute
      {...{ 'webkit-playsinline': 'true' }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

export default AutoplayVideo;
