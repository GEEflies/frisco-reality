'use client';

import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n/LanguageProvider';
import Link from 'next/link';

const PRIVACY_COPY = {
  sk: {
    title: 'Ochrana osobných údajov',
    lastUpdated: 'Posledná aktualizácia: 1. január 2025',
    sections: [
      {
        heading: '1. Prevádzkovateľ',
        content: `Prevádzkovateľom osobných údajov je spoločnosť Frisco s.r.o., so sídlom Námestie Slobody 1185/30, 926 01 Sereď, IČO: 46 112 065, zapísaná v Obchodnom registri Okresného súdu Trnava.\n\nKontaktné údaje: info@frisco.sk, tel.: +421 905 447 220`,
      },
      {
        heading: '2. Aké údaje spracúvame',
        content: `Spracúvame nasledovné kategórie osobných údajov:\n\n• Identifikačné údaje: meno, priezvisko\n• Kontaktné údaje: e-mailová adresa, telefónne číslo\n• Údaje o nehnuteľnosti: adresa, typ a parametre nehnuteľnosti (ak nám ich poskytnete)\n• Technické údaje: IP adresa, typ prehliadača, cookies (viď Cookies politika)`,
      },
      {
        heading: '3. Účel a právny základ spracúvania',
        content: `Vaše osobné údaje spracúvame na tieto účely:\n\n• Sprostredkovanie predaja, kúpy alebo prenájmu nehnuteľnosti — právny základ: plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR)\n• Odpoveď na váš dopyt cez kontaktný formulár — právny základ: oprávnený záujem (čl. 6 ods. 1 písm. f) GDPR)\n• Zasielanie obchodných ponúk a noviniek — právny základ: súhlas (čl. 6 ods. 1 písm. a) GDPR)\n• Plnenie zákonných povinností — právny základ: zákonná povinnosť (čl. 6 ods. 1 písm. c) GDPR)`,
      },
      {
        heading: '4. Doba uchovávania',
        content: `Osobné údaje uchovávame po dobu nevyhnutnú na splnenie účelu spracúvania:\n\n• Údaje z kontaktného formulára: 12 mesiacov od poslednej komunikácie\n• Zmluvné údaje: 5 rokov po ukončení zmluvného vzťahu\n• Účtovné doklady: 10 rokov v súlade so zákonom o účtovníctve\n• Súhlas s marketingom: do odvolania súhlasu`,
      },
      {
        heading: '5. Príjemcovia údajov',
        content: `Vaše údaje môžeme zdieľať s:\n\n• Poskytovateľmi IT služieb (hosting, e-mail)\n• Portálom Nehnuteľnosti.sk (pri inzercii)\n• Právnymi poradcami a notármi (pri realizácii obchodu)\n• Štátnymi orgánmi (ak to vyžaduje zákon)\n\nOsobné údaje neodovzdávame do tretích krajín mimo EÚ/EHP.`,
      },
      {
        heading: '6. Vaše práva',
        content: `Máte právo:\n\n• Na prístup k vašim údajom\n• Na opravu nepresných údajov\n• Na vymazanie údajov („právo byť zabudnutý")\n• Na obmedzenie spracúvania\n• Na prenosnosť údajov\n• Namietať proti spracúvaniu\n• Kedykoľvek odvolať súhlas\n\nPre uplatnenie svojich práv nás kontaktujte na info@frisco.sk.\n\nAk sa domnievate, že spracúvanie vašich údajov porušuje nariadenie GDPR, máte právo podať sťažnosť na Úrad na ochranu osobných údajov SR (www.dataprotection.gov.sk).`,
      },
      {
        heading: '7. Bezpečnosť údajov',
        content: `Prijali sme primerané technické a organizačné opatrenia na ochranu vašich osobných údajov pred neoprávneným prístupom, zmenou, zverejnením alebo zničením.`,
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: January 1, 2025',
    sections: [
      {
        heading: '1. Data Controller',
        content: `The controller of personal data is Frisco s.r.o., registered office at Námestie Slobody 1185/30, 926 01 Sereď, Slovakia, Company ID: 46 112 065.\n\nContact: info@frisco.sk, tel.: +421 905 447 220`,
      },
      {
        heading: '2. Data We Collect',
        content: `We process the following categories of personal data:\n\n• Identification data: name, surname\n• Contact data: email address, phone number\n• Property data: address, type and parameters (if provided)\n• Technical data: IP address, browser type, cookies (see Cookie Policy)`,
      },
      {
        heading: '3. Purpose and Legal Basis',
        content: `We process your data for the following purposes:\n\n• Property brokerage services — legal basis: performance of a contract (Art. 6(1)(b) GDPR)\n• Responding to inquiries via contact form — legal basis: legitimate interest (Art. 6(1)(f) GDPR)\n• Sending commercial offers and news — legal basis: consent (Art. 6(1)(a) GDPR)\n• Compliance with legal obligations — legal basis: legal obligation (Art. 6(1)(c) GDPR)`,
      },
      {
        heading: '4. Retention Period',
        content: `We retain personal data for the period necessary to fulfill the processing purpose:\n\n• Contact form data: 12 months from last communication\n• Contractual data: 5 years after the end of the contractual relationship\n• Accounting documents: 10 years in accordance with accounting law\n• Marketing consent: until withdrawal of consent`,
      },
      {
        heading: '5. Data Recipients',
        content: `We may share your data with:\n\n• IT service providers (hosting, email)\n• Portal Nehnuteľnosti.sk (for property listings)\n• Legal advisors and notaries (during transactions)\n• State authorities (if required by law)\n\nWe do not transfer personal data to third countries outside the EU/EEA.`,
      },
      {
        heading: '6. Your Rights',
        content: `You have the right to:\n\n• Access your data\n• Rectify inaccurate data\n• Erase data ("right to be forgotten")\n• Restrict processing\n• Data portability\n• Object to processing\n• Withdraw consent at any time\n\nTo exercise your rights, contact us at info@frisco.sk.\n\nIf you believe your data processing violates GDPR, you have the right to file a complaint with the Slovak Data Protection Authority (www.dataprotection.gov.sk).`,
      },
      {
        heading: '7. Data Security',
        content: `We have implemented appropriate technical and organizational measures to protect your personal data from unauthorized access, alteration, disclosure or destruction.`,
      },
    ],
  },
  de: {
    title: 'Datenschutzerklärung',
    lastUpdated: 'Letzte Aktualisierung: 1. Januar 2025',
    sections: [
      {
        heading: '1. Verantwortlicher',
        content: `Verantwortlicher für die Verarbeitung personenbezogener Daten ist Frisco s.r.o., Námestie Slobody 1185/30, 926 01 Sereď, Slowakei, ID: 46 112 065.\n\nKontakt: info@frisco.sk, Tel.: +421 905 447 220`,
      },
      {
        heading: '2. Welche Daten wir verarbeiten',
        content: `Wir verarbeiten folgende Kategorien personenbezogener Daten:\n\n• Identifikationsdaten: Vorname, Nachname\n• Kontaktdaten: E-Mail-Adresse, Telefonnummer\n• Immobiliendaten: Adresse, Typ und Parameter (falls angegeben)\n• Technische Daten: IP-Adresse, Browsertyp, Cookies (siehe Cookie-Richtlinie)`,
      },
      {
        heading: '3. Zweck und Rechtsgrundlage',
        content: `Wir verarbeiten Ihre Daten zu folgenden Zwecken:\n\n• Immobilienvermittlung — Rechtsgrundlage: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)\n• Beantwortung von Anfragen über das Kontaktformular — Rechtsgrundlage: berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO)\n• Versand von Angeboten und Neuigkeiten — Rechtsgrundlage: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)\n• Erfüllung gesetzlicher Pflichten — Rechtsgrundlage: gesetzliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO)`,
      },
      {
        heading: '4. Speicherdauer',
        content: `Wir speichern Ihre Daten so lange, wie es für den Verarbeitungszweck erforderlich ist:\n\n• Kontaktformulardaten: 12 Monate ab letzter Kommunikation\n• Vertragsdaten: 5 Jahre nach Vertragsende\n• Buchhaltungsunterlagen: 10 Jahre gemäß Buchhaltungsgesetz\n• Marketingeinwilligung: bis zum Widerruf`,
      },
      {
        heading: '5. Datenempfänger',
        content: `Wir können Ihre Daten teilen mit:\n\n• IT-Dienstleistern (Hosting, E-Mail)\n• Portal Nehnuteľnosti.sk (Immobilienanzeigen)\n• Rechtsberatern und Notaren (bei Transaktionen)\n• Staatlichen Behörden (wenn gesetzlich vorgeschrieben)\n\nWir übertragen keine personenbezogenen Daten in Drittländer außerhalb der EU/des EWR.`,
      },
      {
        heading: '6. Ihre Rechte',
        content: `Sie haben das Recht auf:\n\n• Auskunft über Ihre Daten\n• Berichtigung ungenauer Daten\n• Löschung von Daten („Recht auf Vergessenwerden")\n• Einschränkung der Verarbeitung\n• Datenübertragbarkeit\n• Widerspruch gegen die Verarbeitung\n• Jederzeit Widerruf der Einwilligung\n\nKontaktieren Sie uns unter info@frisco.sk, um Ihre Rechte auszuüben.\n\nWenn Sie der Meinung sind, dass die Verarbeitung Ihrer Daten gegen die DSGVO verstößt, haben Sie das Recht, eine Beschwerde bei der slowakischen Datenschutzbehörde einzulegen (www.dataprotection.gov.sk).`,
      },
      {
        heading: '7. Datensicherheit',
        content: `Wir haben geeignete technische und organisatorische Maßnahmen zum Schutz Ihrer personenbezogenen Daten vor unbefugtem Zugriff, Änderung, Offenlegung oder Vernichtung getroffen.`,
      },
    ],
  },
};

export default function PrivacyContent() {
  const { language } = useLanguage();
  const copy = PRIVACY_COPY[language];

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
