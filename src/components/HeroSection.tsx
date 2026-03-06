import HeroDesktop from './HeroDesktop';
import HeroMobile from './HeroMobile';

/* ------------------------------------------------------------------ */
/*  Both heroes are SSR-rendered. CSS media queries show/hide the      */
/*  correct one — no JS viewport detection needed, no blank            */
/*  "pending" state, instant LCP.                                      */
/* ------------------------------------------------------------------ */

export const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen bg-white">
      {/* Desktop hero — hidden below lg */}
      <div className="hidden lg:block">
        <HeroDesktop />
      </div>
      {/* Mobile hero — hidden at lg+ */}
      <div className="lg:hidden">
        <HeroMobile />
      </div>
    </section>
  );
};
