'use client';

import { ArrowUpRight, Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
const friscoLogo = '/frisco-logo-hq.png';
import { GoogleReviewsBadge } from './GoogleReviewsBadge';
import { useLanguage } from '@/i18n/LanguageProvider';
import { FOOTER_COPY } from '@/i18n/copy';

export const Footer = () => {
  const { language } = useLanguage();
  const copy = FOOTER_COPY[language];

  return (
    <footer className="reveal bg-cream pt-12 lg:pt-24 pb-8 border-t border-navy/10 relative overflow-hidden contain-layout">

      {/* Background Noise - reduced opacity for performance */}
      <div className="absolute inset-0 bg-noise opacity-5 mix-blend-soft-light pointer-events-none will-change-auto" />

      <div className="container mx-auto max-w-[1440px] px-6 lg:px-12 relative z-10">

        {/* Single responsive grid: xl=1 row, lg=2 rows, mobile=stacked with Nav+Services side-by-side */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-8 lg:gap-x-8 lg:gap-y-10 mb-10 lg:mb-16">

          {/* COLUMN 1: LOGO & BRANDING */}
          {/* Mobile: full width, lg: 3 cols (row 1), xl: 3 cols */}
          <div className="col-span-2 lg:col-span-3 flex flex-col lg:pr-6 xl:pr-10">
            <img src={friscoLogo} alt="Frisco" loading="lazy" decoding="async" className="max-h-14 lg:max-h-20 w-auto object-contain object-left mb-6 lg:mb-8" />
            <h2 className="text-3xl sm:text-4xl xl:text-4xl font-serif font-bold text-navy leading-tight mb-8">
              {copy.title} <span className="text-accent-red italic">{copy.titleAccent}</span>
            </h2>

            <Link href="/kontakt#kontaktny-formular" className="group inline-flex items-center gap-4 text-navy hover:text-accent-red transition-colors w-fit">
              <span className="text-sm uppercase tracking-widest border-b border-navy/20 group-hover:border-accent-red pb-1 font-bold">{copy.contactUs}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          {/* COLUMN 2: NAVIGATION */}
          {/* Mobile: 1 col (side-by-side with Services), lg: 2 cols (row 1), xl: 2 cols */}
          <div className="col-span-1 lg:col-span-2 lg:pl-4 xl:pl-8">
            <h3 className="text-charcoal/50 text-sm font-semibold uppercase tracking-widest mb-6">{copy.navigation}</h3>
            <ul className="space-y-3">
              {copy.navItems.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-charcoal/80 hover:text-accent-red transition-colors text-sm lg:text-base">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: SERVICES */}
          {/* Mobile: 1 col (side-by-side with Nav), lg: 2 cols (row 1), xl: 2 cols */}
          <div className="col-span-1 lg:col-span-2 xl:pl-4">
            <h3 className="text-charcoal/50 text-sm font-semibold uppercase tracking-widest mb-6">{copy.services}</h3>
            <ul className="space-y-3">
              {copy.servicesItems.map(item => (
                <li key={item}>
                  <a href="#" className="text-charcoal/80 hover:text-accent-red transition-colors text-sm lg:text-base">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: CONTACT */}
          {/* Mobile: full width, lg: 5 cols (row 1 with Logo+Nav+Services), xl: 3 cols */}
          <div className="col-span-2 lg:col-span-5 xl:col-span-3 lg:pl-4 xl:pl-6 xl:pr-12">
            <h3 className="text-charcoal/50 text-sm font-semibold uppercase tracking-widest mb-6">{copy.contact}</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-accent-red shrink-0 mt-1" strokeWidth={1.5} />
                <span className="text-charcoal/80 text-base lg:text-lg leading-relaxed font-sans">
                  Námestie Slobody 1185/30<br />
                  926 01 Sereď
                </span>
              </li>
              <li>
                {/* Mobile: Button Style */}
                <a href="tel:+421905447220" className="lg:hidden block bg-accent-red hover:bg-accent-red/90 text-white rounded-lg px-5 py-4 transition-all shadow-md">
                  <div className="flex items-center justify-start gap-4 pl-2">
                    <Phone className="w-5 h-5 shrink-0" strokeWidth={2} />
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] uppercase tracking-widest font-bold">{copy.callUs}</span>
                      <span className="font-bold text-lg whitespace-nowrap">0905 447 220</span>
                    </div>
                  </div>
                </a>
                {/* Desktop: Button Style */}
                <a href="tel:+421905447220" className="hidden lg:block bg-accent-red hover:bg-accent-red/90 text-white rounded-lg px-5 py-3 transition-all shadow-md hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 shrink-0" strokeWidth={2} />
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] uppercase tracking-widest font-bold">{copy.callUs}</span>
                      <span className="font-bold text-lg whitespace-nowrap">0905 447 220</span>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                {/* Mobile: Outlined Button */}
                <a href="mailto:info@frisco.sk" className="lg:hidden block border-2 border-navy/20 hover:border-accent-red text-navy hover:text-accent-red rounded-lg px-5 py-4 transition-all hover:shadow-md">
                  <div className="flex items-center justify-start gap-4 pl-2">
                    <Mail className="w-5 h-5 shrink-0" strokeWidth={2} />
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] uppercase tracking-widest font-bold">{copy.writeUs}</span>
                      <span className="font-bold text-lg">info@frisco.sk</span>
                    </div>
                  </div>
                </a>
                {/* Desktop: Outlined Button */}
                <a href="mailto:info@frisco.sk" className="hidden lg:block border-2 border-navy/20 hover:border-accent-red text-navy hover:text-accent-red rounded-lg px-5 py-3 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 shrink-0" strokeWidth={2} />
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] uppercase tracking-widest font-bold">{copy.writeUs}</span>
                      <span className="font-bold text-base">info@frisco.sk</span>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: CONNECT / SOCIAL */}
          {/* Mobile: full width, lg: full 12 cols (row 2, horizontal), xl: 2 cols (single row, vertical) */}
          <div className="col-span-2 lg:col-span-12 xl:col-span-2 lg:border-t lg:border-navy/5 lg:pt-8 xl:border-0 xl:pt-0">
            <h3 className="text-charcoal/50 text-sm font-semibold uppercase tracking-widest mb-6">{copy.connect}</h3>

            {/* Horizontal at sm+, vertical at xl (narrow column) */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-8 lg:gap-12 xl:flex-col xl:gap-0">
              {/* Social Icons */}
              <div className="mb-6 sm:mb-0 xl:mb-6">
                <span className="block text-charcoal/50 text-sm font-semibold uppercase tracking-widest mb-3 lg:hidden xl:hidden">{copy.social}</span>
                <div className="flex gap-4">
                  <a href="https://www.facebook.com/Friscorealitka/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full border border-navy/15 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all" aria-label="Facebook">
                    <Facebook size={20} />
                  </a>
                  <a href="https://www.instagram.com/friscoreality/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full border border-navy/15 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all" aria-label="Instagram">
                    <Instagram size={20} />
                  </a>
                </div>
              </div>

              {/* Partner Section */}
              <div className="mb-6 sm:mb-0 xl:mb-6">
                <span className="block text-charcoal/50 text-sm font-semibold uppercase tracking-widest mb-3">{copy.partner}</span>
                <a
                  href="https://www.nehnutelnosti.sk/realitna-kancelaria/frisco-sro/centrala/inzeraty/405dc32c-f8f7-4378-8da1-fac1fbecbe6f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block opacity-90 hover:opacity-100 transition-opacity"
                >
                  <img src="/nehnutelnosti-logo.png" alt="Nehnuteľnosti.sk" loading="lazy" decoding="async" className="max-h-8 w-auto object-contain object-left" />
                </a>
              </div>

              {/* Google Reviews */}
              <div>
                <GoogleReviewsBadge />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Footer: Legal + Karchi */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center text-charcoal/40 text-xs gap-3 pt-6 border-t border-navy/5">
          {/* Row 1 (mobile) / Left (desktop): copyright on one line */}
          <p className="whitespace-nowrap">
            &copy; {new Date().getFullYear()} {copy.copyright} {copy.city}
          </p>

          {/* Row 2 (mobile) / Right (desktop): karchi + privacy + cookies */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="text-charcoal/30 text-[11px] tracking-wide">{copy.madeBy}</span>
              <a
                href="https://www.karchi.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal/40 hover:text-charcoal/80 transition-colors duration-300 text-[13px] font-black tracking-tight leading-none"
                aria-label="karchi. digital agency"
              >
                karchi.
              </a>
            </div>
            <Link href="/ochrana-osobnych-udajov" className="hover:text-navy transition-colors">{copy.privacy}</Link>
            <Link href="/cookies" className="hover:text-navy transition-colors">{copy.cookies}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
