'use client';

import HeroDesktop from './HeroDesktop';
import HeroMobile from './HeroMobile';

import ReactDOM from 'react-dom';

export const HeroSection = () => {
  // Preload video for LCP optimization
  ReactDOM.preload(
    'https://fcvswlurtchqorgnwclw.supabase.co/storage/v1/object/public/videos/hero-video.mp4',
    { as: 'video' }
  );

  return (
    <section id="home" className="min-h-screen bg-white">
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <HeroDesktop />
      </div>

      {/* Mobile Version */}
      <div className="block lg:hidden">
        <HeroMobile />
      </div>
    </section>
  );
};
