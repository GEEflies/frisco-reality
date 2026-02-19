'use client';

import HeroDesktop from './HeroDesktop';
import HeroMobile from './HeroMobile';

import ReactDOM from 'react-dom';

export const HeroSection = () => {
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
