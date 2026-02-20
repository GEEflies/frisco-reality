import type { LanguageCode } from '@/i18n/types';

export const NAVBAR_COPY: Record<LanguageCode, {
  home: string;
  offer: string;
  currentOffer: string;
  sell: string;
  rent: string;
  whyFrisco: string;
  contact: string;
  ownerHeader: string;
  seekerHeader: string;
  phoneCta: string;
  emailCta: string;
}> = {
  sk: {
    home: 'Domov',
    offer: 'Ponuka',
    currentOffer: 'Aktuálna ponuka',
    sell: 'Chcem predať',
    rent: 'Chcem prenajať',
    whyFrisco: 'Prečo Frisco?',
    contact: 'Kontakt',
    ownerHeader: 'Chcem svoju nehnuteľnosť',
    seekerHeader: 'Chcem si nehnuteľnosť',
    phoneCta: '0905 447 220',
    emailCta: 'info@frisco.sk',
  },
  en: {
    home: 'Home',
    offer: 'Listings',
    currentOffer: 'Current listings',
    sell: 'I want to sell',
    rent: 'I want to rent',
    whyFrisco: 'Why Frisco?',
    contact: 'Contact',
    ownerHeader: 'I own a property',
    seekerHeader: 'I am looking for property',
    phoneCta: '0905 447 220',
    emailCta: 'info@frisco.sk',
  },
  de: {
    home: 'Startseite',
    offer: 'Angebot',
    currentOffer: 'Aktuelle Angebote',
    sell: 'Ich möchte verkaufen',
    rent: 'Ich möchte vermieten',
    whyFrisco: 'Warum Frisco?',
    contact: 'Kontakt',
    ownerHeader: 'Ich habe eine Immobilie',
    seekerHeader: 'Ich suche eine Immobilie',
    phoneCta: '0905 447 220',
    emailCta: 'info@frisco.sk',
  },
};

export const HERO_DESKTOP_COPY: Record<LanguageCode, {
  label: string;
  titleLine1: string;
  titleLine3?: string;
  verbs: string[];
  subtitle: string;
  offerLong: string;
  offerShort: string;
  sellLong: string;
  sellShort: string;
  rentLong: string;
  rentShort: string;
}> = {
  sk: {
    label: 'Exkluzívna realitná kancelária v Seredi',
    titleLine1: 'Vašu nehnuteľnosť',
    verbs: ['nájdeme', 'nafotíme', 'odprezentujeme', 'prenajmeme', 'predáme', 'alebo odkúpime'],
    subtitle: 'Už 18 rokov pomáhame majiteľom predať a prenajať ich nehnuteľnosti za najlepších podmienok a záujemcom nájsť miesto, ktoré môžu nazývať domovom.',
    offerLong: 'Pozrieť aktuálnu ponuku',
    offerShort: 'Ponuka',
    sellLong: 'Chcem predať nehnuteľnosť',
    sellShort: 'Chcem predať',
    rentLong: 'Chcem prenajať svoju nehnuteľnosť',
    rentShort: 'Chcem prenajať',
  },
  en: {
    label: 'Exclusive real estate agency in Sereď',
    titleLine1: 'We will',
    titleLine3: 'your property',
    verbs: ['find', 'photograph', 'present', 'rent out', 'sell', 'or buy'],
    subtitle: 'For 18 years we have helped owners sell and rent their properties under the best conditions and helped buyers find a place they can call home.',
    offerLong: 'View current listings',
    offerShort: 'Listings',
    sellLong: 'I want to sell my property',
    sellShort: 'I want to sell',
    rentLong: 'I want to rent out my property',
    rentShort: 'I want to rent',
  },
  de: {
    label: 'Exklusive Immobilienagentur in Sereď',
    titleLine1: 'Ihre Immobilie',
    verbs: ['finden wir', 'fotografieren wir', 'präsentieren wir', 'vermieten wir', 'verkaufen wir', 'oder kaufen wir'],
    subtitle: 'Seit 18 Jahren helfen wir Eigentümern, ihre Immobilien zu den besten Bedingungen zu verkaufen und zu vermieten, und Interessenten, ein Zuhause zu finden.',
    offerLong: 'Aktuelle Angebote ansehen',
    offerShort: 'Angebot',
    sellLong: 'Ich möchte meine Immobilie verkaufen',
    sellShort: 'Ich möchte verkaufen',
    rentLong: 'Ich möchte meine Immobilie vermieten',
    rentShort: 'Ich möchte vermieten',
  },
};

