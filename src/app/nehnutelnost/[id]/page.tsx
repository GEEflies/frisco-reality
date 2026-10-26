import PropertyDetailContent from '@/components/PropertyDetailContent';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
import { listingKeys } from '@/api/queryKeys';
import type { Metadata } from 'next';
import { getPrimaryImage } from '@/api/listingsService';
import { getCachedAgentByUcId, getCachedListingById } from '@/api/listingsServer';
import { getLocalizedCategoryLabel, getLocalizedTitle, getLocalizedDescription } from '@/api/mappings';
import { SITE_URL, getRealEstateListingSchema, getBreadcrumbSchema } from '@/config/seo';
import { buildPageSocialMetadata, resolveServerLanguage } from '@/i18n/serverLanguage';
import type { LanguageCode } from '@/i18n/types';

// Export API numeric currency codes → ISO 4217
const CURRENCY_MAP: Record<number, string> = { 1: 'EUR', 3: 'CZK', 4: 'GBP', 5: 'USD', 6: 'PLN', 7: 'HUF', 8: 'RON', 9: 'RSD' };

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getCachedListingById(id);
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

  const categoryLabel = getLocalizedCategoryLabel(listing.category, language) || localized.categoryFallback;
  const location = [listing.location_city, listing.location_district].filter(Boolean).join(', ');
  // Export API uses numeric currency codes — map to ISO for Intl
  const currencyCode = CURRENCY_MAP[listing.price_currency] || 'EUR';
  const priceFormatted = new Intl.NumberFormat(localized.locale, { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 }).format(listing.price);

  // Keep the rendered <title> <= 65 chars where possible: the root layout template
  // appends " | FRISCO Reality", so use the bare listing title as an absolute title
  // when the suffix would not fit (never truncate the listing title itself).
  // Listings without a translation fall back to the Slovak title; add the localized
  // category so EN/DE titles stay unique across language versions.
  const localizedTitle = getLocalizedTitle(listing, language);
  const baseTitle = language !== 'sk' && localizedTitle === listing.title
    ? `${localizedTitle} – ${categoryLabel}`
    : localizedTitle;
  const BRAND_SUFFIX = ' | FRISCO Reality';
  const title = baseTitle.length + BRAND_SUFFIX.length <= 65
    ? baseTitle
    : { absolute: baseTitle };

  const MAX_DESC = 160;
  const summary = [
    `${localizedTitle} – ${priceFormatted}${location ? ` ${localized.locationIn} ${location}` : ''}.`,
    listing.usable_area ? `${localized.areaLabel} ${listing.usable_area} m².` : '',
    listing.rooms_count ? `${listing.rooms_count} ${localized.roomsLabel}.` : '',
  ].filter(Boolean).join(' ');
  const rawDescription = (getLocalizedDescription(listing, language) || '').replace(/\s+/g, ' ').trim();
  let description: string;
  if (rawDescription) {
    const full = `${summary} ${rawDescription}`;
    if (full.length <= MAX_DESC) {
      description = full;
    } else {
      const room = MAX_DESC - 1; // reserve one char for the ellipsis
      const cut = full.slice(0, room + 1);
      const lastSpace = cut.lastIndexOf(' ');
      const base = (lastSpace > 70 ? cut.slice(0, lastSpace) : full.slice(0, room)).replace(/[\s,.;:–-]+$/, '');
      description = `${base}…`;
    }
  } else {
    description = `${categoryLabel} ${localized.saleIn}${location ? ` ${localized.locationIn} ${location}` : ''} – ${priceFormatted}.`;
  }

  const primaryImage = getPrimaryImage(listing);
  const pagePath = `/nehnutelnost/${listing.slug || listing.id}`;

  return {
    title,
    description,
    ...buildPageSocialMetadata({
      title: `${localizedTitle} – ${priceFormatted}`,
      description,
      path: pagePath,
      language,
      type: 'article',
      image: primaryImage ? { url: primaryImage, width: 1200, height: 630, alt: localizedTitle } : null,
    }),
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  const listing = await getCachedListingById(id);
  const language = await resolveServerLanguage();
  const breadcrumbHome = language === 'de' ? 'Startseite' : language === 'en' ? 'Home' : 'Domov';
  const breadcrumbOffer = language === 'de' ? 'Angebot' : language === 'en' ? 'Listings' : 'Ponuka';
  const categoryFallback = language === 'de' ? 'Immobilie' : language === 'en' ? 'Property' : 'Nehnuteľnosť';

  const jsonLdScripts = [];
  
  if (listing) {
    const primaryImage = getPrimaryImage(listing);
    const pageUrl = `${SITE_URL}/nehnutelnost/${listing.slug || listing.id}`;
    const categoryLabel = getLocalizedCategoryLabel(listing.category, language) || categoryFallback;

    jsonLdScripts.push(
      getRealEstateListingSchema({
        name: listing.title,
        description: listing.description || `${categoryLabel} – ${listing.title}`,
        url: pageUrl,
        image: primaryImage ?? undefined,
        price: listing.price,
        currency: CURRENCY_MAP[listing.price_currency] || 'EUR',
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

  // Seed the React Query cache with the listing already fetched above (same key
  // as useListing) so the client component renders real content in the SSR HTML.
  const queryClient = getQueryClient();
  queryClient.setQueryData(listingKeys.detail(id), listing ?? null);
  if (listing?.agent_id) {
    const agentId = listing.agent_id;
    await queryClient.prefetchQuery({
      queryKey: ['agent', agentId] as const,
      queryFn: () => getCachedAgentByUcId(agentId),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLdScripts.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PropertyDetailContent id={id} />
    </HydrationBoundary>
  );
}
