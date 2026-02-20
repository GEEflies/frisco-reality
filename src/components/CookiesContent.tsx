'use client';

import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n/LanguageProvider';
import Link from 'next/link';

const COOKIES_COPY = {
  sk: {
    title: 'Cookies',
    lastUpdated: 'Posledná aktualizácia: 1. január 2025',
    sections: [
      {
        heading: '1. Čo sú cookies',
        content: `Cookies sú malé textové súbory, ktoré sa ukladajú vo vašom prehliadači pri návšteve webových stránok. Pomáhajú zabezpečiť správne fungovanie stránky, zapamätať si vaše preferencie a poskytovať relevantný obsah.`,
      },
      {
        heading: '2. Aké cookies používame',
        content: `Na našej stránke používame nasledovné typy cookies:\n\n• Nevyhnutné cookies — zabezpečujú základné funkcie stránky (napr. navigácia, jazyk). Tieto cookies nie je možné odmietnuť.\n\n• Analytické cookies — pomáhajú nám pochopiť, ako návštevníci používajú stránku. Využívame službu Vercel Analytics na meranie návštevnosti. Tieto údaje sú anonymizované.\n\n• Funkčné cookies — umožňujú zapamätať si vaše nastavenia, napríklad zvolený jazyk.`,
      },
      {
        heading: '3. Cookies tretích strán',
        content: `Na stránke môžu byť použité cookies tretích strán:\n\n• Google Fonts — na načítanie typografie\n• Supabase — na správu obsahu a funkcionalitu stránky\n• Nehnuteľnosti.sk — v prípade presmerovaní na partnerský portál`,
      },
      {
        heading: '4. Ako spravovať cookies',
        content: `Cookies môžete kedykoľvek spravovať alebo odstrániť v nastaveniach vášho prehliadača:\n\n• Chrome: Nastavenia → Ochrana osobných údajov a zabezpečenie → Cookies\n• Firefox: Nastavenia → Ochrana osobných údajov a bezpečnosť\n• Safari: Predvoľby → Ochrana osobných údajov\n• Edge: Nastavenia → Cookies a povolenia stránok\n\nOdstránenie cookies môže ovplyvniť funkčnosť niektorých častí stránky.`,
      },
      {
        heading: '5. Právny základ',
        content: `Používanie nevyhnutných cookies je založené na oprávnenom záujme prevádzkovateľa (čl. 6 ods. 1 písm. f) GDPR). Analytické a funkčné cookies používame na základe vášho súhlasu (čl. 6 ods. 1 písm. a) GDPR).\n\nViac informácií o spracúvaní osobných údajov nájdete v sekcii Ochrana osobných údajov.`,
      },
    ],
  },
  en: {
    title: 'Cookie Policy',
    lastUpdated: 'Last updated: January 1, 2025',
    sections: [
      {
        heading: '1. What Are Cookies',
        content: `Cookies are small text files stored in your browser when you visit websites. They help ensure the site works correctly, remember your preferences, and provide relevant content.`,
      },
      {
        heading: '2. Cookies We Use',
        content: `Our site uses the following types of cookies:\n\n• Essential cookies — ensure basic site functionality (e.g. navigation, language). These cookies cannot be refused.\n\n• Analytics cookies — help us understand how visitors use the site. We use Vercel Analytics for traffic measurement. This data is anonymized.\n\n• Functional cookies — remember your settings, such as your chosen language.`,
      },
      {
        heading: '3. Third-Party Cookies',
        content: `The site may use cookies from third parties:\n\n• Google Fonts — for loading typography\n• Supabase — for content management and site functionality\n• Nehnuteľnosti.sk — for redirects to the partner portal`,
      },
      {
        heading: '4. Managing Cookies',
        content: `You can manage or delete cookies at any time in your browser settings:\n\n• Chrome: Settings → Privacy and Security → Cookies\n• Firefox: Settings → Privacy & Security\n• Safari: Preferences → Privacy\n• Edge: Settings → Cookies and site permissions\n\nRemoving cookies may affect the functionality of some parts of the site.`,
      },
      {
        heading: '5. Legal Basis',
        content: `The use of essential cookies is based on the legitimate interest of the controller (Art. 6(1)(f) GDPR). We use analytics and functional cookies based on your consent (Art. 6(1)(a) GDPR).\n\nFor more information about personal data processing, see our Privacy Policy.`,
      },
    ],
  },
  de: {
    title: 'Cookie-Richtlinie',
    lastUpdated: 'Letzte Aktualisierung: 1. Januar 2025',
    sections: [
      {
        heading: '1. Was sind Cookies',
        content: `Cookies sind kleine Textdateien, die in Ihrem Browser gespeichert werden, wenn Sie Webseiten besuchen. Sie helfen, die korrekte Funktion der Website sicherzustellen, Ihre Präferenzen zu speichern und relevante Inhalte bereitzustellen.`,
      },
      {
        heading: '2. Welche Cookies wir verwenden',
        content: `Unsere Website verwendet folgende Arten von Cookies:\n\n• Notwendige Cookies — sichern die grundlegende Funktionalität der Website (z. B. Navigation, Sprache). Diese Cookies können nicht abgelehnt werden.\n\n• Analyse-Cookies — helfen uns zu verstehen, wie Besucher die Website nutzen. Wir verwenden Vercel Analytics zur Verkehrsmessung. Diese Daten sind anonymisiert.\n\n• Funktions-Cookies — merken sich Ihre Einstellungen, z. B. die gewählte Sprache.`,
      },
      {
        heading: '3. Cookies von Drittanbietern',
        content: `Die Website kann Cookies von Drittanbietern verwenden:\n\n• Google Fonts — zum Laden der Typografie\n• Supabase — für Content-Management und Website-Funktionalität\n• Nehnuteľnosti.sk — bei Weiterleitungen zum Partnerportal`,
      },
      {
        heading: '4. Cookies verwalten',
        content: `Sie können Cookies jederzeit in den Einstellungen Ihres Browsers verwalten oder löschen:\n\n• Chrome: Einstellungen → Datenschutz und Sicherheit → Cookies\n• Firefox: Einstellungen → Datenschutz & Sicherheit\n• Safari: Einstellungen → Datenschutz\n• Edge: Einstellungen → Cookies und Websiteberechtigungen\n\nDas Entfernen von Cookies kann die Funktionalität einiger Teile der Website beeinträchtigen.`,
      },
      {
        heading: '5. Rechtsgrundlage',
        content: `Die Verwendung notwendiger Cookies basiert auf dem berechtigten Interesse des Verantwortlichen (Art. 6 Abs. 1 lit. f DSGVO). Analyse- und Funktions-Cookies verwenden wir auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).\n\nWeitere Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer Datenschutzerklärung.`,
      },
    ],
  },
};

export default function CookiesContent() {
  const { language } = useLanguage();
  const copy = COOKIES_COPY[language];

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="mb-12 story-rise stagger-1">
            <Link href="/" className="text-accent-red text-sm font-mono tracking-widest uppercase hover:text-navy transition-colors mb-6 inline-block">
              ← {language === 'sk' ? 'Domov' : language === 'en' ? 'Home' : 'Startseite'}
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy tracking-tight mb-4">
              {copy.title}
            </h1>
            <p className="text-charcoal/50 text-sm">{copy.lastUpdated}</p>
          </div>

          <div className="space-y-10 story-soft stagger-2">
            {copy.sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-navy mb-4">{section.heading}</h2>
                <div className="text-charcoal/70 text-base leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
