'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone, Instagram, Facebook, Mail, Search, Home, Key, Globe } from 'lucide-react';
import Image from 'next/image';



export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPonukaOpen, setIsPonukaOpen] = useState(true); // Mobile state
  const [isPonukaHovered, setIsPonukaHovered] = useState(false); // Desktop state
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isPonukaPage = pathname?.includes('/ponuka');
  const isPropertyDetailPage = pathname?.includes('/nehnutelnost');
  const isChcemPredatPage = pathname?.includes('/chcem-predat');

  // Combined state for active/scrolled navbar appearance
  const isNavActive = isScrolled || isPonukaHovered || isChcemPredatPage;

  // Open Ponuka dropdown automatically when mobile menu opens - handled in click handler now

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      e.preventDefault();
      router.push('/');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop & Tablet Navbar */}
      <div className={`fixed top-0 left-0 right-0 z-50 flex-col ${isPropertyDetailPage ? 'hidden' : 'hidden xl:flex'}`}>
        <header
          className="relative w-full flex items-center justify-center h-24"
        >
          {/* Animated background container */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 inset-y-3 rounded-full transition-all duration-500 ${isNavActive
              ? 'bg-white/95 backdrop-blur-xl border border-navy/10 shadow-lg opacity-100'
              : 'opacity-0'
              }`}
            style={{ width: 'calc(100% - 2rem)', maxWidth: '1375px' }}
          />

          <div className="relative flex items-center justify-center gap-6 2xl:gap-12 flex-nowrap px-4">
            {/* Logo */}
            <Link href="/" onClick={handleHomeClick} className="relative z-10 flex-shrink-0">
              <Image
                src="/frisco-logo-opt.png"
                alt="Frisco"
                className="max-h-12 lg:max-h-16 w-auto object-contain object-left"
              />
            </Link>

            {/* Links */}
            <nav className="flex items-center gap-6 2xl:gap-10 flex-nowrap">
              <Link
                href="/"
                onClick={handleHomeClick}
                className={`text-base font-sans font-medium transition-colors relative group py-2 tracking-[0.2em] uppercase whitespace-nowrap ${isNavActive ? 'text-charcoal/80 hover:text-navy' : 'text-charcoal/70 hover:text-navy'
                  }`}
              >
                Domov
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
              </Link>

              {/* Ponuka Dropdown */}
              <div
                className="relative w-max h-full flex items-center"
                onMouseEnter={() => setIsPonukaHovered(true)}
                onMouseLeave={() => setIsPonukaHovered(false)}
              >
                <div
                  className={`text-base font-sans font-medium transition-colors relative py-2 tracking-[0.2em] uppercase whitespace-nowrap cursor-pointer flex items-center gap-1.5 group ${isNavActive ? 'text-charcoal/80 hover:text-navy' : 'text-charcoal/70 hover:text-navy'
                    }`}
                >
                  Ponuka
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isPonukaHovered ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute bottom-0 left-0 right-4 h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                </div>

                <AnimatePresence>
                  {isPonukaHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, x: "-50%", scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                      exit={{ opacity: 0, y: -8, x: "-50%", scale: 0.96 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full left-1/2 pt-1"
                      role="menu"
                    >
                      <div className="bg-white shadow-lg border border-charcoal/5 min-w-[280px] rounded-xl overflow-hidden">
                        <Link
                          href="/ponuka"
                          className="flex items-center gap-3.5 px-6 py-4 text-base font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-navy/[0.03] transition-all duration-200 border-b border-charcoal/5 whitespace-normal group"
                          role="menuitem"
                          onClick={() => setIsPonukaHovered(false)}
                        >
                          <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-red group-hover:text-white transition-colors duration-200">
                            <Search size={16} className="text-navy/60 group-hover:text-white transition-colors duration-200" />
                          </div>
                          Aktuálna ponuka
                        </Link>
                        <Link
                          href="/chcem-predat"
                          className="flex items-center gap-3.5 px-6 py-4 text-base font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-navy/[0.03] transition-all duration-200 border-b border-charcoal/5 whitespace-normal group"
                          role="menuitem"
                          onClick={() => setIsPonukaHovered(false)}
                        >
                          <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-red group-hover:text-white transition-colors duration-200">
                            <Home size={16} className="text-navy/60 group-hover:text-white transition-colors duration-200" />
                          </div>
                          Chcem predať
                        </Link>
                        <Link
                          href="/chcem-prenajat"
                          className="flex items-center gap-3.5 px-6 py-4 text-base font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-navy/[0.03] transition-all duration-200 whitespace-normal group"
                          role="menuitem"
                          onClick={() => setIsPonukaHovered(false)}
                        >
                          <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-red group-hover:text-white transition-colors duration-200">
                            <Key size={16} className="text-navy/60 group-hover:text-white transition-colors duration-200" />
                          </div>
                          Chcem prenajať
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/preco-frisco"
                className={`text-base font-sans font-medium transition-colors relative group py-2 tracking-[0.2em] uppercase whitespace-nowrap ${isNavActive ? 'text-charcoal/80 hover:text-navy' : 'text-charcoal/70 hover:text-navy'
                  }`}
              >
                Prečo Frisco?
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
              </Link>

              <Link
                href="/kontakt"
                className={`text-base font-sans font-medium transition-colors relative group py-2 tracking-[0.2em] uppercase whitespace-nowrap ${isNavActive ? 'text-charcoal/80 hover:text-navy' : 'text-charcoal/70 hover:text-navy'
                  }`}
              >
                Kontakt
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
              </Link>
            </nav>

            {/* Contact Actions Group */}
            <div className="flex items-center gap-2">
              {/* CTA - Red for critical action */}
              <a
                href="tel:+421905447220"
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-sans font-bold tracking-[0.15em] transition-all duration-300 whitespace-nowrap flex-shrink-0 ${isNavActive
                  ? 'bg-accent-red text-white hover:bg-accent-red hover:scale-105 hover:shadow-xl hover:shadow-accent-red/30 shadow-lg shadow-accent-red/20'
                  : 'bg-accent-red text-white hover:bg-accent-red hover:scale-105 hover:shadow-xl hover:shadow-accent-red/30 shadow-lg shadow-accent-red/20'
                  }`}
              >
                <Phone size={16} className="flex-shrink-0" />
                <span>0905 447 220</span>
              </a>

              {/* Email CTA - Outline style */}
              <a
                href="mailto:info@frisco.sk"
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-sans font-bold tracking-[0.15em] transition-all duration-300 whitespace-nowrap flex-shrink-0 border bg-white/50 border-accent-red text-accent-red hover:bg-accent-red hover:text-white group ${isNavActive
                  ? 'shadow-sm hover:shadow-md'
                  : 'shadow-sm hover:shadow-md'
                  }`}
              >
                <Mail size={16} className="flex-shrink-0 group-hover:text-white transition-colors" />
                <span>info@frisco.sk</span>
              </a>

              {/* Social Icons */}
              <div className="flex items-center gap-2.5 flex-shrink-0 ml-1">
                <a
                  href="https://www.facebook.com/Friscorealitka/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center text-navy/70 hover:bg-accent-red hover:text-white hover:border-accent-red transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook size={18} strokeWidth={2} />
                </a>
                <a
                  href="https://www.instagram.com/friscoreality/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center text-navy/70 hover:bg-accent-red hover:text-white hover:border-accent-red transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={18} strokeWidth={2} />
                </a>

                {/* Language Switcher */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsLanguageOpen(true)}
                  onMouseLeave={() => setIsLanguageOpen(false)}
                >
                  <button
                    className="w-10 h-10 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center text-navy/70 hover:bg-accent-red hover:text-white hover:border-accent-red transition-all duration-300"
                    aria-label="Change language"
                  >
                    <Globe size={18} strokeWidth={2} />
                  </button>

                  <AnimatePresence>
                    {isLanguageOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, x: "-50%" }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 mt-2 z-50"
                      >
                        <div className="bg-white shadow-lg border border-charcoal/5 rounded-xl overflow-hidden py-1 min-w-[140px] flex flex-col">
                          {['Slovenčina', 'English', 'Deutsch'].map((lang, index) => (
                            <button
                              key={lang}
                              className={`px-4 py-2 text-left text-sm font-sans font-medium hover:bg-navy/5 hover:text-navy transition-colors ${index === 0 ? 'text-navy font-bold' : 'text-charcoal/70'}`}
                              onClick={() => setIsLanguageOpen(false)}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Ponuka Backdrop Overlay */}
      <AnimatePresence>
        {isPonukaHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40 hidden xl:block"
          // Intentionally no onMouseEnter here to prevent accidental closing
          // We rely on the parent navbar container mouse leave or explicit clicks
          />
        )}
      </AnimatePresence>

      {/* Mobile Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 xl:hidden flex justify-between items-center px-6 h-[80px] bg-white backdrop-blur-xl border-b border-black/5 transition-all duration-300">
        <Link href="/" onClick={handleHomeClick} className="relative z-10 flex items-center">
          <Image
            src="/frisco-logo-opt.png"
            alt="FRISCO"
            width={72}
            height={48}
            priority
            className="h-14 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-3">
          {/* Mobile Email & Phone Icons */}
          <a
            href="mailto:info@frisco.sk"
            className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center text-navy/70 hover:bg-accent-red hover:text-white transition-colors"
            aria-label="Email"
          >
            <Mail size={22} />
          </a>
          <a
            href="tel:+421905447220"
            className="w-12 h-12 rounded-full bg-accent-red flex items-center justify-center text-white shadow-lg shadow-accent-red/20 active:scale-95 transition-all"
            aria-label="Call"
          >
            <Phone size={22} />
          </a>

          <button
            className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black active:scale-95 transition-all duration-300 hover:bg-black/10 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-black flex flex-col xl:hidden"
          >
            {/* Header in Overlay */}
            <div className="flex justify-between items-center px-6 h-[80px] border-b border-white/10">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Image
                  src="/frisco-logo-opt.png"
                  alt="FRISCO"
                  width={80}
                  height={54}
                  priority
                  className="h-16 w-auto brightness-0 invert object-contain"
                />
              </Link>
              <button
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 flex flex-col justify-center px-8 space-y-6">
              <Link
                href="/"
                className="text-4xl font-serif font-bold text-white hover:text-accent-red transition-colors block tracking-tight"
                onClick={(e) => { setIsMobileMenuOpen(false); handleHomeClick(e); }}
              >
                Domov
              </Link>

              {/* Mobile Ponuka Accordion */}
              <div className="flex flex-col">
                <button
                  onClick={() => setIsPonukaOpen(!isPonukaOpen)}
                  className="text-4xl font-serif font-bold text-white hover:text-accent-red transition-colors text-left flex items-center justify-between tracking-tight"
                >
                  Ponuka
                  <span className={`text-2xl transition-transform duration-300 ${isPonukaOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                <AnimatePresence>
                  {isPonukaOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden pl-4 flex flex-col space-y-4 mt-4"
                    >
                      <Link
                        href="/ponuka"
                        className="text-lg font-sans font-semibold tracking-wide text-white/90 hover:text-white transition-colors flex items-center gap-3"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Search size={18} className="text-accent-red" />
                        Aktuálna ponuka
                      </Link>
                      <Link
                        href="/chcem-predat"
                        className="text-lg font-sans font-semibold tracking-wide text-white/90 hover:text-white transition-colors flex items-center gap-3"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Home size={18} className="text-accent-red" />
                        Chcem predať
                      </Link>
                      <Link
                        href="/chcem-prenajat"
                        className="text-lg font-sans font-semibold tracking-wide text-white/90 hover:text-white transition-colors flex items-center gap-3"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Key size={18} className="text-accent-red" />
                        Chcem prenajať
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/preco-frisco"
                className="text-4xl font-serif font-bold text-white hover:text-accent-red transition-colors block tracking-tight"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Prečo Frisco?
              </Link>
              <Link
                href="/kontakt"
                className="text-4xl font-serif font-bold text-white hover:text-accent-red transition-colors block tracking-tight"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kontakt
              </Link>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-8 border-t border-white/10"
            >
              <a
                href="tel:+421905447220"
                className="flex items-center justify-center gap-3 w-full py-4 bg-accent-red text-white text-center font-bold font-sans uppercase tracking-widest rounded-full hover:bg-accent-red/90 transition-colors shadow-lg shadow-accent-red/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone size={20} className="mb-0.5" />
                <span>Zavolajte nám</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
