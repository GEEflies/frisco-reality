/**
 * Central SEO Configuration
 * All SEO constants, structured data helpers, and metadata defaults
 */

export const SITE_URL = 'https://frisco.sk';
export const SITE_NAME = 'Frisco Reality';
export const SITE_LOCALE = 'sk_SK';
export const SITE_LANGUAGE = 'sk';

type SeoLanguage = 'sk' | 'en' | 'de';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const COMPANY_INFO = {
  name: 'FRISCO, s.r.o.',
  legalName: 'FRISCO, s.r.o.',
  url: SITE_URL,
  email: 'info@frisco.sk',
  phone: '+421905447220',
  phoneDisplay: '0905 447 220',
  ico: '43 850 553',
  dic: '2022486895',
  address: {
    street: 'Námestie Slobody 30/1185',
    city: 'Sereď',
    postalCode: '926 01',
    country: 'SK',
    region: 'Trnavský kraj',
  },
  geo: {
    lat: 48.286393,
    lng: 17.739730,
  },
  social: {
    instagram: 'https://www.instagram.com/friscoreality/',
    facebook: 'https://www.facebook.com/Friscorealitka/',
  },
  openingHours: [
    'Mo-Fr 09:00-18:00',
    'Sa 10:00-14:00',
  ],
};

/**
 * JSON-LD: Organization schema
 */
export function getOrganizationSchema(language: SeoLanguage = 'sk') {
  const localized = {
    sk: {
      areaServed: 'Slovensko',
      description: 'Prémiová realitná kancelária špecializujúca sa na predaj a prenájom luxusných nehnuteľností na Slovensku. Rodinná firma s osobným prístupom a rokmi skúseností.',
    },
    en: {
      areaServed: 'Slovakia',
      description: 'Premium real estate agency focused on sales and rentals of high-end properties in Slovakia. Family business with a personal approach and years of experience.',
    },
    de: {
      areaServed: 'Slowakei',
      description: 'Premium-Immobilienagentur für Verkauf und Vermietung hochwertiger Immobilien in der Slowakei. Familienunternehmen mit persönlichem Ansatz und langjähriger Erfahrung.',
    },
  }[language];

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${SITE_URL}/#organization`,
    name: COMPANY_INFO.name,
    legalName: COMPANY_INFO.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/frisco-logo.png`,
    image: DEFAULT_OG_IMAGE,
    email: COMPANY_INFO.email,
    telephone: COMPANY_INFO.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_INFO.address.street,
      addressLocality: COMPANY_INFO.address.city,
      postalCode: COMPANY_INFO.address.postalCode,
      addressRegion: COMPANY_INFO.address.region,
      addressCountry: COMPANY_INFO.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: COMPANY_INFO.geo.lat,
      longitude: COMPANY_INFO.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
    sameAs: [
      COMPANY_INFO.social.instagram,
      COMPANY_INFO.social.facebook,
    ],
    areaServed: {
      '@type': 'Country',
      name: localized.areaServed,
    },
    priceRange: '€€€',
    description: localized.description,
  };
}

/**
 * JSON-LD: WebSite schema with SearchAction
 */
export function getWebSiteSchema(language: SeoLanguage = 'sk') {
  const inLanguage = language === 'de' ? 'de' : language === 'en' ? 'en' : SITE_LANGUAGE;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/ponuka?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * JSON-LD: BreadcrumbList schema
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * JSON-LD: FAQPage schema
 */
export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * JSON-LD: RealEstateListing for individual property pages
 */
export function getRealEstateListingSchema(listing: {
  name: string;
  description: string;
  url: string;
  image?: string;
  price: number;
  currency: string;
  address: {
    city?: string;
    region?: string;
    street?: string;
  };
  floorSize?: number;
  numberOfRooms?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.name,
    description: listing.description,
    url: listing.url,
    ...(listing.image && { image: listing.image }),
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: listing.currency,
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.address.city || '',
      addressRegion: listing.address.region || '',
      ...(listing.address.street && { streetAddress: listing.address.street }),
      addressCountry: 'SK',
    },
    ...(listing.floorSize && {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: listing.floorSize,
        unitCode: 'MTK',
      },
    }),
    ...(listing.numberOfRooms && { numberOfRooms: listing.numberOfRooms }),
  };
}

/**
 * JSON-LD: LocalBusiness (contact page)
 */
export function getLocalBusinessSchema(language: SeoLanguage = 'sk') {
  const country = language === 'de' ? 'Slowakei' : language === 'en' ? 'Slovakia' : 'Slovensko';

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: COMPANY_INFO.name,
    image: DEFAULT_OG_IMAGE,
    url: SITE_URL,
    telephone: COMPANY_INFO.phone,
    email: COMPANY_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_INFO.address.street,
      addressLocality: COMPANY_INFO.address.city,
      postalCode: COMPANY_INFO.address.postalCode,
      addressRegion: COMPANY_INFO.address.region,
      addressCountry: COMPANY_INFO.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: COMPANY_INFO.geo.lat,
      longitude: COMPANY_INFO.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
    sameAs: [
      COMPANY_INFO.social.instagram,
      COMPANY_INFO.social.facebook,
    ],
    hasMap: 'https://www.google.com/maps?cid=12293961476159398039',
    areaServed: country,
  };
}

/**
 * JSON-LD: Service schema (for service pages)
 */
export function getServiceSchema(service: {
  name: string;
  description: string;
  url: string;
}, language: SeoLanguage = 'sk') {
  const areaServed = language === 'de' ? 'Slowakei' : language === 'en' ? 'Slovakia' : 'Slovensko';

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: areaServed,
    },
    serviceType: 'Real Estate',
  };
}
