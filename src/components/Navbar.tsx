'use client';

import { useState, useEffect, useRef, useCallback, type ComponentType, type SVGProps } from 'react';
import { ConfirmActionDialog } from './ConfirmActionDialog';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Instagram, Facebook, Mail, Search, Home, Key, Globe } from 'lucide-react';
import { DE, GB, SK } from 'country-flag-icons/react/3x2';
import { useLanguage } from '@/i18n/LanguageProvider';
import { NAVBAR_COPY } from '@/i18n/copy';
import { DEFAULT_LANGUAGE, type LanguageCode } from '@/i18n/types';

type FlagComponent = ComponentType<SVGProps<SVGSVGElement>>;

const LANGUAGES: { code: LanguageCode; label: string; Flag: FlagComponent }[] = [
  { code: 'sk', label: 'Sloven\u010Dina', Flag: SK as FlagComponent },
  { code: 'en', label: 'English', Flag: GB as FlagComponent },
  { code: 'de', label: 'Deutsch', Flag: DE as FlagComponent },
];

const stripLanguagePrefix = (path: string) => {
  const stripped = path.replace(/^\/(sk|en|de)(?=\/|$)/, '');
  return stripped.length > 0 ? stripped : '/';
};

const withLanguagePrefix = (path: string, lang: LanguageCode) => {
  if (lang === DEFAULT_LANGUAGE) return path;
  if (path === '/') return `/${lang}`;
  return `/${lang}${path}`;
};

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPonukaOpen, setIsPonukaOpen] = useState(true);
  const [isPonukaHovered, setIsPonukaHovered] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isLanguageSwitching, setIsLanguageSwitching] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; actionType: 'call' | 'email' }>({ isOpen: false, actionType: 'call' });
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const { language } = useLanguage();
  const pathname = usePathname();
  const navCopy = NAVBAR_COPY[language];
  const isPropertyDetailPage = pathname?.includes('/nehnutelnost');
  const isChcemPredatPage = pathname?.includes('/chcem-predat');
  const activeLanguage = LANGUAGES.find((o) => o.code === language) ?? LANGUAGES[0];
  const isNavActive = isScrolled || isPonukaHovered || isChcemPredatPage;

  const l = useCallback(
    (path: string) =>
      language === DEFAULT_LANGUAGE
        ? path
        : path === '/'
          ? `/${language}`
          : `/${language}${path}`,
    [language],
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
    if (!isMobileMenuOpen) setIsPonukaOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!languageMenuRef.current?.contains(e.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLanguageOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent, targetPath: string, shouldCloseMobileMenu = false) => {
    if (shouldCloseMobileMenu) setIsMobileMenuOpen(false);

    const currentPath = stripLanguagePrefix(pathname ?? '/');
    if (currentPath === targetPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLanguageSelect = (code: LanguageCode) => {
    if (code === language) {
      setIsLanguageOpen(false);
      setIsMobileMenuOpen(false);
      return;
    }
    setIsLanguageOpen(false);
    setIsMobileMenuOpen(false);
    setIsLanguageSwitching(true);

    document.cookie = `frisco-language=${code}; path=/; max-age=31536000; samesite=lax`;
    try { localStorage.setItem('frisco-language', code); } catch { /* noop */ }

    const bare = stripLanguagePrefix(pathname ?? '/');
    const nextPathname = withLanguagePrefix(bare, code);
    const params = new URLSearchParams(window.location.search);
    params.delete('lang');
    const qs = params.toString();
    const hash = window.location.hash;
    const nextUrl = `${nextPathname}${qs ? `?${qs}` : ''}${hash}`;

    setTimeout(() => {
      window.location.href = nextUrl;
    }, 450);
  };

  return (
    <>
      {/* Language Switch Overlay — CSS only, no Framer Motion flash */}
      <div
        className={`fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out ${isLanguageSwitching
          ? 'opacity-100 visible'
          : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        <div className="flex flex-col items-center">
          <img src="/frisco-logo-hq.webp" alt="FRISCO" className="h-12 md:h-14 mb-6" />
          <div className="w-40 h-[2px] bg-navy/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-navy rounded-full transition-all ease-[cubic-bezier(0.4,0,0.2,1)] ${isLanguageSwitching ? 'w-full duration-1000' : 'w-0 duration-0'
                }`}
            />
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className={`fixed top-0 left-0 right-0 z-[99] flex-col transition-all duration-300 ${isPropertyDetailPage ? 'hidden' : 'hidden xl:flex'}`}>
        <header className="relative w-full flex items-center justify-center h-24">
          <div
            className={`relative flex items-center justify-between gap-4 2xl:gap-8 flex-nowrap px-6 my-3 rounded-full transition-all duration-500 ${isNavActive ? 'bg-white/95 backdrop-blur-xl border border-navy/10 shadow-lg' : ''}`}
            style={{ width: 'calc(100% - 2rem)', maxWidth: language === 'de' ? '1600px' : '1375px' }}
          >
            <Link href={l('/')} onClick={(e) => handleNavClick(e, '/')} className="relative z-10 flex-shrink-0">
              <img src="/frisco-logo-hq.webp" alt="FRISCO" className="h-16 pl-4" />
            </Link>

            <nav className="flex items-center gap-5 2xl:gap-8 flex-nowrap">
              <Link href={l('/')} onClick={(e) => handleNavClick(e, '/')} className={`text-base font-sans font-medium transition-colors relative group py-2 tracking-[0.2em] uppercase whitespace-nowrap ${isNavActive ? 'text-charcoal/80 hover:text-navy' : 'text-charcoal/70 hover:text-navy'}`}>
                {navCopy.home}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
              </Link>

              {/* Ponuka Dropdown */}
              <div className="relative w-max h-full flex items-center" onMouseEnter={() => setIsPonukaHovered(true)} onMouseLeave={() => setIsPonukaHovered(false)}>
                <div className={`text-base font-sans font-medium transition-colors relative py-2 tracking-[0.2em] uppercase whitespace-nowrap cursor-pointer flex items-center gap-1.5 group ${isNavActive ? 'text-charcoal/80 hover:text-navy' : 'text-charcoal/70 hover:text-navy'}`}>
                  {navCopy.offer}
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isPonukaHovered ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute bottom-0 left-0 right-4 h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                </div>
                <AnimatePresence>
                  {isPonukaHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, x: '-50%', scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                      exit={{ opacity: 0, y: -8, x: '-50%', scale: 0.96 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full left-1/2 pt-1"
                      role="menu"
                    >
                      <div className="bg-white shadow-lg border border-charcoal/5 min-w-[280px] rounded-xl overflow-hidden">
                        <Link href={l('/ponuka')} className="flex items-center gap-3.5 px-6 py-4 text-base font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-navy/[0.03] transition-all duration-200 border-b border-charcoal/5 whitespace-normal group" role="menuitem" onClick={(e) => { setIsPonukaHovered(false); handleNavClick(e, '/ponuka'); }}>
                          <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-red group-hover:text-white transition-colors duration-200">
                            <Search size={16} className="text-navy/60 group-hover:text-white transition-colors duration-200" />
                          </div>
                          {navCopy.currentOffer}
                        </Link>
                        <Link href={l('/chcem-predat')} className="flex items-center gap-3.5 px-6 py-4 text-base font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-navy/[0.03] transition-all duration-200 border-b border-charcoal/5 whitespace-normal group" role="menuitem" onClick={(e) => { setIsPonukaHovered(false); handleNavClick(e, '/chcem-predat'); }}>
                          <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-red group-hover:text-white transition-colors duration-200">
                            <Home size={16} className="text-navy/60 group-hover:text-white transition-colors duration-200" />
                          </div>
                          {navCopy.sell}
                        </Link>
                        <Link href={l('/chcem-prenajat')} className="flex items-center gap-3.5 px-6 py-4 text-base font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-navy/[0.03] transition-all duration-200 whitespace-normal group" role="menuitem" onClick={(e) => { setIsPonukaHovered(false); handleNavClick(e, '/chcem-prenajat'); }}>
                          <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-red group-hover:text-white transition-colors duration-200">
                            <Key size={16} className="text-navy/60 group-hover:text-white transition-colors duration-200" />
                          </div>
                          {navCopy.rent}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href={l('/preco-frisco')} onClick={(e) => handleNavClick(e, '/preco-frisco')} className={`text-base font-sans font-medium transition-colors relative group py-2 tracking-[0.2em] uppercase whitespace-nowrap ${isNavActive ? 'text-charcoal/80 hover:text-navy' : 'text-charcoal/70 hover:text-navy'}`}>
                {navCopy.whyFrisco}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
              </Link>

              <Link href={l('/kontakt')} onClick={(e) => handleNavClick(e, '/kontakt')} className={`text-base font-sans font-medium transition-colors relative group py-2 tracking-[0.2em] uppercase whitespace-nowrap ${isNavActive ? 'text-charcoal/80 hover:text-navy' : 'text-charcoal/70 hover:text-navy'}`}>
                {navCopy.contact}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
              </Link>
            </nav>

            {/* Contact actions */}
            <div className="flex items-center gap-2">
              <a href="tel:+421905447220" className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-sans font-bold tracking-[0.15em] bg-accent-red text-white hover:scale-105 hover:shadow-xl hover:shadow-accent-red/30 shadow-lg shadow-accent-red/20 transition-all duration-300 whitespace-nowrap flex-shrink-0">
                <Phone size={16} className="flex-shrink-0" />
                <span>0905 447 220</span>
              </a>
              <a href="mailto:info@frisco.sk" className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-sans font-bold tracking-[0.15em] border bg-white/50 border-accent-red text-accent-red hover:bg-accent-red hover:text-white group shadow-sm hover:shadow-md transition-all duration-300 whitespace-nowrap flex-shrink-0">
                <Mail size={16} className="flex-shrink-0 group-hover:text-white transition-colors" />
                <span>info@frisco.sk</span>
              </a>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a href="https://www.facebook.com/Friscorealitka/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center text-navy/70 hover:bg-accent-red hover:text-white hover:border-accent-red transition-all duration-300" aria-label="Facebook">
                  <Facebook size={18} strokeWidth={2} />
                </a>
                <a href="https://www.instagram.com/friscoreality/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center text-navy/70 hover:bg-accent-red hover:text-white hover:border-accent-red transition-all duration-300" aria-label="Instagram">
                  <Instagram size={18} strokeWidth={2} />
                </a>

                {/* Language Switcher */}
                <div ref={languageMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsLanguageOpen((prev) => !prev)}
                    className="w-10 h-10 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center text-navy/70 hover:bg-accent-red hover:text-white hover:border-accent-red transition-all duration-300"
                    aria-label="Change language"
                    aria-expanded={isLanguageOpen}
                  >
                    <activeLanguage.Flag className="h-3.5 w-5 rounded-[2px] object-cover shadow-sm" />
                  </button>
                  <AnimatePresence>
                    {isLanguageOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute top-full right-0 z-[100] pt-2"
                      >
                        <div className="bg-white shadow-xl border border-charcoal/8 rounded-xl overflow-hidden py-1.5 min-w-[180px] flex flex-col">
                          {LANGUAGES.map((opt) => (
                            <button
                              key={opt.code}
                              type="button"
                              className={`px-4 py-2.5 text-left text-sm font-sans font-medium hover:bg-navy/5 hover:text-navy transition-colors flex items-center gap-3 ${language === opt.code ? 'text-navy font-bold bg-navy/[0.03]' : 'text-charcoal/70'}`}
                              onClick={() => handleLanguageSelect(opt.code)}
                            >
                              <opt.Flag className="h-4 w-6 rounded-[2px] object-cover shadow-sm" />
                              {opt.label}
                              {language === opt.code && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-red" />
                              )}
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

      {/* Ponuka Backdrop */}
      <AnimatePresence>
        {isPonukaHovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/20 z-40 hidden xl:block" />
        )}
      </AnimatePresence>

      {/* Mobile Navbar */}
      <header
        className="fixed top-0 left-0 right-0 z-[120] xl:hidden flex justify-between items-center px-6 h-[80px] border-b border-black/5 transition-colors duration-300"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
        }}
      >
        <Link href={l('/')} onClick={(e) => handleNavClick(e, '/')} className="relative z-10 flex items-center">
          <img src="/frisco-logo-hq.webp" alt="FRISCO" className="h-14 w-auto object-contain transition-all duration-300" />
        </Link>
        <div className="flex items-center gap-2">
          {/* Mail button */}
          <button
            onClick={() => setConfirmDialog({ isOpen: true, actionType: 'email' })}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all duration-300 bg-navy/5 text-navy hover:bg-navy/10"
            aria-label="Email"
          >
            <Mail size={20} />
          </button>
          {/* Phone button */}
          <button
            onClick={() => setConfirmDialog({ isOpen: true, actionType: 'call' })}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all duration-300 bg-accent-red text-white hover:bg-accent-red/90 shadow-md shadow-accent-red/20"
            aria-label="Call"
          >
            <Phone size={20} />
          </button>
          {/* Menu toggle */}
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all duration-300 bg-black/5 text-black hover:bg-black/10"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - CSS transitions only, no Framer Motion */}
      <div
        className={`fixed inset-0 top-[80px] z-[55] bg-white flex flex-col xl:hidden transition-[opacity,transform] duration-300 ease-out ${isMobileMenuOpen
          ? 'opacity-100 pointer-events-auto translate-y-0'
          : 'opacity-0 pointer-events-none -translate-y-3'
          }`}
        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex-1 flex flex-col justify-center px-8 space-y-6">
          <Link href={l('/')} className="text-4xl font-serif font-bold text-navy hover:text-accent-red transition-colors block tracking-tight" onClick={(e) => handleNavClick(e, '/', true)}>
            {navCopy.home}
          </Link>

          <div className="flex flex-col">
            <button onClick={() => setIsPonukaOpen(!isPonukaOpen)} className="text-4xl font-serif font-bold text-navy hover:text-accent-red transition-colors text-left flex items-center justify-between tracking-tight">
              {navCopy.offer}
              <span className={`text-2xl transition-transform duration-300 ${isPonukaOpen ? 'rotate-180' : ''}`}>{'\u25BC'}</span>
            </button>
            {/* Ponuka submenu - CSS transition instead of AnimatePresence */}
            <div
              className={`overflow-hidden pl-4 flex flex-col space-y-4 transition-all duration-300 ease-out ${isPonukaOpen ? 'max-h-[200px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                }`}
            >
              <Link href={l('/ponuka')} className="text-lg font-sans font-semibold tracking-wide text-charcoal/80 hover:text-navy transition-colors flex items-center gap-3" onClick={(e) => handleNavClick(e, '/ponuka', true)}>
                <Search size={18} className="text-accent-red" /> {navCopy.currentOffer}
              </Link>
              <Link href={l('/chcem-predat')} className="text-lg font-sans font-semibold tracking-wide text-charcoal/80 hover:text-navy transition-colors flex items-center gap-3" onClick={(e) => handleNavClick(e, '/chcem-predat', true)}>
                <Home size={18} className="text-accent-red" /> {navCopy.sell}
              </Link>
              <Link href={l('/chcem-prenajat')} className="text-lg font-sans font-semibold tracking-wide text-charcoal/80 hover:text-navy transition-colors flex items-center gap-3" onClick={(e) => handleNavClick(e, '/chcem-prenajat', true)}>
                <Key size={18} className="text-accent-red" /> {navCopy.rent}
              </Link>
            </div>
          </div>

          <Link href={l('/preco-frisco')} className="text-4xl font-serif font-bold text-navy hover:text-accent-red transition-colors block tracking-tight" onClick={(e) => handleNavClick(e, '/preco-frisco', true)}>
            {navCopy.whyFrisco}
          </Link>
          <Link href={l('/kontakt')} className="text-4xl font-serif font-bold text-navy hover:text-accent-red transition-colors block tracking-tight" onClick={(e) => handleNavClick(e, '/kontakt', true)}>
            {navCopy.contact}
          </Link>
        </div>

        {/* Bottom: Globe + Language Switcher + CTA — CSS only */}
        <div className="p-8 border-t border-black/10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Globe size={18} className="text-navy/50 mr-1" />
            {LANGUAGES.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleLanguageSelect(opt.code)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-sans font-medium transition-all duration-200 ${language === opt.code ? 'bg-navy text-white shadow-lg' : 'bg-navy/5 text-navy/80 hover:bg-navy/10'}`}
              >
                <opt.Flag className="h-4 w-6 rounded-[2px] object-cover" />
                <span className="tracking-wide">{opt.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => { setIsMobileMenuOpen(false); setConfirmDialog({ isOpen: true, actionType: 'call' }); }}
            className="flex items-center justify-center gap-3 w-full py-4 bg-accent-red text-white text-center font-bold font-sans uppercase tracking-widest rounded-full hover:bg-accent-red/90 transition-colors shadow-lg shadow-accent-red/20"
          >
            <Phone size={20} className="mb-0.5" />
            <span>{language === 'sk' ? 'Zavolajte nám' : language === 'en' ? 'Call us' : 'Rufen Sie uns an'}</span>
          </button>
        </div>
      </div>

      {/* Confirm Action Dialog for mobile email/phone */}
      <ConfirmActionDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        actionType={confirmDialog.actionType}
      />
    </>
  );
};
