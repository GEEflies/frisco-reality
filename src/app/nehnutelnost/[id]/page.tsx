import PropertyDetailContent from '@/components/PropertyDetailContent';
import type { Metadata } from 'next';
import { fetchListingById, getPrimaryImage } from '@/api/listingsService';
import { getLocalizedCategoryLabel } from '@/api/mappings';
import { SITE_URL, DEFAULT_OG_IMAGE, getRealEstateListingSchema, getBreadcrumbSchema } from '@/config/seo';
import { buildLanguageAlternates, resolveServerLanguage } from '@/i18n/serverLanguage';
import type { LanguageCode } from '@/i18n/types';

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListingById(id);
  const language = await resolveServerLanguage();

  const copy: Record<LanguageCode, {
    notFoundTitle: string;
    notFoundDescription: string;
    categoryFallback: string;
    locationIn: string;
    areaLabel: string;
    roomsLabel: string;
    saleIn: string;
    locale: string;
  }> = {
    sk: {
      notFoundTitle: 'Nehnuteľnosť nenájdená',
      notFoundDescription: 'Požadovaná nehnuteľnosť nebola nájdená v našej ponuke.',
      categoryFallback: 'Nehnuteľnosť',
      locationIn: 'v lokalite',
      areaLabel: 'Úžitková plocha',
      roomsLabel: 'izby',
      saleIn: 'na predaj',
      locale: 'sk-SK',
    },
    en: {
      notFoundTitle: 'Property not found',
      notFoundDescription: 'The requested property was not found in our listings.',
      categoryFallback: 'Property',
      locationIn: 'in',
      areaLabel: 'Usable area',
      roomsLabel: 'rooms',
      saleIn: 'for sale',
      locale: 'en-US',
    },
    de: {
      notFoundTitle: 'Immobilie nicht gefunden',
      notFoundDescription: 'Die angeforderte Immobilie wurde in unserem Angebot nicht gefunden.',
      categoryFallback: 'Immobilie',
      locationIn: 'in',
      areaLabel: 'Nutzfläche',
      roomsLabel: 'Zimmer',
      saleIn: 'zu verkaufen',
      locale: 'de-DE',
    },
  };
  const localized = copy[language];

  if (!listing) {
    return {
      title: localized.notFoundTitle,
      description: localized.notFoundDescription,
      robots: { index: false, follow: true },
    };
  }

  const categoryLabel = getLocalizedCategoryLabel(listing.category_id, language) || localized.categoryFallback;
  const location = [listing.location_city, listing.location_district].filter(Boolean).join(', ');
  const priceFormatted = new Intl.NumberFormat(localized.locale, { style: 'currency', currency: listing.currency || 'EUR', maximumFractionDigits: 0 }).format(listing.price);
  
  const title = `${listing.title} | ${categoryLabel}${location ? ` – ${location}` : ''}`;
  const description = listing.description
    ? `${listing.title} – ${priceFormatted}${location ? ` ${localized.locationIn} ${location}` : ''}. ${listing.usable_area ? `${localized.areaLabel} ${listing.usable_area} m².` : ''} ${listing.rooms_count ? `${listing.rooms_count} ${localized.roomsLabel}.` : ''} ${listing.description.slice(0, 120)}...`
    : `${categoryLabel} ${localized.saleIn}${location ? ` ${localized.locationIn} ${location}` : ''} – ${priceFormatted}.`;

  const primaryImage = getPrimaryImage(listing);
  const pagePath = `/nehnutelnost/${listing.slug || listing.id}`;
  const pageUrl = `${SITE_URL}${pagePath}`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: buildLanguageAlternates(pagePath, language),
    openGraph: {
      title: `${listing.title} – ${priceFormatted}`,
      description: description.slice(0, 200),
      url: pageUrl,
      type: 'article',
      images: primaryImage
        ? [{ url: primaryImage, width: 1200, height: 630, alt: listing.title }]
        : [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'FRISCO Reality' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${listing.title} – ${priceFormatted}`,
      description: description.slice(0, 200),
      images: primaryImage ? [primaryImage] : [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  const listing = await fetchListingById(id);
  const language = await resolveServerLanguage();
  const breadcrumbHome = language === 'de' ? 'Startseite' : language === 'en' ? 'Home' : 'Domov';
  const breadcrumbOffer = language === 'de' ? 'Angebot' : language === 'en' ? 'Listings' : 'Ponuka';
  const categoryFallback = language === 'de' ? 'Immobilie' : language === 'en' ? 'Property' : 'Nehnuteľnosť';

  const jsonLdScripts = [];
  
  if (listing) {
    const primaryImage = getPrimaryImage(listing);
    const pageUrl = `${SITE_URL}/nehnutelnost/${listing.slug || listing.id}`;
    const categoryLabel = getLocalizedCategoryLabel(listing.category_id, language) || categoryFallback;

    jsonLdScripts.push(
      getRealEstateListingSchema({
        name: listing.title,
        description: listing.description || `${categoryLabel} – ${listing.title}`,
        url: pageUrl,
        image: primaryImage,
        price: listing.price,
        currency: listing.currency || 'EUR',
        address: {
          city: listing.location_city || undefined,
          region: listing.location_region || undefined,
          street: listing.street || undefined,
        },
        floorSize: listing.usable_area || undefined,
        numberOfRooms: listing.rooms_count || undefined,
      })
    );

    jsonLdScripts.push(
      getBreadcrumbSchema([
        { name: breadcrumbHome, url: SITE_URL },
        { name: breadcrumbOffer, url: `${SITE_URL}/ponuka` },
        { name: listing.title, url: pageUrl },
      ])
    );
  }

  return (
    <>
      {jsonLdScripts.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PropertyDetailContent id={id} />
    </>
  );
}