export const HERO_MOBILE_COPY: Record<LanguageCode, {
  label: string;
  title: string;
  verbPrefix?: string;
  verbs: string[];
  subtitle: string;
  offer: string;
  sell: string;
  rent: string;
}> = {
  sk: {
    label: 'Exkluzívna realitka v Seredi',
    title: 'Vašu nehnuteľnosť',
    verbs: ['nájdeme', 'nafotíme', 'odprezentujeme', 'prenajmeme', 'predáme', 'alebo odkúpime'],
    subtitle: 'Už 18 rokov pomáhame majiteľom predať a prenajať ich nehnuteľnosti za najlepších podmienok a klientom nájsť miesto, ktoré môžu nazývať domovom.',
    offer: 'Pozrieť aktuálnu ponuku',
    sell: 'Chcem predať',
    rent: 'Chcem prenajať',
  },
  en: {
    label: 'Exclusive real estate agency in Sereď',
    title: 'Your property will',
    verbPrefix: 'be',
    verbs: ['found', 'photographed', 'presented', 'rented out', 'sold', 'or bought'],
    subtitle: 'For 18 years we have helped owners sell and rent under the best conditions and helped clients find a place they can call home.',
    offer: 'View current listings',
    sell: 'I want to sell',
    rent: 'I want to rent',
  },
  de: {
    label: 'Exklusive Immobilienagentur in Sereď',
    title: 'Ihre Immobilie',
    verbPrefix: '',
    verbs: ['wird gefunden', 'wird fotografiert', 'wird präsentiert', 'wird vermietet', 'wird verkauft', 'oder gekauft'],
    subtitle: 'Seit 18 Jahren helfen wir Eigentümern beim Verkauf und der Vermietung zu besten Bedingungen und Kunden beim Finden eines Zuhauses.',
    offer: 'Aktuelle Angebote ansehen',
    sell: 'Ich möchte verkaufen',
    rent: 'Ich möchte vermieten',
  },
};

export const CHCEM_PREDAT_HERO_COPY: Record<LanguageCode, {
  label: string;
  titleStart: string;
  titleAccent: string;
  subtitle: string;
  cta: string;
}> = {
  sk: {
    label: 'Predajte za cenu, ktorá dáva zmysel.',
    titleStart: 'Vy riešite svoj život, my riešime',
    titleAccent: 'predaj',
    subtitle: 'Predaj nie je len o inzeráte. Je to o správnej cene, prezentácii a vyjednávaní. My nastavíme proces tak, aby ste predali dobre a bez zbytočných chýb.',
    cta: 'Chcem predať nehnuteľnosť',
  },
  en: {
    label: 'Sell at a price that truly makes sense.',
    titleStart: 'You handle your life, we handle the',
    titleAccent: 'sale',
    subtitle: 'Selling is not just an ad. It is pricing, presentation and negotiation. We set the process so you sell well and without costly mistakes.',
    cta: 'I want to sell my property',
  },
  de: {
    label: 'Verkaufen Sie zu einem Preis, der Sinn ergibt.',
    titleStart: 'Sie leben Ihr Leben, wir kümmern uns um den',
    titleAccent: 'Verkauf',
    subtitle: 'Verkaufen ist mehr als ein Inserat. Es geht um Preis, Präsentation und Verhandlung. Wir setzen den Prozess so auf, dass Sie gut und ohne Fehler verkaufen.',
    cta: 'Ich möchte meine Immobilie verkaufen',
  },
};

