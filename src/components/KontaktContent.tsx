'use client';

import { motion } from 'framer-motion';
import { Phone, ArrowUpRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { LocationSection } from '@/components/LocationSection';

const agentsHero = '/agents-hero.png';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const Kontakt = () => {
  return (
    <div className="min-h-screen bg-cream">
      <div className="animate-in fade-in duration-700">

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:py-32 overflow-hidden min-h-[80vh] flex items-center bg-white">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(27,58,95,0.08),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(27,58,95,0.03),transparent_40%)] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Text Content */}
              <motion.div
                className="max-w-2xl"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.span
                  variants={fadeInUp}
                  className="inline-block text-navy font-mono text-xs tracking-[0.3em] uppercase mb-6 border-b border-navy/30 pb-2"
                >
                  Kontaktujte nás
                </motion.span>

                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-navy tracking-tight mb-6"
                >
                  Poďme spolu <br />
                  <span className="text-accent-red italic">spolupracovať</span>.
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg md:text-xl text-charcoal/70 font-light leading-relaxed mb-8"
                >
                  Sme tu pre vás. Či už predávate, kupujete alebo len hľadáte radu –
                  radi vám pomôžeme s akoukoľvek otázkou.
                </motion.p>
              </motion.div>

              {/* Image Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                className="relative hidden lg:block"
              >
                <div className="relative group aspect-[4/3]">
                  <img
                    src={agentsHero}
                    alt="FRISCO Tím"
                    className="w-full h-full object-contain object-bottom transform transition-transform duration-1000 group-hover:scale-105 drop-shadow-2xl"
                  />

                  {/* Decorative Elements */}
                  <div className="absolute bottom-8 left-8">
                    <div className="w-12 h-1 bg-accent-red mb-4" />
                    <p className="text-charcoal/90 text-sm font-medium tracking-wide">
                      "Váš úspech je náš záväzok."
                    </p>
                  </div>
                </div>

                {/* Decorative Elements around image */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-navy/20 rounded-tr-3xl -z-10" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-navy/20 rounded-bl-3xl -z-10" />
              </motion.div>

            </div>
          </div>
        </section>

        {/* Main Content + Map Section standardized via ContactSection */}
        <ContactSection />
        <LocationSection />

        {/* CTA Section */}
        <section className="py-12 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative rounded-3xl bg-gradient-to-br from-navy/5 via-cream to-cream border border-navy/10 p-8 md:p-20 text-center overflow-hidden shadow-lg"
            >
              {/* Background decoration */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-navy/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <span className="text-navy font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
                  Preferujete telefonát?
                </span>
                <h2 className="text-3xl md:text-6xl font-serif font-bold text-navy tracking-tight mb-6">
                  Zavolajte nám priamo
                </h2>
                <p className="text-charcoal/60 text-lg mb-8 max-w-xl mx-auto">
                  Radi si s vami pohovoríme osobne. Neváhajte nás kontaktovať kedykoľvek počas pracovnej doby.
                </p>
                <a
                  href="tel:+421905447220"
                  className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-accent-red text-white rounded-full font-bold tracking-wide hover:bg-accent-red/90 transition-colors shadow-lg shadow-accent-red/20"
                >
                  <Phone className="w-5 h-5" />
                  <span>0905 447 220</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Kontakt;
