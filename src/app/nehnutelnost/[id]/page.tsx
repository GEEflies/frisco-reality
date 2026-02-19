import PropertyDetailContent from '@/components/PropertyDetailContent';
import type { Metadata } from 'next';
import { fetchListingById, getPrimaryImage } from '@/api/listingsService';
import { categoryLabels } from '@/api/mappings';
import { SITE_URL, DEFAULT_OG_IMAGE, getRealEstateListingSchema, getBreadcrumbSchema } from '@/config/seo';

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListingById(id);

  if (!listing) {
    return {
      title: 'Nehnuteľnosť nenájdená',
      description: 'Požadovaná nehnuteľnosť nebola nájdená v našej ponuke.',
      robots: { index: false, follow: true },
    };
  }

  const categoryLabel = categoryLabels[listing.category_id] || 'Nehnuteľnosť';
  const location = [listing.location_city, listing.location_district].filter(Boolean).join(', ');
  const priceFormatted = new Intl.NumberFormat('sk-SK', { style: 'currency', currency: listing.currency || 'EUR', maximumFractionDigits: 0 }).format(listing.price);
  
  const title = `${listing.title} | ${categoryLabel}${location ? ` – ${location}` : ''}`;
  const description = listing.description
    ? `${listing.title} za ${priceFormatted}${location ? ` v lokalite ${location}` : ''}. ${listing.usable_area ? `Úžitková plocha ${listing.usable_area} m².` : ''} ${listing.rooms_count ? `${listing.rooms_count} izby.` : ''} ${listing.description.slice(0, 120)}...`
    : `${categoryLabel} na predaj${location ? ` v ${location}` : ''} za ${priceFormatted}. Prezrite si detaily a fotografie na Frisco Reality.`;

  const primaryImage = getPrimaryImage(listing);
  const pageUrl = `${SITE_URL}/nehnutelnost/${listing.slug || listing.id}`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${listing.title} – ${priceFormatted}`,
      description: description.slice(0, 200),
      url: pageUrl,
      type: 'article',
      images: primaryImage
        ? [{ url: primaryImage, width: 1200, height: 630, alt: listing.title }]
        : [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'Frisco Reality' }],
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

  const jsonLdScripts = [];
  
  if (listing) {
    const primaryImage = getPrimaryImage(listing);
    const pageUrl = `${SITE_URL}/nehnutelnost/${listing.slug || listing.id}`;
    const categoryLabel = categoryLabels[listing.category_id] || 'Nehnuteľnosť';

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
        { name: 'Domov', url: SITE_URL },
        { name: 'Ponuka', url: `${SITE_URL}/ponuka` },
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