export const CHCEM_PRENAJAT_HERO_COPY: Record<LanguageCode, {
  label: string;
  titleStart: string;
  titleAccent: string;
  subtitle: string;
  secondary: string;
  cta: string;
}> = {
  sk: {
    label: 'Prenájom nehnuteľnosti',
    titleStart: 'Prenajmite',
    titleAccent: 'bez starostí.',
    subtitle: 'Máte byt alebo dom na prenájom? Postaráme sa o všetko – od výberu nájomníka až po pravidelnú kontrolu platieb.',
    secondary: 'Žiadne naháňanie nájomníkov. Žiadne zbytočné telefonáty. Žiadne stratené víkendy.',
    cta: 'Chcem prenajať svoju nehnuteľnosť',
  },
  en: {
    label: 'Property rental service',
    titleStart: 'Rent out',
    titleAccent: 'without stress.',
    subtitle: 'Do you have an apartment or house for rent? We handle everything—from tenant selection to payment control.',
    secondary: 'No chasing tenants. No unnecessary calls. No lost weekends.',
    cta: 'I want to rent out my property',
  },
  de: {
    label: 'Immobilienvermietung',
    titleStart: 'Vermieten Sie',
    titleAccent: 'ohne Sorgen.',
    subtitle: 'Sie haben eine Wohnung oder ein Haus zu vermieten? Wir kümmern uns um alles – von der Mieterauswahl bis zur Zahlungskontrolle.',
    secondary: 'Kein Hinterherlaufen. Keine unnötigen Anrufe. Keine verlorenen Wochenenden.',
    cta: 'Ich möchte meine Immobilie vermieten',
  },
};

export const WHY_FRISCO_COPY: Record<LanguageCode, {
  badge: string;
  title: string;
  accent: string;
  subtitleDesktop: string;
  subtitleMobile: string;
  bridge: string;
  ownerHeader: string;
  seekerHeader: string;
  ownerSellLabel: string;
  ownerRentLabel: string;
  seekerBuyLabel: string;
  seekerRentLabel: string;
}> = {
  sk: {
    badge: 'Prečo Frisco?',
    title: 'Komplexné',
    accent: 'riešenia',
    subtitleDesktop: 'Či predávate, kupujete alebo prenajímate — vieme, čo potrebujete. Vyberte si svoju situáciu.',
    subtitleMobile: 'Či predávate, kupujete alebo prenajímate, toto sú dôvody, prečo si vybrať FRISCO:',
    bridge: 'Vyberte si, čo riešite ↓',
    ownerHeader: 'Chcem svoju nehnuteľnosť',
    seekerHeader: 'Chcem si nehnuteľnosť',
    ownerSellLabel: 'Predať',
    ownerRentLabel: 'Prenajať',
    seekerBuyLabel: 'Kúpiť',
    seekerRentLabel: 'Prenajať',
  },
  en: {
    badge: 'Why Frisco?',
    title: 'Complete',
    accent: 'solutions',
    subtitleDesktop: 'Whether you sell, buy, or rent, we know what you need. Choose your situation.',
    subtitleMobile: 'Whether you sell, buy, or rent, here is why to choose FRISCO:',
    bridge: 'Choose your situation ↓',
    ownerHeader: 'I own a property',
    seekerHeader: 'I am looking for property',
    ownerSellLabel: 'Sell',
    ownerRentLabel: 'Rent out',
    seekerBuyLabel: 'Buy',
    seekerRentLabel: 'Rent',
  },
  de: {
    badge: 'Warum Frisco?',
    title: 'Komplette',
    accent: 'Lösungen',
    subtitleDesktop: 'Ob Verkauf, Kauf oder Vermietung – wir wissen, was Sie brauchen. Wählen Sie Ihre Situation.',
    subtitleMobile: 'Ob Verkauf, Kauf oder Vermietung – darum lohnt sich FRISCO:',
    bridge: 'Wählen Sie Ihre Situation ↓',
    ownerHeader: 'Ich habe eine Immobilie',
    seekerHeader: 'Ich suche eine Immobilie',
    ownerSellLabel: 'Verkaufen',
    ownerRentLabel: 'Vermieten',
    seekerBuyLabel: 'Kaufen',
    seekerRentLabel: 'Mieten',
  },
};

