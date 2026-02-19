import type { LanguageCode } from '@/i18n/LanguageProvider';

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
  title: string;
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
    title: 'Vašu nehnuteľnosť',
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
    label: 'Exclusive real estate agency in Sered',
    title: 'Your property',
    verbs: ['we will find', 'we will photograph', 'we will present', 'we will rent', 'we will sell', 'or we will buy'],
    subtitle: 'For 18 years we have helped owners sell and rent their properties under the best conditions and helped buyers find a place they can call home.',
    offerLong: 'View current listings',
    offerShort: 'Listings',
    sellLong: 'I want to sell my property',
    sellShort: 'I want to sell',
    rentLong: 'I want to rent out my property',
    rentShort: 'I want to rent',
  },
  de: {
    label: 'Exklusive Immobilienagentur in Sered',
    title: 'Ihre Immobilie',
    verbs: ['wir finden', 'wir fotografieren', 'wir präsentieren', 'wir vermieten', 'wir verkaufen', 'oder wir kaufen'],
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
    label: 'Exclusive real estate agency in Sered',
    title: 'Your property',
    verbs: ['we will find', 'we will photograph', 'we will present', 'we will rent', 'we will sell', 'or we will buy'],
    subtitle: 'For 18 years we have helped owners sell and rent under the best conditions and helped clients find a place they can call home.',
    offer: 'View current listings',
    sell: 'I want to sell',
    rent: 'I want to rent',
  },
  de: {
    label: 'Exklusive Immobilienagentur in Sered',
    title: 'Ihre Immobilie',
    verbs: ['wir finden', 'wir fotografieren', 'wir präsentieren', 'wir vermieten', 'wir verkaufen', 'oder wir kaufen'],
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
