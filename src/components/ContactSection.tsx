'use client';

import { MapPin, Phone, Mail, Clock, Instagram, Facebook, FileText } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { useLanguage } from '@/i18n/LanguageProvider';
import { CONTACT_SECTION_COPY } from '@/i18n/copy';

export const ContactSection = () => {
  const { language } = useLanguage();
  const copy = CONTACT_SECTION_COPY[language];
  const sectionCopy = {
    sk: {
      closed: 'Zatvorené',
      registryNote: 'Zapísaná v Obchodnom registri Okresného súdu Trnava, Oddiel: Sro, Vložka číslo: 21013/T',
    },
    en: {
      closed: 'Closed',
      registryNote: 'Registered in the Commercial Register of the District Court Trnava, Section: Sro, Insert No.: 21013/T',
    },
    de: {
      closed: 'Geschlossen',
      registryNote: 'Eingetragen im Handelsregister des Bezirksgerichts Trnava, Abteilung: Sro, Einlage Nr.: 21013/T',
    },
  }[language];

  return (
    <section className="reveal relative z-20 py-12 md:pb-20 md:pt-48 bg-cream" id="kontakt">
      <div className="container mx-auto px-6">

        {/* Section Header — CTA */}
        <div
          id="kontaktny-formular"
          className="reveal text-center mb-16 md:mb-20 scroll-mt-32"
        >
          <span className="rv-child block text-accent-red font-bold text-sm tracking-[0.2em] uppercase mb-4">
            {copy.badge}
          </span>
          <h2 className="rv-child text-4xl md:text-6xl font-serif font-bold text-navy leading-tight mb-6">
            {copy.titleStart} <span className="text-accent-red italic">{copy.titleAccent}</span>
          </h2>
          <p className="rv-child text-charcoal/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {copy.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">


          {/* Left: Contact Info */}
          <div className="reveal reveal-delay-1">
            {/* Contact Cards */}
            <div className="space-y-6 mb-12">
              <ContactCard
                icon={MapPin}
                title={copy.visit}
                content={<>Námestie Slobody 1185/30<br />926 01 Sereď</>}
              />
              <ContactCard
                icon={Phone}
                title={copy.call}
                content={
                  <a href="tel:+421905447220" className="hover:text-accent-red transition-colors">
                    0905 447 220
                  </a>
                }
              />
              <ContactCard
                icon={Mail}
                title={copy.write}
                content={
                  <a href="mailto:info@frisco.sk" className="hover:text-accent-red transition-colors">
                    info@frisco.sk
                  </a>
                }
              />
              <ContactCard
                icon={Clock}
                title={copy.hours}
                content={
                  <>
                    <span className="font-bold">{copy.weekdays}</span> 9:00 - 17:00<br />
                    <span className="font-bold">{copy.weekend}</span> {sectionCopy.closed}
                  </>
                }
              />
              <ContactCard
                icon={FileText}
                title={copy.billing}
                content={
                  <div className="text-sm space-y-1">
                    <p className="font-bold text-navy">FRISCO, s.r.o.</p>
                    <p>IČO: 43 850 553</p>
                    <p>DIČ: 2022486895</p>
                    <p className="text-[10px] text-charcoal/50 leading-tight mt-2">
                      {sectionCopy.registryNote}
                    </p>
                  </div>
                }
              />
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-navy/10">
              <h4 className="text-charcoal/50 uppercase tracking-widest text-xs mb-6">{copy.follow}</h4>
              <div className="flex gap-4">
                <SocialLink icon={Instagram} label="Instagram" href="https://www.instagram.com/friscoreality/" />
                <SocialLink icon={Facebook} label="Facebook" href="https://www.facebook.com/Friscorealitka/" />
              </div>
            </div>

            {/* Google Maps */}
            <div className="mt-12 relative rounded-2xl overflow-hidden border border-navy/10 h-[400px] shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2654.85566300157!2d17.737541377024726!3d48.28639262126042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476b67bf84ae3c39%3A0xaabf0d6bfbcef097!2sFRISCO%2C%20s.r.o.%20-%20realitn%C3%A1%20kancel%C3%A1ria!5e0!3m2!1ssk!2ssk!4v1768663122983!5m2!1ssk!2ssk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          {/* Right: Contact Form — sticky */}
          <div className="lg:sticky lg:top-28 self-start">
            <div className="reveal reveal-delay-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper Components
const ContactCard = ({ icon: Icon, title, content }: { icon: any; title: string; content: React.ReactNode }) => (
  <div
    className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-navy/10 hover:border-navy/20 transition-colors shadow-sm"
  >
    <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-navy" />
    </div>
    <div>
      <h4 className="text-charcoal/50 uppercase tracking-widest text-[10px] mb-2">{title}</h4>
      <div className="text-charcoal font-sans text-lg">{content}</div>
    </div>
  </div>
);

const SocialLink = ({ icon: Icon, label, href }: { icon: any; label: string; href: string }) => (
  <a
    href={href}
    className="group flex items-center gap-2 px-4 py-2 rounded-full border border-navy/10 hover:border-navy/30 hover:bg-navy/5 transition-all"
  >
    <Icon className="w-4 h-4 text-charcoal/60 group-hover:text-navy transition-colors" />
    <span className="text-sm text-charcoal/60 group-hover:text-navy transition-colors">{label}</span>
  </a>
);