export const KONTAKT_COPY: Record<LanguageCode, {
  heroLabel: string;
  heroTitleStart: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  sectionBadge: string;
  sectionTitleStart: string;
  sectionTitleAccent: string;
  sectionSubtitle: string;
}> = {
  sk: {
    heroLabel: 'Kontaktujte nás',
    heroTitleStart: 'Poďme spolu',
    heroTitleAccent: 'spolupracovať',
    heroSubtitle: 'Sme tu pre vás. Či už predávate, kupujete alebo len hľadáte radu – radi vám pomôžeme s akoukoľvek otázkou.',
    sectionBadge: 'Napíšte nám',
    sectionTitleStart: 'Neváhajte nás',
    sectionTitleAccent: 'kontaktovať',
    sectionSubtitle: 'Či už predávate nehnuteľnosť, hľadáte nový domov alebo len premýšľate o ďalšom kroku, sme tu.',
  },
  en: {
    heroLabel: 'Contact us',
    heroTitleStart: 'Let us',
    heroTitleAccent: 'work together',
    heroSubtitle: 'We are here for you. Whether you sell, buy or simply need advice, we will gladly help with any question.',
    sectionBadge: 'Write to us',
    sectionTitleStart: 'Do not hesitate to',
    sectionTitleAccent: 'contact us',
    sectionSubtitle: 'Whether you are selling, searching for a new home, or planning your next step, we are here.',
  },
  de: {
    heroLabel: 'Kontaktieren Sie uns',
    heroTitleStart: 'Lassen Sie uns',
    heroTitleAccent: 'zusammenarbeiten',
    heroSubtitle: 'Wir sind für Sie da. Ob Verkauf, Kauf oder nur eine Frage – wir helfen Ihnen gerne weiter.',
    sectionBadge: 'Schreiben Sie uns',
    sectionTitleStart: 'Zögern Sie nicht, uns',
    sectionTitleAccent: 'zu kontaktieren',
    sectionSubtitle: 'Ob Sie verkaufen, ein neues Zuhause suchen oder den nächsten Schritt planen – wir sind für Sie da.',
  },
};

export const MAIN_LISTINGS_COPY: Record<LanguageCode, {
  badge: string;
  title: string;
  cta: string;
  cards: Array<{ badge: string; title: string; price: string; location: string; area: string; rooms: string }>;
}> = {
  sk: {
    badge: 'Exkluzívny výber',
    title: 'Aktuálna ponuka',
    cta: 'Zobraziť celú ponuku',
    cards: [
      { badge: 'Na predaj', title: 'Rodinný dom · Sereď', price: '––– €', location: 'Sereď, Galanta', area: '120 m²', rooms: '4 izby' },
      { badge: 'Prenájom', title: 'Byt · Centrum', price: '––– €/mes.', location: 'Sereď, Galanta', area: '65 m²', rooms: '2 izby' },
      { badge: 'Novostavba', title: 'Novostavba · Exkluzívne', price: '––– €', location: 'Sereď, Galanta', area: '95 m²', rooms: '3 izby' },
    ],
  },
  en: {
    badge: 'Exclusive selection',
    title: 'Current listings',
    cta: 'View all listings',
    cards: [
      { badge: 'For sale', title: 'Family house · Sered', price: '––– €', location: 'Sered, Galanta', area: '120 m²', rooms: '4 rooms' },
      { badge: 'For rent', title: 'Apartment · Center', price: '––– €/month', location: 'Sered, Galanta', area: '65 m²', rooms: '2 rooms' },
      { badge: 'New build', title: 'New build · Exclusive', price: '––– €', location: 'Sered, Galanta', area: '95 m²', rooms: '3 rooms' },
    ],
  },
  de: {
    badge: 'Exklusive Auswahl',
    title: 'Aktuelle Angebote',
    cta: 'Alle Angebote anzeigen',
    cards: [
      { badge: 'Zu verkaufen', title: 'Einfamilienhaus · Sered', price: '––– €', location: 'Sered, Galanta', area: '120 m²', rooms: '4 Zimmer' },
      { badge: 'Zu vermieten', title: 'Wohnung · Zentrum', price: '––– €/Monat', location: 'Sered, Galanta', area: '65 m²', rooms: '2 Zimmer' },
      { badge: 'Neubau', title: 'Neubau · Exklusiv', price: '––– €', location: 'Sered, Galanta', area: '95 m²', rooms: '3 Zimmer' },
    ],
  },
};

