'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowUpRight, MapPin, Phone, Mail, Clock, Instagram, Facebook, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Footer } from '@/components/Footer';
import { LocationSection } from '@/components/LocationSection';
import { useLanguage } from '@/i18n/LanguageProvider';
import { KONTAKT_COPY } from '@/i18n/copy';

const agentsHero = '/agents-hero.png';

const Kontakt = () => {
  const { language } = useLanguage();
  const copy = KONTAKT_COPY[language];
  const pageCopy = {
    sk: {
      toastTitle: 'Správa odoslaná',
      toastDescription: 'Ozveme sa vám čoskoro.',
      heroAlt: 'FRISCO Tím',
      heroQuote: '"Váš úspech je náš záväzok."',
      imagePlaceholder: 'sem dáme vašu fotku',
      visitUs: 'Navštívte nás',
      callUs: 'Zavolajte nám',
      writeUs: 'Napíšte nám',
      hours: 'Pracovná doba',
      billing: 'Fakturačné údaje',
      registryNote: 'Zapísaná v Obchodnom registri Okresného súdu Trnava, Oddiel: Sro, Vložka číslo: 21013/T',
      followUs: 'Sledujte nás',
      formBadge: 'Kontaktný formulár',
      formTitle: 'Máte otázku?',
      formAccentMobile: 'Ozvite sa',
      formAccentDesktop: 'Ozvite sa nám',
      name: 'Meno',
      namePlaceholder: 'Vaše meno',
      phone: 'Telefón',
      email: 'Email',
      emailPlaceholder: 'vas@email.sk',
      message: 'Správa',
      messagePlaceholder: 'Ako vám môžeme pomôcť?',
      submitting: 'Odosielam...',
      send: 'Odoslať správu',
      formFootnote: 'Vaše údaje sú v bezpečí. Odpovieme do 24 hodín.',
      phoneCtaLabel: 'Preferujete telefonát?',
      phoneCtaTitle: 'Zavolajte nám priamo',
      phoneCtaText: 'Radi si s vami pohovoríme osobne. Neváhajte nás kontaktovať kedykoľvek počas pracovnej doby.',
    },
    en: {
      toastTitle: 'Message sent',
      toastDescription: 'We will get back to you soon.',
      heroAlt: 'FRISCO Team',
      heroQuote: '"Your success is our commitment."',
      imagePlaceholder: 'We will replace this with your image.',
      visitUs: 'Visit us',
      callUs: 'Call us',
      writeUs: 'Write to us',
      hours: 'Business hours',
      billing: 'Billing details',
      registryNote: 'Registered in the Commercial Register of the District Court Trnava, Section: Sro, Insert No.: 21013/T',
      followUs: 'Follow us',
      formBadge: 'Contact form',
      formTitle: 'Have a question?',
      formAccentMobile: 'Reach out',
      formAccentDesktop: 'Reach out to us',
      name: 'Name',
      namePlaceholder: 'Your name',
      phone: 'Phone',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      message: 'Message',
      messagePlaceholder: 'How can we help you?',
      submitting: 'Sending...',
      send: 'Send message',
      formFootnote: 'Your data is safe. We will reply within 24 hours.',
      phoneCtaLabel: 'Prefer a call?',
      phoneCtaTitle: 'Call us directly',
      phoneCtaText: 'We are happy to talk with you personally. Feel free to contact us anytime during business hours.',
    },
    de: {
      toastTitle: 'Nachricht gesendet',
      toastDescription: 'Wir melden uns in Kürze bei Ihnen.',
      heroAlt: 'FRISCO Team',
      heroQuote: '"Ihr Erfolg ist unser Versprechen."',
      imagePlaceholder: 'Wir werden dies durch Ihr Bild ersetzen.',
      visitUs: 'Besuchen Sie uns',
      callUs: 'Rufen Sie uns an',
      writeUs: 'Schreiben Sie uns',
      hours: 'Öffnungszeiten',
      billing: 'Rechnungsdaten',
      registryNote: 'Eingetragen im Handelsregister des Bezirksgerichts Trnava, Abteilung: Sro, Einlage Nr.: 21013/T',
      followUs: 'Folgen Sie uns',
      formBadge: 'Kontaktformular',
      formTitle: 'Haben Sie eine Frage?',
      formAccentMobile: 'Melden Sie sich',
      formAccentDesktop: 'Melden Sie sich bei uns',
      name: 'Name',
      namePlaceholder: 'Ihr Name',
      phone: 'Telefon',
      email: 'E-Mail',
      emailPlaceholder: 'ihre@email.de',
      message: 'Nachricht',
      messagePlaceholder: 'Wie können wir Ihnen helfen?',
      submitting: 'Wird gesendet...',
      send: 'Nachricht senden',
      formFootnote: 'Ihre Daten sind sicher. Wir antworten innerhalb von 24 Stunden.',
      phoneCtaLabel: 'Bevorzugen Sie ein Telefonat?',
      phoneCtaTitle: 'Rufen Sie uns direkt an',
      phoneCtaText: 'Wir sprechen gerne persönlich mit Ihnen. Kontaktieren Sie uns jederzeit während der Öffnungszeiten.',
    },
  }[language];
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast({
      title: pageCopy.toastTitle,
      description: pageCopy.toastDescription,
    });
    setFormState({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-cream">
      <div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:py-32 overflow-hidden min-h-[80vh] flex items-center bg-white">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(27,58,95,0.08),transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(27,58,95,0.03),transparent_40%)] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Text Content */}
              <div className="max-w-2xl">
                <span
                  className="inline-block text-navy font-mono text-xs tracking-[0.3em] uppercase mb-6 border-b border-navy/30 pb-2 story-soft stagger-1"
                >
                  {copy.heroLabel}
                </span>

                <h1
                  className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-navy tracking-tight mb-6 story-rise stagger-2"
                >
                  {copy.heroTitleStart} <br />
                  <span className="text-accent-red italic">{copy.heroTitleAccent}</span>.
                </h1>

                <p
                  className="text-lg md:text-xl text-charcoal/70 font-light leading-relaxed mb-8 story-soft stagger-3"
                >
                  {copy.heroSubtitle}
                </p>
              </div>

              {/* Image Content - Placeholder */}
              <div
                className="relative hidden lg:flex flex-col items-center justify-center story-media stagger-4 aspect-[4/3] bg-navy/5 rounded-3xl border border-navy/10"
              >
                <h2 className="font-sans italic text-6xl text-navy mb-4 uppercase">FRISCO</h2>
                <p className="text-charcoal/60 text-center px-8 font-sans max-w-md">
                  {pageCopy.imagePlaceholder}
                </p>

                {/* Decorative Elements around image */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-navy/20 rounded-tr-3xl -z-10" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-navy/20 rounded-bl-3xl -z-10" />
              </div>

            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="reveal py-12 md:py-20 bg-cream">
          <div className="container mx-auto px-6">
            <div id="kontaktny-formular" className="text-center mb-16 md:mb-20 scroll-mt-32 story-soft stagger-1">
              <span className="block text-accent-red font-bold text-sm tracking-[0.2em] uppercase mb-4">
                {copy.sectionBadge}
              </span>
              <h2 className="text-4xl md:text-6xl font-sans font-bold text-navy leading-tight mb-6">
                {copy.sectionTitleStart} <span className="text-accent-red italic">{copy.sectionTitleAccent}</span>
              </h2>
              <p className="text-charcoal/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                {copy.sectionSubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

              {/* Left: Contact Info */}
              <div>
                {/* Contact Cards */}
                <div className="space-y-6 mb-12">
                  <ContactCard
                    icon={MapPin}
                    title={pageCopy.visitUs}
                    content={<>Námestie Slobody 30/1185<br />926 01 Sereď</>}
                  />
                  <ContactCard
                    icon={Phone}
                    title={pageCopy.callUs}
                    content={
                      <a href="tel:+421905447220" className="hover:text-accent-red transition-colors">
                        0905 447 220
                      </a>
                    }
                  />
                  <ContactCard
                    icon={Mail}
                    title={pageCopy.writeUs}
                    content={
                      <a href="mailto:info@frisco.sk" className="hover:text-accent-red transition-colors">
                        info@frisco.sk
                      </a>
                    }
                  />
                  <ContactCard
                    icon={Clock}
                    title={pageCopy.hours}
                    content={language === 'sk'
                      ? <>Po - Pi: 9:00 - 18:00<br />So: 10:00 - 14:00</>
                      : language === 'en'
                        ? <>Mon - Fri: 9:00 - 18:00<br />Sat: 10:00 - 14:00</>
                        : <>Mo - Fr: 9:00 - 18:00<br />Sa: 10:00 - 14:00</>}
                  />
                  <ContactCard
                    icon={FileText}
                    title={pageCopy.billing}
                    content={
                      <div className="text-sm space-y-1">
                        <p className="font-bold text-navy">FRISCO, s.r.o.</p>
                        <p>IČO: 43 850 553</p>
                        <p>DIČ: 2022486895</p>
                        <p className="text-[10px] text-charcoal/50 leading-tight mt-2">
                          {pageCopy.registryNote}
                        </p>
                      </div>
                    }
                  />
                </div>

                {/* Social Links */}
                <div className="pt-8 border-t border-navy/10">
                  <h4 className="text-charcoal/50 uppercase tracking-widest text-xs mb-6">{pageCopy.followUs}</h4>
                  <div className="flex gap-4">
                    <SocialLink icon={Instagram} label="Instagram" href="https://www.instagram.com/friscoreality/" />
                    <SocialLink icon={Facebook} label="Facebook" href="https://www.facebook.com/Friscorealitka/" />
                  </div>
                </div>

                {/* Google Maps */}
                <div className="mt-12 relative rounded-2xl overflow-hidden border border-navy/10 aspect-video shadow-lg">
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

              {/* Right: Contact Form */}
              <div>
                <div className="sticky top-32">
                  <div className="relative p-8 md:p-10 rounded-3xl bg-white border border-navy/10 shadow-lg">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-navy/10 to-transparent rounded-tr-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-navy/5 to-transparent rounded-bl-3xl pointer-events-none" />

                    <div className="mb-8">
                      <span className="text-navy font-mono text-[10px] tracking-[0.3em] uppercase">{pageCopy.formBadge}</span>
                      <h3 className="text-2xl md:text-3xl font-poppins font-extrabold text-navy mt-2 leading-tight">
                        {pageCopy.formTitle}{language === 'de' ? <br /> : ' '}
                        <span className="font-sans italic font-normal text-accent-red">
                          <span className="md:hidden">{pageCopy.formAccentMobile}</span>
                          <span className="hidden md:inline">{pageCopy.formAccentDesktop}</span>
                        </span>
                      </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label={pageCopy.name}
                          type="text"
                          placeholder={pageCopy.namePlaceholder}
                          value={formState.name}
                          onChange={(value) => setFormState({ ...formState, name: value })}
                          required
                        />
                        <FormInput
                          label={pageCopy.phone}
                          type="tel"
                          placeholder="+421 XXX XXX XXX"
                          value={formState.phone}
                          onChange={(value) => setFormState({ ...formState, phone: value })}
                        />
                      </div>

                      <FormInput
                        label={pageCopy.email}
                        type="email"
                        placeholder={pageCopy.emailPlaceholder}
                        value={formState.email}
                        onChange={(value) => setFormState({ ...formState, email: value })}
                        required
                      />

                      <div>
                        <label className="block text-charcoal/50 text-[10px] uppercase tracking-widest mb-3">
                          {pageCopy.message}
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={formState.message}
                          onChange={e => setFormState({ ...formState, message: e.target.value })}
                          placeholder={pageCopy.messagePlaceholder}
                          className="w-full bg-cream/50 border border-navy/10 rounded-xl px-4 py-3 text-base text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-navy/30 focus:bg-white transition-all duration-300 resize-none font-sans"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent-red text-white rounded-full overflow-hidden hover:bg-accent-red/90 transition-all duration-500 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-accent-red/20"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                        <span className="relative z-10 text-sm font-bold tracking-widest uppercase">
                          {isSubmitting ? pageCopy.submitting : pageCopy.send}
                        </span>
                        <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>

                      <p className="text-charcoal/40 text-xs text-center mt-4">
                        {pageCopy.formFootnote}
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Find Us - Sereď Location */}
        <LocationSection />

        {/* CTA Section */}
        <section className="reveal py-12 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl bg-gradient-to-br from-navy/5 via-cream to-cream border border-navy/10 p-6 md:p-20 text-center overflow-hidden shadow-lg"
            >
              {/* Background decoration */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-navy/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <span className="text-navy font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
                  {pageCopy.phoneCtaLabel}
                </span>
                <h2 className="text-3xl md:text-6xl font-sans font-bold text-navy tracking-tight mb-6">
                  {pageCopy.phoneCtaTitle}
                </h2>
                <p className="text-charcoal/60 text-lg mb-8 max-w-xl mx-auto">
                  {pageCopy.phoneCtaText}
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

// Helper Components
const ContactCard = ({ icon: Icon, title, content }: { icon: any; title: string; content: React.ReactNode }) => (
  <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-navy/10 hover:border-navy/20 transition-colors shadow-sm">
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

const FormInput = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) => (
  <div>
    <label className="block text-charcoal/50 text-[10px] uppercase tracking-widest mb-3">
      {label}
    </label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-cream/50 border border-navy/10 rounded-xl px-4 py-3 text-base text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-navy/30 focus:bg-white transition-all duration-300 font-sans"
    />
  </div>
);

export default Kontakt;