export const ABOUT_COPY: Record<LanguageCode, {
  label: string;
  titleLine1: string;
  titleAccent: string;
  description: string;
  cta: string;
  features: Array<{ id: string; title: string; description: string; stat: string; statLabel: string }>;
}> = {
  sk: {
    label: 'Prečo Frisco? / Manifesto',
    titleLine1: 'My sme',
    titleAccent: 'FRISCO.',
    description: 'Sme rodinná firma a za každým obchodom vidíme človeka, nie províziu.',
    cta: 'Zavolajte nám',
    features: [
      { id: '01', title: 'Transparentnosť', description: 'Žiadne skryté poplatky, žiadne nepríjemné prekvapenia. Vždy viete, čo sa deje a aké sú ďalšie kroky. Otvorená komunikácia je pre nás samozrejmosťou.', stat: '100 %', statLabel: 'transparentnosť' },
      { id: '02', title: 'Osobný prístup', description: 'Každý klient má svojho realitného agenta, ktorý pozná jeho situáciu aj priority. Nie ste číslo v databáze, ale náš partner.', stat: 'Individuálny', statLabel: 'prístup ku každému klientovi' },
      { id: '03', title: 'Odborná expertíza', description: '18 rokov skúseností na lokálnom trhu nám umožňujú správne nastaviť cenu, vyjednávať podmienky a chrániť vaše záujmy.', stat: '18+', statLabel: 'rokov na trhu' },
    ],
  },
  en: {
    label: 'Why Frisco? / Manifesto',
    titleLine1: 'We are',
    titleAccent: 'FRISCO.',
    description: 'We are a family business and behind every deal we see a person, not a commission.',
    cta: 'Call us',
    features: [
      { id: '01', title: 'Transparency', description: 'No hidden fees, no unpleasant surprises. You always know what is happening and what comes next. Open communication is our standard.', stat: '100%', statLabel: 'transparency' },
      { id: '02', title: 'Personal approach', description: 'Every client has a dedicated agent who understands their situation and priorities. You are not a number in a database—you are our partner.', stat: 'Personal', statLabel: 'approach to every client' },
      { id: '03', title: 'Professional expertise', description: '18 years of local market experience helps us price correctly, negotiate terms, and protect your interests.', stat: '18+', statLabel: 'years on the market' },
    ],
  },
  de: {
    label: 'Warum Frisco? / Manifest',
    titleLine1: 'Wir sind',
    titleAccent: 'FRISCO.',
    description: 'Wir sind ein Familienunternehmen und sehen hinter jedem Geschäft einen Menschen, nicht nur eine Provision.',
    cta: 'Rufen Sie uns an',
    features: [
      { id: '01', title: 'Transparenz', description: 'Keine versteckten Gebühren, keine unangenehmen Überraschungen. Sie wissen immer, was passiert und was als Nächstes kommt. Offene Kommunikation ist für uns selbstverständlich.', stat: '100 %', statLabel: 'Transparenz' },
      { id: '02', title: 'Persönlicher Ansatz', description: 'Jeder Kunde hat einen festen Makler, der seine Situation und Prioritäten kennt. Sie sind keine Nummer in einer Datenbank, sondern unser Partner.', stat: 'Individuell', statLabel: 'für jeden Kunden' },
      { id: '03', title: 'Fachliche Expertise', description: '18 Jahre Erfahrung am lokalen Markt helfen uns, den Preis richtig festzulegen, Bedingungen zu verhandeln und Ihre Interessen zu schützen.', stat: '18+', statLabel: 'Jahre am Markt' },
    ],
  },
};

export const PROCESS_COPY: Record<LanguageCode, {
  badge: string;
  titleStart: string;
  titleAccent: string;
  steps: Array<{ number: string; title: string; description: string }>;
}> = {
  sk: {
    badge: 'Náš Postup',
    titleStart: 'Ako to u nás',
    titleAccent: 'funguje',
    steps: [
      { number: '01', title: 'Prvé stretnutie', description: 'Začneme nezáväzným rozhovorom. Či už chcete predať, prenajať alebo hľadáte nové bývanie, najskôr si vypočujeme vaše predstavy a ciele.' },
      { number: '02', title: 'Dohodneme si plán', description: 'Navrhneme konkrétny postup podľa vašej situácie. Majiteľom nastavíme správnu cenu a stratégiu predaja/prenájmu. Záujemcom pomôžeme nájsť nehnuteľnosť, ktorá dáva zmysel ich potrebám aj rozpočtu.' },
      { number: '03', title: 'O všetko sa postaráme', description: 'Postaráme sa o celý proces. Od profesionálnej prezentácie a komunikácie so záujemcami až po vyhľadávanie vhodných ponúk a organizovanie obhliadok. Vy sa môžete sústrediť na to podstatné.' },
      { number: '04', title: 'Dotiahneme to do konca', description: 'Zabezpečíme právny servis, zmluvy aj bezpečný prevod. Sprevádzame vás až do momentu, keď sú podpísané papiere a odovzdané kľúče.' },
    ],
  },
  en: {
    badge: 'Our Process',
    titleStart: 'How it',
    titleAccent: 'works',
    steps: [
      { number: '01', title: 'Initial meeting', description: 'We start with a no-obligation conversation. Whether you want to sell, rent out, or find a new home, we first understand your goals.' },
      { number: '02', title: 'We define a plan', description: 'We design a clear plan for your situation. For owners we set pricing and strategy, and for seekers we find homes matching needs and budget.' },
      { number: '03', title: 'We handle everything', description: 'We manage the full process—from professional presentation and communication to searching offers and arranging viewings.' },
      { number: '04', title: 'We close the deal', description: 'We secure legal support, contracts, and a safe transfer. We guide you through to signed documents and handover of keys.' },
    ],
  },
  de: {
    badge: 'Unser Ablauf',
    titleStart: 'So',
    titleAccent: 'funktioniert es',
    steps: [
      { number: '01', title: 'Erstgespräch', description: 'Wir beginnen mit einem unverbindlichen Gespräch. Ob Verkauf, Vermietung oder Suche – zuerst verstehen wir Ihre Ziele.' },
      { number: '02', title: 'Plan festlegen', description: 'Wir erstellen einen klaren Plan für Ihre Situation. Für Eigentümer setzen wir Preis und Strategie, für Suchende finden wir passende Angebote.' },
      { number: '03', title: 'Wir übernehmen alles', description: 'Wir steuern den gesamten Prozess – von Präsentation und Kommunikation bis zur Angebotssuche und Organisation von Besichtigungen.' },
      { number: '04', title: 'Bis zum Abschluss', description: 'Wir sichern Rechtsservice, Verträge und eine sichere Abwicklung. Wir begleiten Sie bis zur Unterzeichnung und Schlüsselübergabe.' },
    ],
  },
};

export const CONTACT_SECTION_COPY: Record<LanguageCode, {
  badge: string;
  titleStart: string;
  titleAccent: string;
  subtitle: string;
  visit: string;
  call: string;
  write: string;
  hours: string;
  billing: string;
  follow: string;
  weekdays: string;
  weekend: string;
}> = {
  sk: {
    badge: 'Napíšte nám',
    titleStart: 'Neváhajte nás',
    titleAccent: 'kontaktovať',
    subtitle: 'Či už predávate nehnuteľnosť, hľadáte nový domov alebo len premýšľate o ďalšom kroku, sme tu.',
    visit: 'Navštívte nás',
    call: 'Zavolajte nám',
    write: 'Napíšte nám',
    hours: 'Pracovná doba',
    billing: 'Fakturačné údaje',
    follow: 'Sledujte nás',
    weekdays: 'Po - Pi:',
    weekend: 'So - Ne:',
  },
  en: {
    badge: 'Write to us',
    titleStart: 'Do not hesitate to',
    titleAccent: 'contact us',
    subtitle: 'Whether you are selling, searching for a new home, or planning your next step, we are here.',
    visit: 'Visit us',
    call: 'Call us',
    write: 'Email us',
    hours: 'Working hours',
    billing: 'Billing details',
    follow: 'Follow us',
    weekdays: 'Mon - Fri:',
    weekend: 'Sat - Sun:',
  },
  de: {
    badge: 'Schreiben Sie uns',
    titleStart: 'Zögern Sie nicht, uns',
    titleAccent: 'zu kontaktieren',
    subtitle: 'Ob Sie verkaufen, ein neues Zuhause suchen oder den nächsten Schritt planen – wir sind für Sie da.',
    visit: 'Besuchen Sie uns',
    call: 'Rufen Sie uns an',
    write: 'Schreiben Sie uns',
    hours: 'Öffnungszeiten',
    billing: 'Rechnungsdaten',
    follow: 'Folgen Sie uns',
    weekdays: 'Mo - Fr:',
    weekend: 'Sa - So:',
  },
};

export const FOOTER_COPY: Record<LanguageCode, {
  title: string;
  titleAccent: string;
  contactUs: string;
  navigation: string;
  services: string;
  contact: string;
  connect: string;
  social: string;
  partner: string;
  callUs: string;
  writeUs: string;
  copyright: string;
  city: string;
  privacy: string;
  cookies: string;
  madeBy: string;
  navItems: Array<{ label: string; href: string }>;
  servicesItems: string[];
}> = {
  sk: {
    title: 'O vašu nehnuteľnosť sa postaráme ako o',
    titleAccent: 'vlastnú.',
    contactUs: 'Kontaktujte nás',
    navigation: 'Navigácia',
    services: 'Služby',
    contact: 'Kontakt',
    connect: 'Spojte sa s nami',
    social: 'Sociálne siete',
    partner: 'Spolupracujeme s portálom',
    callUs: 'Zavolajte nám',
    writeUs: 'Alebo nám napíšte',
    copyright: 'Frisco. Rodinná firma, nie korporát.',
    city: 'Sereď & Nitra',
    privacy: 'Ochrana osobných údajov',
    cookies: 'Cookies',
    madeBy: 'Vytvorené s láskou od',
    navItems: [
      { label: 'Domov', href: '/' },
      { label: 'Prečo Frisco?', href: '/preco-frisco' },
      { label: 'Ponuka', href: '/ponuka' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    servicesItems: ['Predaj nehnuteľností', 'Prenájom', 'Development', 'Investície'],
  },
  en: {
    title: 'We care for your property as if it were our',
    titleAccent: 'own.',
    contactUs: 'Contact us',
    navigation: 'Navigation',
    services: 'Services',
    contact: 'Contact',
    connect: 'Connect with us',
    social: 'Social networks',
    partner: 'We cooperate with portal',
    callUs: 'Call us',
    writeUs: 'Or write to us',
    copyright: 'Frisco. A family business, not a corporation.',
    city: 'Sereď & Nitra',
    privacy: 'Privacy policy',
    cookies: 'Cookies',
    madeBy: 'Made with love by',
    navItems: [
      { label: 'Home', href: '/' },
      { label: 'Why Frisco?', href: '/preco-frisco' },
      { label: 'Listings', href: '/ponuka' },
      { label: 'Contact', href: '/kontakt' },
    ],
    servicesItems: ['Property sales', 'Rentals', 'Development', 'Investments'],
  },
  de: {
    title: 'Wir kümmern uns um Ihre Immobilie wie um unsere',
    titleAccent: 'eigene.',
    contactUs: 'Kontaktieren Sie uns',
    navigation: 'Navigation',
    services: 'Dienstleistungen',
    contact: 'Kontakt',
    connect: 'Verbinden Sie sich mit uns',
    social: 'Soziale Netzwerke',
    partner: 'Wir kooperieren mit dem Portal',
    callUs: 'Rufen Sie uns an',
    writeUs: 'Oder schreiben Sie uns',
    copyright: 'Frisco. Familienunternehmen statt Konzern.',
    city: 'Sereď & Nitra',
    privacy: 'Datenschutz',
    cookies: 'Cookies',
    madeBy: 'Erstellt mit Liebe von',
    navItems: [
      { label: 'Startseite', href: '/' },
      { label: 'Warum Frisco?', href: '/preco-frisco' },
      { label: 'Angebot', href: '/ponuka' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    servicesItems: ['Immobilienverkauf', 'Vermietung', 'Entwicklung', 'Investitionen'],
  },
};
